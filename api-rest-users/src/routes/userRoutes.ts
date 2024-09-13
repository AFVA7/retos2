import { Router } from 'express';
import { registerUser, getUserById, getUsers, deleteUser, login, updateUser } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { check } from 'express-validator';

const router = Router();

router.post(
  '/',
  [
    check('name').isLength({ min: 3 }),
    check('lastname').isLength({ min: 3 }),
    check('email').isEmail(),
    check('password').isLength({ min: 8 }),
  ],
  registerUser
);

router.get('/:id', getUserById);

router.get('/', getUsers);

router.delete('/:id', authMiddleware, deleteUser);

router.post('/login', [
    check('email').isEmail(),
    check('password').isLength({ min: 8 }),
], login);

router.put('/:id',
    [
        check('name').isLength({ min: 3 }),
        check('lastname').isLength({ min: 3 }),
        check('email').isEmail(),
    ],
    authMiddleware,
    updateUser);



// router.post('/forgot-password', forgotPassword);

export default router;
