import { User, IUser } from '../models/userModel';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jwtConfig = require('../config/jwtConfig');


export const userService = {
    register: async (userData: IUser) => {
        const { name, lastname, email, password, phone, birthdate, address } = userData;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            lastname,
            email,
            password: hashedPassword,
            phone,
            birthdate,
            address,
        });

        return await user.save();
    },

    getById: async (id: string) => {
        return await User.findById(id);
    },

    getAll: async () => {
        return await User.find();
    },

    update: async (id: string, userData: IUser) => {
        const user = await User.findById(id);
        if (!user) {
            return null;
        }
        const { name, lastname, email, password, phone, birthdate, address } = userData;
        user.name = name;
        user.lastname = lastname;
        user.email = email;
        user.phone = phone;
        user.birthdate = birthdate;
        user.address = address;
        if (password) {
            user.password = await bcrypt.hash(password, 8);
        }
        return await user.save();
    },

    delete: async (id: string) => {
        return await User.findByIdAndDelete(id);
    },

    login: async (email: string, password: string) => {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw { status: 401, message: 'Invalid email or password' };
        }
        const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, jwtConfig.secret, { expiresIn: '48h' });
        return token;
    },

    listUsers: async (page: number, limit: number) => {
        const skip = (page - 1) * limit;
        const users = await User.find().skip(skip).limit(limit);
        const totalUsers = await User.countDocuments();

        return {
            totalUsers,
            page,
            totalPages: Math.ceil(totalUsers / limit),
            users,
        };
    },

    // forgotPassword: async (req: Request, res: Response) => {
    //     const { email } = req.body;

    //     if (!email) {
    //         return res.status(400).json({ message: 'Email is required.' });
    //     }

    //     try {
    //         const user = await User.findOne({ email });
    //         if (!user) {
    //             return res.status(404).json({ message: 'No user found with the provided email.' });
    //         }

    //         const resetToken = generateResetToken(user.id);
    //         const resetLink = `https://yourfrontend.com/reset-password?token=${resetToken}`;

    //         await sendResetEmail(user.email, resetLink);

    //         res.status(200).json({ message: 'Password recovery link has been sent to your email.' });
    //     } catch (error) {
    //         res.status(500).json({ message: 'Internal server error.' });
    //     }
    // },

};
