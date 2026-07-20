import { CallHandler, ExecutionContext, Injectable, NestInterceptor, RequestTimeoutException } from "@nestjs/common";
import { catchError, Observable, tap, throwError, timeout, TimeoutError } from "rxjs";
import { AuthRequest } from "../interface/request.interface";

@Injectable()
export class LanguageInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {

        switch (context.getType()) {
            case 'http':
                const req = context.switchToHttp().getRequest<AuthRequest>();
                req.headers['accept-language'] ??= req.user?.lang ?? 'en'
                break;
            default:
                break;
        }


        return next.handle()
    }
}