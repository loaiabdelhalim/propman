import { prisma } from '../config/database';
import * as buildingService from './buildingService';

jest.mock('../config/database', () => ({
  prisma: {
    property: { findUnique: jest.fn() },
    building: { create: jest.fn(), findUnique: jest.fn(), findMany: jest.fn() },
  },
}));

const mockedPrisma = prisma as unknown as any;

describe('buildingService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('create throws when property not found', async () => {
    mockedPrisma.property.findUnique.mockResolvedValue(null);

    await expect(buildingService.create({ propertyId: 'p1', address: { street: 'S', houseNumber: '1' } } as any)).rejects.toThrow('Property not found');
    expect(mockedPrisma.property.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'p1' } }));
  });

  test('create returns created building when property exists', async () => {
    mockedPrisma.property.findUnique.mockResolvedValue({ id: 'p1' });
    const created = { id: 'b1', propertyId: 'p1', address: { street: 'S' } };
    mockedPrisma.building.create.mockResolvedValue(created);

    const res = await buildingService.create({ propertyId: 'p1', address: { street: 'S', houseNumber: '1' } } as any);

    expect(res).toEqual(created);
    expect(mockedPrisma.building.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ propertyId: 'p1' }) }));
  });

  test('getById returns building with property', async () => {
    const b = { id: 'b2', property: { id: 'p2' } };
    mockedPrisma.building.findUnique.mockResolvedValue(b);

    const res = await buildingService.getById('b2');

    expect(res).toEqual(b);
    expect(mockedPrisma.building.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'b2' } }));
  });

  test('getByPropertyId returns buildings array', async () => {
    const arr = [{ id: 'b3' }];
    mockedPrisma.building.findMany.mockResolvedValue(arr);

    const res = await buildingService.getByPropertyId('p3');

    expect(res).toEqual(arr);
    expect(mockedPrisma.building.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { propertyId: 'p3' } }));
  });
});

