import {prisma} from '../config/database';
import {ManagementType, Property} from '@prisma/client';

export interface PropertyListItem {
  id: string;
  uniqueNumber: string;
  name: string;
  managementType: ManagementType;
}

export interface CreatePropertyInput {
  name: string;
  managementType: ManagementType;
  propertyManagerId: string;
  accountantId: string;
  declarationOfDivision?: {
    fileId: string;
    uploadedAt: string;
    aiExtracted: boolean;
  };
}

export const getAll = async (): Promise<PropertyListItem[]> => {
    return await prisma.property.findMany({
      select: {
          id: true,
          uniqueNumber: true,
          name: true,
          managementType: true,
      },
      orderBy: {
          name: 'asc',
      },
  }) as PropertyListItem[];
};

export const create = async (input: CreatePropertyInput): Promise<Property> => {
  // Generate unique number: MV00001, WEG00001, etc.
  const prefix = input.managementType;
  
  // Find the highest existing number for this management type
  const lastProperty = await prisma.property.findFirst({
    where: {
      managementType: input.managementType,
      uniqueNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      uniqueNumber: 'desc',
    },
  });

  let nextNumber = 1;
  if (lastProperty && lastProperty.uniqueNumber) {
    // Extract the number part and increment
    const numberPart = lastProperty.uniqueNumber.replace(prefix, '');
    const lastNumber = parseInt(numberPart, 10);
    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }

  // Format as MV00001, WEG00001, etc. (5 digits)
  const uniqueNumber = `${prefix}${nextNumber.toString().padStart(5, '0')}`;

  const property = await prisma.property.create({
    data: {
      uniqueNumber,
      name: input.name,
      managementType: input.managementType,
      propertyManagerId: input.propertyManagerId,
      accountantId: input.accountantId,
      declarationOfDivision: input.declarationOfDivision ?? undefined,
    },
  });

  return property;
};

export const getById = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      buildings: {
        include: {
          units: {
            orderBy: {
              unitNumber: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });

  return property;
};
