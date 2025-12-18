import request from 'supertest';
import express from 'express';
import * as unitService from '../services/unitService';
import unitRoutes from '../routes/unitRoutes';

jest.mock('../services/unitService');

const app = express();
app.use(express.json());
app.use('/api/units', unitRoutes);

describe('unitRoutes', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('POST /api/units/bulk returns 201 on success', async () => {
    const payload = { buildingId: 'b1', units: [{ unitNumber: '101', type: 'Apartment', sizeSqm: 50, coOwnershipShare: 0.5 }] };
    const created = { count: 1, units: [{ id: 'u1', unitNumber: '101' }] } as any;
    (unitService.createBulk as jest.Mock).mockResolvedValue(created);

    const res = await request(app).post('/api/units/bulk').send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(created);
    expect(unitService.createBulk).toHaveBeenCalledWith(expect.objectContaining(payload));
  });

  test('POST /api/units/bulk returns 400 on invalid payload', async () => {
    const res = await request(app).post('/api/units/bulk').send({});
    expect(res.status).toBe(400);
  });

  test('GET /api/units/building/:buildingId returns array', async () => {
    const arr = [{ id: 'u2' }];
    (unitService.getByBuildingId as jest.Mock).mockResolvedValue(arr);

    const res = await request(app).get('/api/units/building/b2');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(arr);
  });

  test('GET /api/units/:id returns 200 when found', async () => {
    const u = { id: 'u3' } as any;
    (unitService.getById as jest.Mock).mockResolvedValue(u);

    const res = await request(app).get('/api/units/u3');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(u);
  });
});

