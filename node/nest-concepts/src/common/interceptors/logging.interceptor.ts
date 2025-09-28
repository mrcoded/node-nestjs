import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  //context => contains request and response object
  //next - control => route handler execution
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;
    const userAgent = request.get('user-agent') || 'unknown';

    const userId = request?.user?.id || 'unauthorized';

    this.logger.log(
      `[${method} ${url} - User: ${userId} - User-Agent ${userAgent}]`,
    );

    const startTime = Date.now(); //time taken for a req
    //tap operator aloows us to perform side effects
    return next.handle().pipe(
      tap({
        next: (data) => {
          const endTime = Date.now();
          const duration = endTime - startTime;

          this.logger.log(
            `[${method} ${url} - ${duration}ms - Response size ${JSON.stringify(data)?.length || 0} bytes]`,
          );
        },
        error: (error) => {
          const endTime = Date.now();
          const duration = endTime - startTime;

          this.logger.log(
            `[${method} ${url} - ${duration}ms - Error ${error.message}]`,
          );
        },
      }),
    );
  }
}
