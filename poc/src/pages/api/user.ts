import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { firestore } from '../../libs/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req })
  if (!token) {
    res.status(401).end();
  }

  const user = await firestore.getUser(token!.email!);
  res.status(200).send({ email: user.email, address: user.address });
}
