import { prisma } from '../config/database';
import { Unit, UnitType } from '@prisma/client';

export interface CreateUnitInput {
  buildingId: string;
  unitNumber: string;
  type: UnitType;
  floor?: string;
  entrance?: string;
  sizeSqm: number;
  coOwnershipShare: number;
  constructionYear?: number;
  rooms?: number;
}

export interface BulkCreateUnitsInput {
  buildingId: string;
  units: Omit<CreateUnitInput, 'buildingId'>[];
}

export const createBulk = async (input: BulkCreateUnitsInput): Promise<{ count: number; units: Unit[] }> => {
  // Verify building exists
  const building = await prisma.building.findUnique({
    where: { id: input.buildingId },
  });

  if (!building) {
    throw new Error('Building not found');
  }

  // Prepare units data with buildingId
  const unitsData = input.units.map(unit => ({
    buildingId: input.buildingId,
    unitNumber: unit.unitNumber,
    type: unit.type,
    floor: unit.floor || null,
    entrance: unit.entrance || null,
    sizeSqm: unit.sizeSqm,
    coOwnershipShare: unit.coOwnershipShare,
    constructionYear: unit.constructionYear || null,
    rooms: unit.rooms || null,
  }));

  // Use transaction for bulk insert
  const result = await prisma.$transaction(async (tx) => {
    // Use createMany for efficiency with large datasets
    await tx.unit.createMany({
      data: unitsData,
      skipDuplicates: false, // Set to true if you want to skip duplicates
    });

    // Fetch the created units to return them
    const createdUnits = await tx.unit.findMany({
      where: {
        buildingId: input.buildingId,
        unitNumber: {
          in: input.units.map(u => u.unitNumber),
        },
      },
      orderBy: {
        unitNumber: 'asc',
      },
    });

    return createdUnits;
  });

  return {
    count: result.length,
    units: result,
  };
};

export const getByBuildingId = async (buildingId: string): Promise<Unit[]> => {
  return await prisma.unit.findMany({
    where: { buildingId },
    orderBy: {
      unitNumber: 'asc',
    },
  });
};

export const getById = async (id: string): Promise<Unit | null> => {
  return await prisma.unit.findUnique({
    where: { id },
    include: {
      building: {
        include: {
          property: true,
        },
      },
    },
  });
};

