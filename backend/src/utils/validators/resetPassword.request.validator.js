import { body } from "express-validator";

const resetPasswordRequestBodyValidator = [
  body()
    .custom((value, { req }) => {
      const allowedFields = ["password"];
      const receivedFields = Object.keys(req.body);
      const hasExtraFields = receivedFields.some(
        (field) => !allowedFields.includes(field)
      );
      if (hasExtraFields) throw new Error();
      return true;
    })
    .withMessage("Allowed field is password only"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("password field is required")
    .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*_]).{6,}$/)
    .withMessage(
      "Password should have at least 6 characters, one number, one uppercase letter, one special character and allowed characters are: !@#$%&*_"
    ),
  ,
];

export default resetPasswordRequestBodyValidator;
