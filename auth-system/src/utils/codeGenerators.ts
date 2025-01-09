import bwipjs from 'bwip-js';
import { promisify } from 'util';

export const generateBarcode = async (data: string): Promise<string> => {
  const toBuffer = promisify(bwipjs.toBuffer);
  try {
    // Force-cast the returned 'png' to Buffer
    const png = (await toBuffer({
      bcid: 'code128',
      text: data,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: 'center',
    })) as Buffer;

    // Convert PNG buffer to base64
    return `data:image/png;base64,${png.toString('base64')}`;
  } catch (error) {
    console.error('Error generating barcode:', error);
    throw error;
  }
};

import QRCode from 'qrcode';

export const generateQrCode = async (data: string): Promise<string> => {
  try {
    // This returns a data URL of the QR code
    const qrCodeDataUrl = await QRCode.toDataURL(data);
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

