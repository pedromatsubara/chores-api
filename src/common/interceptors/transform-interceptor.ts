import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { map } from "rxjs/operators";
import { plainToInstance } from "class-transformer";
import { Observable } from "rxjs";

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) =>
        Array.isArray(data)
          ? data.map((item) =>
              plainToInstance(item.constructor, item, {
                enableImplicitConversion: true,
              })
            )
          : plainToInstance(data.constructor, data, {
              enableImplicitConversion: true,
            })
      )
    );
  }
}
