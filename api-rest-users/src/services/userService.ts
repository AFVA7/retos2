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

        console.log("🚀 ~ authMiddleware ~ secret:", jwtConfig.secret)
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

  /**
 * Función para crear un token de restablecimiento de contraseña
 * @param {string} userId - El ID del usuario
 * @param {string} userEmail - El correo del usuario
 * @returns {string} - El token generado
 */
 createPasswordResetToken : (userId:string, userEmail:string) => {
    // Crea el payload del token, puedes incluir la información necesaria
    const payload = {
      id: userId,
      email: userEmail,
    };
  
    // Genera el token con una expiración de 1 hora
    const token = jwt.sign(payload, jwtConfig.secret, { expiresIn: '1h' });
  
    return token;
  },
  
  /**
   * Verifica la validez del token
   * @param {string} token - El token a verificar
   * @returns {Object|null} - Retorna los datos del token si es válido, o null si es inválido o expirado
   */
  verifyResetToken : (token: string) => {
    try {
      // Verifica y decodifica el token
      const decoded = jwt.verify(token, jwtConfig.secret);
      return decoded;
    } catch (error: any) {
      console.error('Token inválido o expirado:', error.message);
      return null;
    }
  },

};
