import request from 'supertest';
import express from 'express';
import * as buildingService from '../services/buildingService';
import buildingRoutes from '../routes/buildingRoutes';

jest.mock('../services/buildingService');

const app = express();
app.use(express.json());
app.use('/api/buildings', buildingRoutes);

describe('buildingRoutes', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('POST /api/buildings returns 201 on success', async () => {
    const payload = { propertyId: 'p1', address: { street: 'S', houseNumber: '1' } };
    const created = { id: 'b1', ...payload } as any;
    (buildingService.create as jest.Mock).mockResolvedValue(created);

    const res = await request(app).post('/api/buildings').send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(created);
    expect(buildingService.create).toHaveBeenCalledWith(expect.objectContaining(payload));
  });

  test('POST /api/buildings returns 400 when missing fields', async () => {
    const res = await request(app).post('/api/buildings').send({});
    expect(res.status).toBe(400);
  });

  test('GET /api/buildings/:id returns 200 when found', async () => {
    const b = { id: 'b2', propertyId: 'p2' } as any;
    (buildingService.getById as jest.Mock).mockResolvedValue(b);

    const res = await request(app).get('/api/buildings/b2');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(b);
  });

  test('GET /api/buildings/property/:propertyId returns array', async () => {
    const arr = [{ id: 'b3' }];
    (buildingService.getByPropertyId as jest.Mock).mockResolvedValue(arr);

    const res = await request(app).get('/api/buildings/property/p3');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(arr);
  });
});

