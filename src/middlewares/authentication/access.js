import User from "../../models/User.js";
import httpresponse from "../../helpers/http_response.js";

export const roleUser = async (req, res, next) => {
  try {
    const id = req.userId;
    const user = await User.findOne({ where: { id }, raw: true });

    if (user["role.id"] === 1) {
      next();
    } else {
      res.status(403).json(httpresponse(403, "You are access denied"));
    }
  } catch (error) {
    next(error);
  }
};
