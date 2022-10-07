import User from "../../models/User.js";
import httpresponse from "../../helpers/http_response.js";
import Crypro from "crypto";
import Jwt from "jsonwebtoken";

const { JWT_EXPIRES, JWT_SECRET } = process.env;

export const tokenUser = (req, res, next) => {
  try {
    // verify token
    Jwt.verify(req.cookies["x-token"], JWT_SECRET);
    const userDecode = Jwt.decode(req.cookies["x-token"]);
    req.userId = userDecode.id;
    next();
  } catch (error) {
    if (error.message === "jwt expired")
      return res.status(401).json(httpresponse(401, "Validation error", { errors: { token: "Token is expired" } }));
    if (error.message === "invalid token")
      return res.status(401).json(httpresponse(401, "Validation error", { errors: { token: "Token is invalid" } }));
    if (error.message === "jwt must be provided")
      return res.status(401).json(httpresponse(401, "Validation error", { errors: { token: "Token is invalid" } }));
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    // validate email
    const user = await User.findOne({ where: { email: req.body.email }, raw: true, attributes: ["email", "password", "id"] });
    if (!user)
      return res.status(400).json(
        httpresponse(400, "Validation error", {
          errors: {
            user: "Email or password is wrong",
          },
        })
      );
    // validate password
    const password = Crypro.createHash("md5").update(req.body.password).digest("hex");
    if (user.password !== password)
      return res.status(400).json(
        httpresponse(400, "Validation error", {
          errors: {
            user: "Email or password is wrong",
          },
        })
      );

    // generate token
    const token = Jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: Number(JWT_EXPIRES) });

    // set cookie
    res.cookie("x-token", token, { httpOnly: true, maxAge: 1000 * Number(JWT_EXPIRES) });

    // return token
    return res.status(200).json(httpresponse(200, "Login successfully", { data: { token } }));
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("x-token");
    res.status(200).json(httpresponse(200, "Logout successfully"));
  } catch (error) {
    next(error);
  }
};

export const registerUser = async (req, res, next) => {
  try {
    req.body.created_at = new Date();

    const email = await User.findOne({ where: { email: req.body.email } });
    const username = await User.findOne({ where: { username: req.body.username } });
    if (email || username)
      return res.status(400).json(httpresponse(400, "Validation error", { errors: { user: "Email or username is already exist" } }));

    await User.create(req.body);
    res.status(201).json(httpresponse(201, "Register successfully"));
  } catch (error) {
    next(error);
  }
};

export const verifyUser = async (req, res, next) => {};
export const resetPassword = async (req, res, next) => {};
