import retry from "retry";

export const retryMiddleware = (
  operationFn,
  options = { retries: 3, minTimeout: 1000, factor: 2 }
) => {
  return async (req, res, next) => {
    const operation = retry.operation(options);

    operation.attempt(async (currentAttempt) => {
      try {
        await operationFn(req, res, next);
      } catch (err) {
        if (operation.retry(err)) {
          console.log(`Retrying operation, attempt number: ${currentAttempt}`);
          return;
        }
        next(err || new Error("Operation failed after retries"));
      }
    });
  };
};
