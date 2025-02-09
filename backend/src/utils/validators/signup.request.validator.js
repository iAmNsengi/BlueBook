import { body } from "express-validator";

export const validateSignupRequest = [
  body()
    .custom((value, { req }) => {
      const requiredFields = ["email", "password", "fullName"];
      const receivedFields = Object.keys(req?.body);
      const hasExtraFields = receivedFields.some(
        (field) => !requiredFields.includes(field)
      );
      if (hasExtraFields) throw new Error();
      return true;
    })
    .withMessage("Only email, password and fullName fields are allowed"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email field is required")
    .isEmail()
    .withMessage("E-mail field requires an email"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password field is required")
    .matches(/^(?=*.[0-9])(?=*.[a-z])(?=*.[A-Z])(?=*.[!@#$%&*_]).{6,}$/)
    .withMessage(
      "Password should have at least 6 characters, one number, one uppercase letter, one special character and allowed characters are: !@#$%&*_"
    ),

  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("fullName field is required")
    .matches(/^(A-Za-z)+( [A-Za-z]+)*$/)
    .withMessage(
      "fullName should have a space between and no number or special character"
    ),
];
