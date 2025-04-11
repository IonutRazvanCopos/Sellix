import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import bcrypt from 'bcrypt';
import prisma from '../config/prisma';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email și parolă sunt obligatorii.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: 'Email deja folosit.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: 'Utilizator înregistrat cu succes!',
      userId: newUser.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Eroare internă.' });
  }
};


export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email și parolă sunt obligatorii.' });
    }
  
    try {
      const user = await prisma.user.findUnique({ where: { email } });
  
      if (!user) {
        return res.status(404).json({ message: 'Utilizator inexistent.' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Parolă incorectă.' });
      }
  
      const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET as string, {
        expiresIn: '1h',
      });
  
      return res.status(200).json({ message: 'Autentificare reușită!', token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Eroare internă.' });
    }
  };

  export const getMe = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
  
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });
  
      if (!user) {
        return res.status(404).json({ message: 'Utilizator inexistent.' });
      }
  
      res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Eroare internă.' });
    }
  };