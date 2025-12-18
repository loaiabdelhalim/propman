import { Request, Response } from 'express';
import { groqService } from '../services/groqService';
import pdf from 'pdf-parse';

export const parseFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const uploadedFile = (req as any).file;
    if (!uploadedFile) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    // Only handle PDFs in this implementation
  if (uploadedFile.mimetype !== 'application/pdf') {
      res.status(400).json({ error: 'Only PDF files are supported for server-side parsing at the moment' });
      return;
    }

  // pdf-parse expects a Buffer or Uint8Array
  const dataBuffer = uploadedFile.buffer;
    const pdfData = await pdf(dataBuffer);
    const text = pdfData.text;

    if (!text || text.trim().length === 0) {
      res.status(422).json({ error: 'PDF contains no extractable text (maybe scanned image). Server-side OCR not configured.' });
      return;
    }

    const parsed = await groqService.extractPropertyInfo(text);

    res.status(200).json({ parsed });
  } catch (error: any) {
    console.error('Error parsing file:', error);
    res.status(500).json({ error: error.message || 'Failed to parse file' });
  }
};

export default { parseFile };
