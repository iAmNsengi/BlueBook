import { body } from "express-validator";

const forgotPasswordRequestBodyValidator = [
  body()
    .custom((value, { req }) => {
      const allowedFields = ["email"];
      const receivedFields = Object.keys(req.body);
      const hasExtraFields = receivedFields.some(
        (field) => !allowedFields.includes(field)
      );
      if (hasExtraFields) throw new Error();
      return true;
    })
    .withMessage("Allowed field is email only"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email field is required")
    .isEmail()
    .withMessage("email field is expecting an email"),
];

export default forgotPasswordRequestBodyValidator;
