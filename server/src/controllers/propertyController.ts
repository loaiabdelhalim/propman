import { Request, Response } from 'express';
import * as propertyService from '../services/propertyService';

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const properties = await propertyService.getAll();
    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const property = await propertyService.getById(id);

    if (!property) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }

    res.status(200).json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, managementType, propertyManagerId, accountantId, declarationOfDivision } = req.body;

    // Basic validation
    if (!name || !managementType || !propertyManagerId || !accountantId) {
      res.status(400).json({ 
        error: 'Missing required fields: name, managementType, propertyManagerId, accountantId' 
      });
      return;
    }

    // Validate managementType enum
    if (managementType !== 'WEG' && managementType !== 'MV') {
      res.status(400).json({ error: 'managementType must be either "WEG" or "MV"' });
      return;
    }

    const property = await propertyService.create({
      name,
      managementType,
      propertyManagerId,
      accountantId,
      declarationOfDivision,
    });

    res.status(201).json(property);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
};

