import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ZodType } from "zod";


@Injectable()
export class CustomValidationPipe<T> implements PipeTransform {
    constructor(private schema: ZodType) { }
    transform(value: T, metadata: ArgumentMetadata) {

        const result = this.schema.safeParse(value)

        if (!result.success) {
            throw new BadRequestException({
                message: 'Validation error',
                cause: {
                    issues: result.error.issues.map((issue) => { return { path: issue.path, message: issue.message } })
                }
            })
        }

        return result.data
    }
}