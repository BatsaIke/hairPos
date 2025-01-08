import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

// Interface for Order Items
export interface OrderItem {
  productId: mongoose.Schema.Types.ObjectId; // Reference to Product schema
  name: string;
  price: number;
  quantity: number;
}

// Interface for the Order Schema
export interface IOrder extends Document {
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: string; // e.g., "Pending", "Completed", "Cancelled"
  createdBy: IUser['_id']; // Reference to the user who created the order
  createdAt?: Date;
  updatedAt?: Date;
}

// Mongoose Schema for Orders
const OrderSchema: Schema = new Schema(
  {
    customerName: { type: String,  },
    customerPhone: { type: String},
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'Pending' }, // Default status is "Pending"
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Associate order with user
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', OrderSchema);
