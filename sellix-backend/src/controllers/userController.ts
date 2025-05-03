import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import {
  findUserByEmail,
  createUser,
  comparePasswords,
  generateToken,
  getUserProfile,
  updateProfile as updateUserProfile,
  getUserListings
} from '../helpers/authHelpers';

export async function register(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already used.' });
    }

    const newUser = await createUser(email, password);

    return res.status(201).json({
      message: 'User successfully registered!',
      userId: newUser.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal error.' });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User does not exist.' });

    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Incorrect password.' });

    const token = generateToken(user.id, user.email);
    return res.status(200).json({ message: 'Authentication successful!', token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal error.' });
  }
}

export async function getMe(req: AuthRequest, res: Response) {
  try {
    const user = await getUserProfile(req.user!.userId);
    if (!user) {
      return res.status(404).json({ message: 'User does not exist.' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal error.' });
  }
}

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    const { username, phone, city, county } = req.body;
    let avatarPath: string | undefined;

    if (req.files && (req.files as any).avatar) {
      const avatar = (req.files as any).avatar;
      const fileName = `${Date.now()}_${avatar.name}`;
      const uploadPath = `public/uploads/${fileName}`;
      await avatar.mv(uploadPath);
      avatarPath = `/uploads/${fileName}`;
    }

    const updatedUser = await updateUserProfile(req.user!.userId, {
      username,
      phone,
      city,
      county,
      ...(avatarPath && { avatar: avatarPath }),
    });

    res.json({ message: 'Profile updated successfully', updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
}

export async function getMyListings(req: AuthRequest, res: Response) {
  try {
    const listings = await getUserListings(req.user!.userId);
    res.json(listings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not fetch listings' });
  }
}