import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function AtLeastOne(
  properties: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'atLeastOne',
      target: object.constructor,
      propertyName,
      constraints: [properties],
      options: validationOptions,
      validator: {
        validate(_: any, args: ValidationArguments) {
          const [props] = args.constraints;
          return props.some(
            (prop: string) => (args.object as any)[prop] !== undefined,
          );
        },
      },
    });
  };
}
