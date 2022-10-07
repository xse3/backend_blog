import User from "../models/User.js";
import Profile from "../models/Profile.js";
import Status from "../models/Status.js";
import Role from "../models/Role.js";
import { Op } from "sequelize";

import httpresponse from "../helpers/http_response.js";

/**
 * Find data user by primary key
 */
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        { model: Profile, as: "profile" },
        { model: Status, as: "status" },
        { model: Role, as: "role" },
      ],
    });
    if (!user) return res.status(404).json(httpresponse(404, "User not found"));
    if (user) return res.status(200).json(httpresponse(200, "User found", { data: user }));
  } catch (error) {
    next(error);
  }
};

/**
 * Create user
 * @param {string} name req.body.name required
 * @param {string} email req.body.email required
 * @param {string} password req.body.password required
 * @param {string} role req.body.role optional default role.id = 5 (penulis)
 * @param {string} status req.body.status optional default status.id = 2 (inactive)
 * @return {Object} user object
 */
export const createUser = async (req, res, next) => {
  try {
    req.body.created_at = new Date();

    const email = await User.findOne({ where: { email: req.body.email }, attributes: ["email"] });
    if (email) return res.status(400).json(httpresponse(400, "Validation error", { errors: { email: "Email already exists" } }));

    const username = await User.findOne({ where: { username: req.body.username }, attributes: ["username"] });
    if (username) return res.status(400).json(httpresponse(400, "Validation error", { errors: { username: "Username already exists" } }));

    const user = await User.create(req.body);
    if (!user) return res.status(400).json(httpresponse(400, "Failed to create user"));
    if (user) return res.status(200).json(httpresponse(200, "User created successfully", { data: user }));
  } catch (error) {
    next(error);
  }
};

/**
 * Update user  by primary key
 */
export const updateUser = async (req, res, next) => {
  try {
    delete req.body.id;

    // check user
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json(httpresponse(404, "User not found"));

    // check email is exists
    const email = await User.findOne({ where: { email: req.body.email }, attributes: ["email"] });
    if (email && email !== user.email)
      return res.status(400).json(httpresponse(400, "Validation error", { errors: { email: "Email already exists" } }));

    // check username is exists
    const username = await User.findOne({ where: { username: req.body.username }, attributes: ["username"] });
    if (username && username !== user.username)
      return res.status(400).json(httpresponse(400, "Validation error", { errors: { username: "Username already exists" } }));

    // update user
   await user.update(req.body);
   return res.status(200).json(httpresponse(200, "User updated successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user by primary key
 */
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json(httpresponse(404, "User not found"));

    await user.destroy();
    return res.status(200).json(httpresponse(200, "User deleted successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * Find all user with pagination and search
 * @returns
 */
export const getUsers = async (req, res, next) => {
  try {
    var page = Number(req.query.page) || 1;
    var limit = Number(req.query.limit) || 10;
    var offset = (page - 1) * limit;
    var order = req.query.order || "DESC";

    const users = await User.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["created_at", order]],
      include: [
        { model: Profile, as: "profile" },
        { model: Status, as: "status" },
        { model: Role, as: "role" },
      ],
    });

    if (users.rows.length === 0) return res.status(404).json(httpresponse(404, "Users not found"));

    // create pagination
    const totalPage = Math.ceil(users.count / limit);
    const currentPage = page;
    const nextPage = page < totalPage ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    const pagination = {
      count: users.count,
      total_page: totalPage,
      current_page: currentPage,
      next_page: nextPage,
      prev_page: prevPage,
    };

    const data = { data: users.rows, pagination };

    if (users.rows.length > 0) return res.status(200).json(httpresponse(200, "Users found", data));
  } catch (error) {
    next(error);
  }
};
