import { body } from "express-validator";

const loginRequestBodyValidator = [
  body()
    .custom((value, { req }) => {
      const allowedFields = ["email", "password"];
      const receivedFields = Object.keys(req.body);
      const hasExtraFields = receivedFields.some(
        (field) => !allowedFields.includes(field)
      );
      if (hasExtraFields) throw new Error();
      return true;
    })
    .withMessage("Allowed fields are email and password only"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage('"Email field is required"')
    .isEmail()
    .withMessage("Email field should be an email"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password field is required and needs a value"),
];

export default loginRequestBodyValidator;
