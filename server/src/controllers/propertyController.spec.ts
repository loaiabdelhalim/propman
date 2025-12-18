import request from 'supertest';
import express from 'express';
import * as propertyService from '../services/propertyService';
import propertyRoutes from '../routes/propertyRoutes';

jest.mock('../services/propertyService');

const app = express();
app.use(express.json());
app.use('/api/properties', propertyRoutes);

describe('propertyRoutes', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('GET /api/properties/:id returns 200 and property when found', async () => {
    const mockProperty = { id: '1', name: 'Test Prop' } as any;
    (propertyService.getById as jest.Mock).mockResolvedValue(mockProperty);

    const res = await request(app).get('/api/properties/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockProperty);
    expect(propertyService.getById).toHaveBeenCalledWith('1');
  });

  test('GET /api/properties/:id returns 404 when not found', async () => {
    (propertyService.getById as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get('/api/properties/unknown');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /api/properties returns 201 on success', async () => {
    const payload = {
      name: 'New Prop',
      managementType: 'MV',
      propertyManagerId: 'pm1',
      accountantId: 'acc1',
    };

    const created = { id: '2', ...payload } as any;
    (propertyService.create as jest.Mock).mockResolvedValue(created);

    const res = await request(app).post('/api/properties').send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(created);
    expect(propertyService.create).toHaveBeenCalledWith(expect.objectContaining(payload));
  });

  test('POST /api/properties returns 400 when missing fields', async () => {
    const res = await request(app).post('/api/properties').send({ name: 'Bad' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

