import bwipjs from 'bwip-js';
import { promisify } from 'util';

export const generateBarcode = async (data: string): Promise<string> => {
  // promisify bwipjs to get a base64 string or data buffer
  const toBuffer = promisify(bwipjs.toBuffer);
  try {
    const png = await toBuffer({
      bcid: 'code128',       // Barcode type
      text: data,           // Text to encode
      scale: 3,             // 3x scaling factor
      height: 10,           // Bar height, in millimeters
      includetext: true,    // Show human-readable text
      textxalign: 'center', // Always good to set this
    }) as Buffer
    // Convert PNG buffer to base64
    return `data:image/png;base64,${png.toString('base64')}`;
  } catch (error) {
    console.error('Error generating barcode:', error);
    throw error;
  }
};
