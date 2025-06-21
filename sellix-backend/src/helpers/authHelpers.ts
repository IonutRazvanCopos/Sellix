import prisma from '../config/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({ where: { email } });
}

export async function createUser(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
}

export function generateToken(userId: number, email: string, username: string) {
  return jwt.sign({ userId, email, username }, process.env.JWT_SECRET!, {
    expiresIn: '8h',
  });
}

export async function comparePasswords(plain: string, hash: string) {
  return await bcrypt.compare(plain, hash);
}

export async function getUserProfile(userId: number) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      createdAt: true,
      username: true,
      phone: true,
      city: true,
      county: true,
      avatar: true,
    },
  });
}

export async function updateProfile(userId: number, data: any) {
  return await prisma.user.update({
    where: { id: userId },
    data,
  });
}

export async function getUserListings(userId: number) {
  return await prisma.listing.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}