import { Request, Response } from 'express';
import { HealthService } from '../services/HealthService';
import { ApiResponse } from '../types/api';

export class HealthController {
  private healthService: HealthService;

  constructor() {
    this.healthService = new HealthService();
  }

  public getHealth = async (req: Request, res: Response): Promise<void> => {
    try {
      const healthData = await this.healthService.getSystemHealth();
      
      const response: ApiResponse<typeof healthData> = {
        success: true,
        message: 'System is healthy',
        data: healthData,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Health check failed',
        data: null,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };
}