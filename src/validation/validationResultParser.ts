import { Result, ValidationError } from "express-validator";

export const validationResultParser = (validationResult: Result<ValidationError>) => {
    const messages: [string?] = [];

    ((validationResult as any).errors).forEach((error: ValidationError) => {
        messages.push(error.msg);
    });

    return messages;
};
