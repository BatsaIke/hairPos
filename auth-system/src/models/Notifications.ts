import mongoose, { Schema, Document } from 'mongoose';

// Interface for Notifications
export interface INotification extends Document {
  message: string;
  type: string; // e.g., 'order', 'user', 'system'
  userId?: mongoose.Schema.Types.ObjectId; // Optional reference to a user
  timestamp: Date;
  read: boolean;
}

const NotificationSchema: Schema = new Schema(
  {
    message: { type: String, required: true },
    type: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false }, // Optional
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

export default mongoose.model<INotification>('Notification', NotificationSchema);
