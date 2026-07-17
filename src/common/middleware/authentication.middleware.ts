import { Injectable, NestMiddleware } from "@nestjs/common";

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
    constructor() { }

    use(req: any, res: any, next: (error?: any) => void) {
        const [key, token] = req.headers['authorization'].split(" ")
        // console.log({ key, token })
        next()
    }
}