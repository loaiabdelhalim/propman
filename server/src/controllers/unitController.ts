import { Request, Response } from 'express';
import * as unitService from '../services/unitService';
import { UnitType } from '@prisma/client';

const validUnitTypes: UnitType[] = ['Apartment', 'Office', 'Garden', 'Parking'];

export const createBulk = async (req: Request, res: Response): Promise<void> => {
  try {
    const { buildingId, units } = req.body;

    // Basic validation
    if (!buildingId || !units || !Array.isArray(units)) {
      res.status(400).json({ 
        error: 'Missing required fields: buildingId, units (array)' 
      });
      return;
    }

    if (units.length === 0) {
      res.status(400).json({ error: 'Units array cannot be empty' });
      return;
    }

    // Validate each unit
    for (let i = 0; i < units.length; i++) {
      const unit = units[i];
      
      if (!unit.unitNumber || !unit.type || unit.sizeSqm === undefined || unit.coOwnershipShare === undefined) {
        res.status(400).json({ 
          error: `Unit at index ${i} is missing required fields: unitNumber, type, sizeSqm, coOwnershipShare` 
        });
        return;
      }

      if (!validUnitTypes.includes(unit.type)) {
        res.status(400).json({ 
          error: `Unit at index ${i} has invalid type. Must be one of: ${validUnitTypes.join(', ')}` 
        });
        return;
      }

      if (typeof unit.sizeSqm !== 'number' || unit.sizeSqm <= 0) {
        res.status(400).json({ 
          error: `Unit at index ${i} has invalid sizeSqm. Must be a positive number` 
        });
        return;
      }

      if (typeof unit.coOwnershipShare !== 'number' || unit.coOwnershipShare < 0 || unit.coOwnershipShare > 1) {
        res.status(400).json({ 
          error: `Unit at index ${i} has invalid coOwnershipShare. Must be a number between 0 and 1 (inclusive)` 
        });
        return;
      }
    }

    const result = await unitService.createBulk({
      buildingId,
      units,
    });

    res.status(201).json(result);
  } catch (error: any) {
    console.error('Error creating units in bulk:', error);
    if (error.message === 'Building not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create units' });
    }
  }
};

export const getByBuildingId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { buildingId } = req.params;
    const units = await unitService.getByBuildingId(buildingId);
    res.status(200).json(units);
  } catch (error) {
    console.error('Error fetching units:', error);
    res.status(500).json({ error: 'Failed to fetch units' });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const unit = await unitService.getById(id);

    if (!unit) {
      res.status(404).json({ error: 'Unit not found' });
      return;
    }

    res.status(200).json(unit);
  } catch (error) {
    console.error('Error fetching unit:', error);
    res.status(500).json({ error: 'Failed to fetch unit' });
  }
};

