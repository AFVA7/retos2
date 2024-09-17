import { Router } from 'express';
import { registerUser, getUserById, getUsers, deleteUser, login, updateUser } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { check } from 'express-validator';

const router = Router();

router.post(
  '/users',
  [
    check('name').isLength({ min: 3 }),
    check('lastname').isLength({ min: 3 }),
    check('email').isEmail(),
    check('password').isLength({ min: 8 }),
  ],
  registerUser
);

router.get('/users/:id', getUserById);

router.get('/users/', getUsers);

router.delete('/users/:id', authMiddleware, deleteUser);

router.post('/login', [
    check('email').isEmail(),
    check('password').isLength({ min: 8 }),
], login);

router.put('/users/:id',
    [
        check('name').isLength({ min: 3 }),
        check('lastname').isLength({ min: 3 }),
        check('email').isEmail(),
    ],
    authMiddleware,
    updateUser);



// router.post('/forgot-password', forgotPassword);

export default router;
