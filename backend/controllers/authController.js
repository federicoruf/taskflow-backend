const authService = require("../services/authService");

const registerUser = async (req, res) => {
  const result = await authService.register(req.body);
  return res.status(201).json(result);
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  return res.status(200).json(result);
};

module.exports = {
  registerUser,
  loginUser,
};
