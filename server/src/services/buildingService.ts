import {prisma} from '../config/database';
import {Building} from '@prisma/client';

export interface Address {
  street: string;
  houseNumber: string;
  postalCode?: string;
  city?: string;
  country?: string;
}

export interface CreateBuildingInput {
  propertyId: string;
  address: Address;
  additionalDetails?: string;
}

export const create = async (input: CreateBuildingInput): Promise<Building> => {
  // Verify property exists
  const property = await prisma.property.findUnique({
    where: { id: input.propertyId },
  });

  if (!property) {
    throw new Error('Property not found');
  }

  return await prisma.building.create({
      data: {
          propertyId: input.propertyId,
          address: input.address as any, // Prisma Json type
          additionalDetails: input.additionalDetails,
      },
  });
};

export const getById = async (id: string): Promise<Building | null> => {
  return await prisma.building.findUnique({
    where: { id },
    include: {
      property: true,
    },
  });
};

export const getByPropertyId = async (propertyId: string): Promise<Building[]> => {
  return await prisma.building.findMany({
    where: { propertyId },
    orderBy: {
      createdAt: 'asc',
    },
  });
};

