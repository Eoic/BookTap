import { validationLimits as limits } from "./limits";

const validationMessages = {
  ALPHANUMERIC_ONLY: "Only alphanumeric chaacters are allowed",
  EMAIL_TOO_LONG: "Entered email is too long",
  EMAIL_TAKEN: "This email is already taken",
  INCORRECT_LOGIN_DETAILS: "Incorrect username or password",
  NOT_AN_EMAIL: "Entered email address is not valid",
  PASSWORD_EMPTY: "Password is required",
  PASSWORD_LENGTH_INVALID: `Password should be between ${limits.PASSWORD.min} and ${limits.PASSWORD.max} characters long`,
  USERNAME_EMPTY: "Username is required",
  USERNAME_LENGTH_INVALID: `Username should be between ${limits.USERNAME.min} and ${limits.USERNAME.max} characters long`,
  USERNAME_TAKEN: "This username is already taken",
  PASSWORD_FAILED_MATCH: "Password confirmation does not match password",
};

export { validationMessages };
