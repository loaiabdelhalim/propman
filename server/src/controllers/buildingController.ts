import { Request, Response } from 'express';
import * as buildingService from '../services/buildingService';

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { propertyId, address, additionalDetails } = req.body;

    // Basic validation
    if (!propertyId || !address) {
      res.status(400).json({ 
        error: 'Missing required fields: propertyId, address' 
      });
      return;
    }

    // Validate address structure
    if (!address.street || !address.houseNumber) {
      res.status(400).json({ 
        error: 'Address must include street and houseNumber' 
      });
      return;
    }

    const building = await buildingService.create({
      propertyId,
      address,
      additionalDetails,
    });

    res.status(201).json(building);
  } catch (error: any) {
    console.error('Error creating building:', error);
    if (error.message === 'Property not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create building' });
    }
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const building = await buildingService.getById(id);

    if (!building) {
      res.status(404).json({ error: 'Building not found' });
      return;
    }

    res.status(200).json(building);
  } catch (error) {
    console.error('Error fetching building:', error);
    res.status(500).json({ error: 'Failed to fetch building' });
  }
};

export const getByPropertyId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { propertyId } = req.params;
    const buildings = await buildingService.getByPropertyId(propertyId);
    res.status(200).json(buildings);
  } catch (error) {
    console.error('Error fetching buildings:', error);
    res.status(500).json({ error: 'Failed to fetch buildings' });
  }
};

