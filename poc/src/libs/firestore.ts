import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { ethers } from 'ethers';

class Firestore {
  colectionName: string = 'users';
  db: admin.firestore.Firestore;

  constructor() {
    if (admin.apps.length === 0) {
      const cert = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      };
      admin.initializeApp({ credential: admin.credential.cert(cert) });
    }
    this.db = getFirestore();
  }

  async getUser(email: string): Promise<any> {
    const users = await this.db.collection(this.colectionName).where('email', '==', email).get().then(async (snapshot) => snapshot.docs.map((v) => v.data()));
    if (users.length > 0) {
      return users[0];
    } else {
      const docRef = this.db.collection(this.colectionName).doc();
      const wallet = ethers.Wallet.createRandom();
      const user = {
        docId: docRef.id,
        email,
        address: wallet.address,
        privateKey: wallet.privateKey,
      };
      await docRef.set(user);
      return user;
    }
  }

  async updateUserStatus(user: any, txHash: string) {
    const newUser = {
      ...user,
      txHash,
      txSentAt: Date.now(),
    };
    await this.db.collection(this.colectionName).doc(user.docId).set(newUser);
    return newUser;
  }
}
  
export const firestore = new Firestore();
