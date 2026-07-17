import { Module } from "@nestjs/common";
import { SecurityService } from "./security.service";
import { ConfigService } from "@nestjs/config";
import { createClient } from "redis";
import { TokenService } from "./token.service";
import { CacheService } from "./cache.service";
import { JwtModule } from "@nestjs/jwt";
import { UserRepository } from "src/common/repository";
import { UserModel } from "src/model";

@Module({
    imports: [JwtModule, UserModel],
    providers: [{
        provide: "REDIS_CLIENT",
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
            const client = createClient({
                url: configService.get<string>('REDIS_URI')
            })
            client.on('error', (err) => console.log('Redis Client Error', err))
            await client.connect()
            console.log(`Redis connected successfully`)
            return client
        },
    },
        SecurityService,
        TokenService,
        CacheService,
        UserRepository
    ],
    exports: [SecurityService, TokenService, CacheService, 'REDIS_CLIENT']
})
export class SecurityModule {
    constructor() { }

}