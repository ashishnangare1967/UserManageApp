// src/controllers/adminController.ts
import { Request, Response } from 'express';
import User from '../models/User';
import loggerE from '../utils/loggerE';
import Joi from 'joi';
import { joiValidation } from '../utils/utilsjoi';

// POST /api/admin/users
export async function createUserByAdmin(req: Request, res: Response) {
  try {

    const joiSh = Joi.object({
      name: Joi.string().max(50).required(),
      email: Joi.string().max(50).required(),
      password: Joi.string().max(50).required(),
      role: Joi.string().max(50).valid('user', 'admin').default('user')
    }).options({ stripUnknown: true })
    const { name, email, password, role } = await joiValidation(joiSh, req.body)


    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create user
    const user = await User.create({ name, email, password, role: role });

    res.status(201).json({ message: 'User created successfully', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error: any) {
    loggerE.error(`URL: ${req.url} ,  ${error}`)
    res.status(500).json({ message: error.message, error: error });
  }
};

// GET /api/admin/users
export async function getAllUsers(req: Request, res: Response) {
  try {

    const joiSh = Joi.object({
      name: Joi.string().max(50),
      email: Joi.string().max(50),
      page: Joi.number().default(1),
      limit: Joi.number().max(50).default(10),
      role: Joi.string().max(50).valid('user', 'admin').default('user')
    }).options({ stripUnknown: true })

    const { page = 1, limit = 10, name, email, role } = await joiValidation(joiSh, req.query)

    const query: any = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (email) {
      query.email = { $regex: email, $options: 'i' };
    }

    if (role) {
      query.role = role;
    }


    const users = await User.find(query)
      .select('-password')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      total,
      page: Number(page),
      pageSize: users.length,
      users,
    });
  } catch (error: any) {
    loggerE.error(`URL: ${req.url} ,  ${error}`)
    res.status(500).json({ message: error.message, error: error });
  }
};

// PUT /api/admin/users/:id
export async function updateUser(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const joiSh = Joi.object({
      name: Joi.string().max(50),
      email: Joi.string().max(50),
      role: Joi.string().max(50).valid('user', 'admin')
    }).options({ stripUnknown: true })
    const { name, email, role } = await joiValidation(joiSh, req.body)


    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (email) {
      // Check for unique email
      const existingUser = await User.findOne({ email }).lean();
      if (existingUser && existingUser._id.toString() !== id) {
        throw new Error('Email already in use');
      }
      user.email = email;
    }
    if (role) {
      if (!['user', 'admin'].includes(role)) {
        throw new Error('Invalid role');
      }
      user.role = role;
    }

    await user.save();

    res.status(200).json({ message: 'User updated successfully', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error: any) {
    loggerE.error(`URL: ${req.url} ,  ${error}`)
    res.status(500).json({ message: error.message, error: error });
  }
};

// DELETE /api/admin/users/:id
export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const authReq = req as any; // To access user from auth middleware

    if (authReq.user._id.toString() === id) {
      throw new Error('Admins cannot delete themselves');
    }


    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error: any) {
    loggerE.error(`URL: ${req.url} ,  ${error}`)
    res.status(500).json({ message: error.message, error: error });
  }
};
