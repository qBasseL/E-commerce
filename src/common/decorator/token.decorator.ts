import { SetMetadata } from "@nestjs/common";
import { TokenTypeEnums } from "../enum";


export const tokenTypeName = 'tokenType'
export const Token = (tokenType: TokenTypeEnums = TokenTypeEnums.Access_Token) => {
    return SetMetadata(tokenTypeName, tokenType)
}