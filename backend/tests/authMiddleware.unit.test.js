const { protect } = require("../middlewares/authMiddleware"); // Ajusta la ruta si es necesario
const jwt = require("jsonwebtoken");
const User = require("../models/User");

jest.mock("jsonwebtoken");
jest.mock("../models/User");

describe("authMiddleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("Debería responder con 401 si no se envía la cabecera Authorization", async () => {

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("No autorizado"),
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("Debería responder con 401 si el token enviado está malformado o expirado", async () => {
    req.headers.authorization = "Bearer token_roto_o_expirado";

    jwt.verify.mockImplementation(() => {
      throw new Error("jwt malformed");
    });

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("Debería inyectar el usuario en req y llamar a next() si el token es totalmente válido", async () => {
    req.headers.authorization = "Bearer token_perfecto_123";

    const mockDecodedToken = { id: "user_real_999" };
    const mockUserDb = {
      _id: "user_real_999",
      name: "Federico Middleware",
      email: "fede@test.com",
    };

    jwt.verify.mockReturnValue(mockDecodedToken);
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUserDb),
    });

    await protect(req, res, next);

    expect(req.user).toEqual(mockUserDb);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
