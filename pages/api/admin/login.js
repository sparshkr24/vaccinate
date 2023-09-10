import { compare } from 'bcrypt';
import prisma from '../../../prisma/prisma';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method != 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find the user by email
    const currentUser = await prisma.user.findUnique({ where: { email } });

    if (!currentUser) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log('role: ', currentUser.role);

    // Verify the password
    const passwordMatch = await compare(password, currentUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if the user's role is "admin"
    if (currentUser.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: currentUser.id }, 'sparsh', { expiresIn: '2h' });

    // Set the token as an HTTP-only cookie
    const data = { currentUser, token };

    return res.status(201).json({ message: 'User logged in successfully', user: data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
