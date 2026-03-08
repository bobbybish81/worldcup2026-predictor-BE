import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import { generateToken } from "../utils/jwt.js";

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    await prisma.points.create({
      data: { userId: user.id },
    });

    res.json({ token: generateToken(user) });
  } catch (err) {
    res.status(400).json({ error: "User already exists" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({
    token: generateToken(user),
    user: {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    },
  });
};
