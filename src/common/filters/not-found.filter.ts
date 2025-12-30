import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    return response.status(404).json({
      status: 'fail',
      message: `Route not found: ${request.method} ${request.url}`,
      statusCode: 404,
      data: {
        method: request.method,
        path: request.url,
        hint: 'Check the endpoint or HTTP method',
      },
    });
  }
}
