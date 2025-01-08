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
