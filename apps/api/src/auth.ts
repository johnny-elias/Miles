import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export interface CreateUserData {
  username: string;
  password: string;
  email?: string;
  name?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export class AuthService {
  // Create a new user with hashed password
  static async createUser(data: CreateUserData) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { username: data.username },
            ...(data.email ? [{ email: data.email }] : [])
          ]
        }
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash the password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);

      // Create the user
      const user = await prisma.user.create({
        data: {
          username: data.username,
          password: hashedPassword,
          email: data.email,
          name: data.name
        }
      });

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  // Authenticate user login
  static async authenticateUser(data: LoginData) {
    try {
      // Find user by username
      const user = await prisma.user.findUnique({
        where: { username: data.username }
      });

      if (!user) {
        return null;
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(data.password, user.password);

      if (!isPasswordValid) {
        return null;
      }

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  // Get user by ID
  static async getUserById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id }
      });

      if (!user) {
        return null;
      }

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  // Update user password
  static async updatePassword(userId: string, newPassword: string) {
    try {
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
      });

      return true;
    } catch (error) {
      throw error;
    }
  }
} 