import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  lastname: string;
  email: string;
  password: string;
  phone: string;
  birthdate: Date;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  birthdate: { type: Date, required: true },
  address: { type: String, required: true },
}, {
  timestamps: true, 
});

export const User = mongoose.model<IUser>('User', userSchema);
