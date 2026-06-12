const authController = require("../controllers/authController");
const authService = require("../services/authService");

jest.mock("../services/authService");

describe("authController", () => {
  let req;
  let res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("Función: registerUser", () => {
    it("Debería responder con 201 y los datos del usuario si el registro es exitoso", async () => {
      const mockServiceResult = {
        _id: "user_123",
        name: "Federico Controller",
        email: "fede@example.com",
        token: "token_falso_123",
      };

      req.body = {
        name: "Federico Controller",
        email: "fede@example.com",
        password: "password123",
      };

      authService.register.mockResolvedValue(mockServiceResult);

      await authController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockServiceResult);
      expect(authService.register).toHaveBeenCalledWith(req.body);
    });

    it("Debería propagar el código de error del servicio para que Express 5 lo maneje", async () => {
      const fakeError = new Error("El correo electrónico ya está registrado");
      fakeError.statusCode = 400;

      req.body = { email: "duplicado@example.com" };

      authService.register.mockRejectedValue(fakeError);

      await expect(authController.registerUser(req, res)).rejects.toThrow(
        "El correo electrónico ya está registrado",
      );
    });
  });

  describe("Función: loginUser", () => {
    it("Debería responder con 200 y el token si las credenciales son válidas", async () => {
      const mockLoginResult = {
        _id: "user_123",
        name: "Federico Login",
        email: "fede@example.com",
        token: "jwt_token_exitoso_xyz",
      };

      req.body = {
        email: "fede@example.com",
        password: "passwordCorrecto123",
      };

      authService.login.mockResolvedValue(mockLoginResult);

      await authController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockLoginResult);
      expect(authService.login).toHaveBeenCalledWith("fede@example.com", "passwordCorrecto123");
    });

    it("Debería propagar el error 401 si el servicio rechaza las credenciales", async () => {
      const fakeError = new Error("Credenciales inválidas");
      fakeError.statusCode = 401;

      req.body = {
        email: "fede@example.com",
        password: "passwordEquivocado",
      };

      authService.login.mockRejectedValue(fakeError);

      await expect(authController.loginUser(req, res)).rejects.toThrow(
        "Credenciales inválidas",
      );
    });
  });
});