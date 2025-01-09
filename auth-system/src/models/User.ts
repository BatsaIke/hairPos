import mongoose, { Schema, Document } from 'mongoose';

// Extend the IUser interface
export interface IUser extends Document {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  role: 'admin' | 'user'; // Define roles as "admin" or "user"
}

const UserSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: false, match: /^[0-9]{10}$/ },
    password: { type: String, required: true },
    refreshToken: { type: String },
    resetPasswordToken: { type: String }, // Token for password reset
    resetPasswordExpires: { type: Date }, // Expiration time for reset token
    role: {
      type: String,
      enum: ['admin', 'user'], // Restrict values to "admin" or "user"
      default: 'admin', // Default to "user" if not specified
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

export default mongoose.model<IUser>('User', UserSchema);
