export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_REGEX = new RegExp(
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
);
export const PASSWORD_REGEX_ERROR =
  "A password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
