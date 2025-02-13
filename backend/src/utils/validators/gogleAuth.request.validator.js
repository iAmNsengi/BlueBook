import { body } from "express-validator";

const googleAuthRequestBodyValidator = [
  body()
    .custom((value, { req }) => {
      const allowedFields = ["credentials", "client_id"];
      const receivedFields = Object.keys(req.body);
      const hasExtraFields = receivedFields.some(
        (field) => !allowedFields.includes(field)
      );
      if (hasExtraFields) throw new Error();
      return true;
    })
    .withMessage("Allowed fields are credentials and client_id only"),
  body("credentials")
    .trim()
    .notEmpty()
    .withMessage("credentials field is required"),

  body("client_id")
    .trim()
    .notEmpty()
    .withMessage("client_id field is required and needs a value"),
];

export default googleAuthRequestBodyValidator;
