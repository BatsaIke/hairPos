import { AuthRequest } from '../types/AuthRequest'; // Import the updated AuthRequest type
import { Request, Response } from 'express';
import Product, { IProduct } from '../models/Products';
import cloudinary from '../utils/cloudinary';
import { generateQrCode, generateBarcode } from '../utils/codeGenerators';

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      name,
      category,
      subCategory,
      regularPrice,
      taxRate,
      inStock,
      sku,
    } = req.body;

    if (!req.authUser) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Handle optional image upload
    let imageUrl: string | undefined;
    if (req.file) {
      const cloudRes = await cloudinary.uploader.upload(req.file.path);
      imageUrl = cloudRes.secure_url;
    }

    // Generate barcode and/or QR code
    const barcode = await generateBarcode(sku || name);
    const qrCode = await generateQrCode(sku || name);

    const newProduct: IProduct = new Product({
      name,
      category,
      subCategory,
      regularPrice,
      taxRate,
      inStock,
      sku,
      imageUrl,
      barcode,
      qrCode,
      createdBy: req.authUser.id, // Associate with logged-in user
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAllProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.authUser) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Fetch products created by the logged-in user
    const products = await Product.find({ createdBy: req.authUser.id });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getProductById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.authUser) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const productId = req.params.id;
    const product = await Product.findOne({ _id: productId, createdBy: req.authUser.id });

    if (!product) {
      res.status(404).json({ message: 'Product not found or access denied' });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.authUser) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const productId = req.params.id;
    const {
      name,
      category,
      subCategory,
      regularPrice,
      discountPrice,
      taxRate,
      inStock,
      sku,
    } = req.body;

    let imageUrl: string | undefined;
    if (req.file) {
      const cloudRes = await cloudinary.uploader.upload(req.file.path);
      imageUrl = cloudRes.secure_url;
    }

    const product = await Product.findOneAndUpdate(
      { _id: productId, createdBy: req.authUser.id }, // Ensure user can only update their own products
      {
        name,
        category,
        subCategory,
        regularPrice,
        discountPrice,
        taxRate,
        inStock,
        sku,
        ...(imageUrl && { imageUrl }),
      },
      { new: true }
    );

    if (!product) {
      res.status(404).json({ message: 'Product not found or access denied' });
      return;
    }

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.authUser) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const productId = req.params.id;
    const product = await Product.findOneAndDelete({
      _id: productId,
      createdBy: req.authUser.id, // Ensure user can only delete their own products
    });

    if (!product) {
      res.status(404).json({ message: 'Product not found or access denied' });
      return;
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
