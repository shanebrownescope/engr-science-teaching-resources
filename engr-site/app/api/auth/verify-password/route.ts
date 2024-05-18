// import type { NextApiRequest, NextApiResponse } from 'next';
// import bcrypt from 'bcryptjs';
// import { getUserByEmail } from '@/database/data/user';

// export default async function POST(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {

//   console.log("----- in post")
//   // if (req.method !== 'POST') {
//   //   return res.status(405).json({ message: 'Method not allowed' });
//   // }

//   const { email, password } = req.body;

//   const user = await getUserByEmail(email);

//   if (!user || !user.password) {
//     return res.status(401).json({ message: 'Invalid credentials' });
//   }

//   const passwordsMatch = await bcrypt.compare(password, user.password);

//   if (passwordsMatch) {
//     const User: any = {
//       id: user.id,
//       name: user.name,
//       email: user.email,
//     };
//     return res.status(200).json(User);
//   }

//   return res.status(401).json({ message: 'Invalid credentials' });
// }