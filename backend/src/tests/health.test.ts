import { Request, Response } from 'express';
import { HealthController } from '../controllers/HealthController';

// Mock the HealthService to avoid actual system calls during testing
jest.mock('../services/HealthService', () => {
  return {
    HealthService: jest.fn().mockImplementation(() => {
      return {
        getSystemHealth: jest.fn().mockResolvedValue({
          status: 'OK',
          uptime: '100 seconds',
          timestamp: '2025-10-04T10:00:00.000Z',
          memory: {
            used: '50 MB',
            total: '100 MB',
          },
          environment: 'test',
          version: '1.0.0',
        }),
      };
    }),
  };
});

describe('HealthController', () => {
  let healthController: HealthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    healthController = new HealthController();
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('getHealth', () => {
    it('should return health status successfully', async () => {
      await healthController.getHealth(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'System is healthy',
          data: expect.objectContaining({
            status: 'OK',
            uptime: expect.any(String),
            timestamp: expect.any(String),
            memory: expect.any(Object),
            environment: expect.any(String),
            version: expect.any(String),
          }),
          timestamp: expect.any(String),
        })
      );
    });

    it('should handle errors gracefully', async () => {
      // Mock the service to throw an error
      const mockHealthService = require('../services/HealthService').HealthService;
      mockHealthService.mockImplementation(() => {
        return {
          getSystemHealth: jest.fn().mockRejectedValue(new Error('Test error')),
        };
      });

      const errorHealthController = new HealthController();

      await errorHealthController.getHealth(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Health check failed',
          data: null,
          timestamp: expect.any(String),
          error: 'Test error',
        })
      );
    });
  });
});