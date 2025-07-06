import { Router } from 'express';
import { AuthService } from '../auth';

const router = Router();

// Register a new user
router.post('/register', async (req: any, res: any) => {
  try {
    const { username, password, email, name } = req.body as { username: string; password: string; email?: string; name?: string };

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }

    // Create user
    const user = await AuthService.createUser({
      username,
      password,
      email,
      name
    });

    res.status(201).json({
      message: 'User created successfully',
      user
    });
  } catch (error: any) {
    if (error.message === 'User already exists') {
      return res.status(409).json({ 
        error: 'User already exists' 
      });
    }
    
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Login user
router.post('/login', async (req: any, res: any) => {
  try {
    const { username, password } = req.body as { username: string; password: string };

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password are required' 
      });
    }

    // Authenticate user
    const user = await AuthService.authenticateUser({ username, password });

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid username or password' 
      });
    }

    res.json({
      message: 'Login successful',
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Get user profile (protected route)
router.get('/profile/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const user = await AuthService.getUserById(id);

    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    res.json({ user });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

export default router; 