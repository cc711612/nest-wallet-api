import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MemoryLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 計入開始時間 用來計算處理時間
    const start = Date.now();
    // 取得記憶體使用量且轉換成 MB
    const startMemoryUsage = this.convertMemoryUsageToMB(process.memoryUsage());
    // 加上時間戳記
    console.log('Request Time:', new Date().toLocaleString());
    console.log('Request Path:', req.path);
    console.log('Request Method:', req.method);
    console.log('Request Body:', req.body);
    console.log('Request Memory Usage (MB):', startMemoryUsage);
    
    res.on('finish', () => {
      const endMemoryUsage = this.convertMemoryUsageToMB(process.memoryUsage());
      console.log('Response Memory Usage (MB):', endMemoryUsage);
      // 計算處理時間
      const duration = Date.now() - start;
      console.log('Response Time:', new Date().toLocaleString());
      console.log('Response Duration:', duration, 'ms');
      // 計算 memory 使用狀況
      const memoryUsageDiff = this.calculateMemoryUsageDiff(startMemoryUsage, endMemoryUsage);
      console.log('Memory Usage Difference (MB):', memoryUsageDiff);
    });

    next();
  }

  private convertMemoryUsageToMB(memoryUsage: NodeJS.MemoryUsage): { [key: string]: number } {
    const memoryUsageInMB: { [key: string]: number } = {};
    for (const key in memoryUsage) {
      if (memoryUsage.hasOwnProperty(key)) {
        memoryUsageInMB[key] = Math.round((memoryUsage[key as keyof NodeJS.MemoryUsage] / 1024 / 1024) * 100) / 100;
      }
    }
    return memoryUsageInMB;
  }

  private calculateMemoryUsageDiff(startMemoryUsage: { [key: string]: number }, endMemoryUsage: { [key: string]: number }): { [key: string]: number } {
    const memoryUsageDiff: { [key: string]: number } = {};
    for (const key in startMemoryUsage) {
      if (startMemoryUsage.hasOwnProperty(key) && endMemoryUsage.hasOwnProperty(key)) {
        memoryUsageDiff[key] = Math.round((endMemoryUsage[key] - startMemoryUsage[key]) * 100) / 100;
      }
    }
    return memoryUsageDiff;
  }
}