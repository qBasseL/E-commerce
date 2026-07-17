import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: "MatchBetwenFields", async: false })
export class MatchBetweenFields implements ValidatorConstraintInterface {
    validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        return value === validationArguments?.object[validationArguments.constraints[0]]
    }
    defaultMessage(validationArguments?: ValidationArguments): string {
        return `Mismatch between ${validationArguments?.property} and ${validationArguments?.constraints[0]}`
    }
}


export function IsMatch(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: MatchBetweenFields
        })
    }
}