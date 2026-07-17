import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { HUserDocument } from "src/model";

export const User = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        let user!: HUserDocument;

        switch(context.getType()) {
            case 'http' :
                user = context.switchToHttp().getRequest().user
                break;
            default:
                break;
        }

        return user
    }
)