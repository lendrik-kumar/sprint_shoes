import request from 'supertest';
import app from '../src/index';

describe('Monitoring Routes', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('ok');
    });
  });

  describe('GET /readiness', () => {
    it('should return readiness state', async () => {
      const response = await request(app).get('/readiness');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('ready');
      expect(response.body.ready).toBe(true);
    });
  });
});
