import Profile from "../models/Profile.js";
import User from "../models/User.js";
import httpresponse from "../helpers/http_response.js";

/**
 * Create Or Update profile
 * @param {string} id req.params.id required foreign key user.id
 * @param {string} first_name req.body.first_name required
 * @param {string} last_name req.body.last_name optional
 * @param {string} picture req.body.picture optional or default path assets/img/profile.png
 * @param {string} about_me req.body.about_me optional
 * @param {date} birthday req.body.birthday optional YYYY-MM-DD
 * @returns
 */
export const upsertProfile = async (req, res, next) => {
  try {
    // check user
    const user = await User.findOne({ where: { id: req.params.id }, raw: true, attributes: ["profile_id"] });
    if (!user) return res.status(404).json(httpresponse(404, "User not found"));

    req.body.id = user.profile_id;

    if (user.profile_id === null) {
      req.body.created_at = new Date();
    }

    const [record, created] = await Profile.upsert(req.body, { returning: true });
    if (created) {
      await User.update({ profile_id: record.id }, { where: { id: req.params.id } });
    }

    res.status(200).json(httpresponse(true, "Profile set successfully", { data: record }));
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {};
export const getProfiles = async (req, res, next) => {};
export const createProfile = async (req, res, next) => {};
export const deleteProfile = async (req, res, next) => {};
export const updateProfile = async (req, res, next) => {};
