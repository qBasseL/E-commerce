import { CallHandler, ExecutionContext, Injectable, NestInterceptor, RequestTimeoutException } from "@nestjs/common";
import { catchError, Observable, tap, throwError, timeout, TimeoutError } from "rxjs";

@Injectable()
export class WatchInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        console.log(`Before...`)
        const now = Date.now()
        return next.handle().pipe(
            timeout(10000),
            catchError(err => {
                if (err instanceof TimeoutError) {
                    return throwError(() => new RequestTimeoutException())
                }
                return throwError(() => err)
            }),
            tap(() => console.log(`After... ${Date.now() - now}`))
        )
    }
}