// src/controllers/userController.ts
import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import loggerE from '../utils/loggerE';
import Joi from 'joi';
import { joiValidation } from '../utils/utilsjoi';

// POST /api/register
export async function registerUser(req: Request, res: Response) {
  try {
    const joiSh = Joi.object({
      name: Joi.string().max(50).required(),
      email: Joi.string().max(50).required(),
      password: Joi.string().max(50).required()
    }).options({ stripUnknown: true })

    const { name, email, password }=  await joiValidation(joiSh, req.body)


    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create user
    const user = await User.create({ name, email, password });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error: any) {
    loggerE.error(`URL: ${req.url} ,  ${error}`)
    res.status(500).json({ message: error.message, error: error });
  }
};

// POST /api/login
export async function loginUser(req: Request, res: Response) {
  try {
    const joiSh = Joi.object({
      email: Joi.string().max(50).required(),
      password: Joi.string().max(50).required()
    }).options({ stripUnknown: true })
    const { email, password } = await joiValidation(joiSh, req.body)

    // Find user
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user._id, email);

    res.status(200).json({ token });
  } catch (error: any) {
    loggerE.error(`URL: ${req.url} ,  ${error}`)
    res.status(500).json({ message: error.message, error: error });
  }
};

// GET /api/profile
export async function getProfile(req: Request, res: Response) {
  try {
    const authReq = req as any; // To access user from auth middleware

    if (!authReq.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { name, email, createdAt } = authReq.user;

    res.status(200).json({ name, email, registrationDate: createdAt });

  } catch (error: any) {
    loggerE.error(`URL: ${req.url} ,  ${error}`)
    res.status(500).json({ message: error.message, error: error });
  }
};
