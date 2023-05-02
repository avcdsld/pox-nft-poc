import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { firestore } from '../../libs/firestore';
import { ethers } from '../../libs/ethers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req })
  if (!token) {
    return res.status(401).end();
  }

  const user = await firestore.getUser(token!.email!);

  // Txs should not be sent consecutively within 5 minutes.
  if (user.txSentAt && user.txSentAt + (1000 * 60 * 0) > Date.now()) {
    return res.status(200).send({ txHash: user.txHash });
  }

  // TODO: Check if already minted

  const exhibitionIndex = 1; // TODO: Move to env variable
  const name = req.body.name;
  const txHash = await ethers.mint(exhibitionIndex, user.address, name);
  await firestore.updateUserStatus(user, txHash);
  res.status(200).send({ txHash });
}
