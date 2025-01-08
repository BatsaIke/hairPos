import mongoose, { Schema, Document } from 'mongoose';

// Extend the IProduct interface to include createdBy
export interface IProduct extends Document {
  name: string;
  category: string;
  subCategory?: string;
  regularPrice: number;
  taxRate?: number;
  inStock: number;
  sku?: string; // For stock-keeping unit or internal product code
  barcode?: string; // We'll store a barcode link or data here
  qrCode?: string;  // We'll store a QR code link or data here
  imageUrl?: string;
  createdBy: mongoose.Schema.Types.ObjectId; // Reference to the User who created the product
  [key: string]: any; // Allow for any additional fields
  
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    regularPrice: { type: Number, required: true },
    taxRate: { type: Number },
    inStock: { type: Number, default: 0 },
    sku: { type: String },
    barcode: { type: String },
    qrCode: { type: String },
    imageUrl: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

export default mongoose.model<IProduct>('Product', ProductSchema);
