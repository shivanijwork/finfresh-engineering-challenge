export const successResponse = (
  res,
  message,
  statusCode = 200,
  data = null
) => {
  const response = {
    status: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

export const errorResponse = (
  res,
  message = "Something went wrong",
  statusCode = 500
) => {
  return res.status(statusCode).json({
    status: false,
    message,
  });
};

export const validationErrorResponse = (
  res,
  errors,
  message = "Validation Failed",
  statusCode = 400
) => {
  return res.status(statusCode).json({
    status: false,
    message,
    errors,
  });
};