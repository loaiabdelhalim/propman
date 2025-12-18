import { prisma } from '../config/database';
import * as propertyService from './propertyService';

jest.mock('../config/database', () => ({
  prisma: {
    property: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

const mockedPrisma = prisma as unknown as any;

describe('propertyService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('getAll returns a list of properties', async () => {
    const fake = [{ id: '1', name: 'P1', uniqueNumber: 'MV00001', managementType: 'MV' }];
    mockedPrisma.property.findMany.mockResolvedValue(fake);

    const res = await propertyService.getAll();

    expect(res).toEqual(fake);
    expect(mockedPrisma.property.findMany).toHaveBeenCalled();
  });

  test('create generates next unique number and creates a property', async () => {
    // Simulate lastProperty found
    mockedPrisma.property.findFirst.mockResolvedValue({ uniqueNumber: 'MV00001' });
    const input = {
      name: 'New',
      managementType: 'MV',
      propertyManagerId: 'pm',
      accountantId: 'acc',
      declarationOfDivision: null,
    } as any;

    const created = { id: '2', uniqueNumber: 'MV00002', name: 'New' } as any;
    mockedPrisma.property.create.mockResolvedValue(created);

    const res = await propertyService.create(input);

    expect(res).toEqual(created);
    expect(mockedPrisma.property.findFirst).toHaveBeenCalled();
    expect(mockedPrisma.property.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ uniqueNumber: 'MV00002' }) }));
  });

  test('getById returns property including buildings and units', async () => {
    const prop = { id: '3', name: 'Prop3', buildings: [] } as any;
    mockedPrisma.property.findUnique.mockResolvedValue(prop);

    const res = await propertyService.getById('3');

    expect(res).toEqual(prop);
    expect(mockedPrisma.property.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: '3' } }));
  });
});

