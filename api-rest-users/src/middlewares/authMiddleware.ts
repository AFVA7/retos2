import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const jwtConfig = require('../config/jwtConfig');

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log("🚀 ~ authMiddleware ~ token:", token)

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied.' });
  }

  try {
    console.log("🚀 ~ authMiddleware ~ secret:", jwtConfig.secret)
    const decoded = jwt.verify(token,  jwtConfig.secret as string);
    console.log("🚀 ~ authMiddleware ~ decoded:", decoded)
    
    req.body.user = decoded; 
    next();
  } catch (error) {
    console.log("🚀 ~ authMiddleware ~ error:", error)
    res.status(401).json({ message: 'Token is not valid.' });
  }
};
