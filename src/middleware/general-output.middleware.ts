import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class GeneralOutputMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const originalSend = res.send.bind(res);

    res.send = (body: any) => {
      // 攔截輸出，整合成共同輸出格式
      if (res.getHeader('Content-Disposition')?.toString().includes('attachment')) {
        return originalSend(body);
      }

      let responseBody;
      try {
        responseBody = JSON.parse(body);
      } catch (e) {
        responseBody = body;
      }

      if (responseBody && responseBody.code !== undefined && responseBody.status !== undefined) {
        return originalSend(JSON.stringify(responseBody));
      }

      if (responseBody && responseBody.statusCode !== undefined && responseBody.message !== undefined) {
        const formattedErrorResponse = {
          status: false,
          code: responseBody.statusCode,
          message: responseBody.message,
          data: responseBody.data ?? [],
        };

        return originalSend(JSON.stringify(formattedErrorResponse));
      }

      const formattedResponse = {
        status: true,
        code: res.statusCode,
        message: '',
        data: responseBody,
      };

      return originalSend(JSON.stringify(formattedResponse));
    };

    next();
  }
}
