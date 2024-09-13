import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { validationResult } from 'express-validator';

export const registerUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await userService.register(req.body);
    res.status(201).json(user);
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const users = await userService.listUsers(page, limit);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await userService.getById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const loggedInUserId = req.body.user.id;

    if (userId !== loggedInUserId) {
      return res.status(403).json({ message: 'Forbidden: You can only update your own data.' });
    }

    const updatedUser = await userService.update(userId, req.body);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.delete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const token = await userService.login(email, password);
        res.json({ token });
    } catch (error:any) {
        res.status(500).json({ message: error.message });
    }
}


// export const forgotPassword = async (req: Request, res: Response) => {
//     try {
//         await userService.forgotPassword(req, res); 
//     } catch (error:any) {
//         res.status(500).json({ message: error.message });
//     }
// };


