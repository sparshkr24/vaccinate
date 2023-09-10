import { hash } from "bcrypt";
import prisma from "../../prisma/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  console.log('register api called')

  if (req.method != "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { username, email, password, mobile, city, age } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email not found" });
  }

  try {
    // Check if the email already exists in the database
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        mobile,
        city,
        age,
        role: "CLIENT",
      },
    });

    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id }, "sparsh");

    // Set the token as an HTTP-only cookie
    const data = { newUser, token };

    return res
      .status(201)
      .json({ message: "User registered successfully", user: data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
