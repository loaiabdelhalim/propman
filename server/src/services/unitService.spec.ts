import { prisma } from '../config/database';
import * as unitService from './unitService';

jest.mock('../config/database', () => ({
  prisma: {
    building: { findUnique: jest.fn() },
    unit: { createMany: jest.fn(), findMany: jest.fn(), findUnique: jest.fn() },
    $transaction: jest.fn(),
  },
}));

const mockedPrisma = prisma as unknown as any;

describe('unitService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('createBulk throws when building not found', async () => {
    mockedPrisma.building.findUnique.mockResolvedValue(null);

    await expect(unitService.createBulk({ buildingId: 'b1', units: [] } as any)).rejects.toThrow('Building not found');
    expect(mockedPrisma.building.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'b1' } }));
  });

  test('createBulk inserts units and returns created units', async () => {
    mockedPrisma.building.findUnique.mockResolvedValue({ id: 'b1' });

    const units = [{ unitNumber: '101', type: 'Apartment', sizeSqm: 50, coOwnershipShare: 0.5 }];

    // Simulate transaction by calling the callback with tx stub
    mockedPrisma.$transaction.mockImplementation(async (cb: any) => {
      const tx = {
        unit: {
          createMany: jest.fn().mockResolvedValue(undefined),
          findMany: jest.fn().mockResolvedValue([{ id: 'u1', unitNumber: '101', buildingId: 'b1' }]),
        },
      };
      return await cb(tx);
    });

    const res = await unitService.createBulk({ buildingId: 'b1', units } as any);

    expect(res.count).toBe(1);
    expect(res.units[0]).toHaveProperty('unitNumber', '101');
  });

  test('getByBuildingId returns units array', async () => {
    const arr = [{ id: 'u2' }];
    mockedPrisma.unit.findMany.mockResolvedValue(arr);

    const res = await unitService.getByBuildingId('b2');

    expect(res).toEqual(arr);
    expect(mockedPrisma.unit.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { buildingId: 'b2' } }));
  });

  test('getById returns unit with building and property included', async () => {
    const u = { id: 'u3', building: { property: { id: 'p3' } } };
    mockedPrisma.unit.findUnique.mockResolvedValue(u);

    const res = await unitService.getById('u3');

    expect(res).toEqual(u);
    expect(mockedPrisma.unit.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'u3' } }));
  });
});

