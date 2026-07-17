import { applyDecorators, UseGuards } from "@nestjs/common"
import { Role } from "./role.decorator"
import { Token } from "./token.decorator"
import { AuthenticationGuard, AuthorizationGuard } from "../guard"
import { RoleEnum, TokenTypeEnums } from "../enum"

export const Auth = (roles: RoleEnum[], tokenType: TokenTypeEnums = TokenTypeEnums.Access_Token) => {
    return applyDecorators(
        Role(roles),
        Token(tokenType),
        UseGuards(AuthenticationGuard, AuthorizationGuard)
    )
}