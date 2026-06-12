const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errorMessages = result.error.issues.map((issue) => ({
      field: issue.path[0],
      message: issue.message,
    }));
    
    return res.status(400).json({ errors: errorMessages });
  }

  next();
};

module.exports = validate;