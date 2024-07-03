import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
  } from 'class-validator';
  
  export function IsTodayOrFutureDate(
    validationOptions?: ValidationOptions,
  ) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'isTodayOrFutureDate',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          validate(value: any, args: ValidationArguments) {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set to the start of the day
            const dateValue = new Date(value);
            return dateValue >= today;
          },
          defaultMessage(args: ValidationArguments) {
            return `${args.property} must be today or a future date`;
          },
        },
      });
    };
  }
  