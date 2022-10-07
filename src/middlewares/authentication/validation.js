import { validationResult, param, query, body, check } from "express-validator";
import httpresponse from "../../helpers/http_response.js";
import Post from "../../models/Post.js";

const validate = (validationInput) => {
  return async (req, res, next) => {
    try {
      await Promise.all(validationInput.map((input) => input.run(req)));
      const errors = validationResult(req).formatWith(({ msg }) => {
        return msg;
      });

      if (!errors.isEmpty()) {
        res.status(400).json(httpresponse(400, "Validation error", { errors: errors.mapped() }));
      } else {
        return next();
      }
    } catch (error) {
      next(error);
    }
  };
};

/** auth */
export const inputAuthLogin = validate([email(), password()]);
export const inputAuthRegister = validate([email(), username(), password(), password2()]);
export const inputAuthLogout = validate([]);

/** user */
export const inputUserGet = validate([id_uuid()]);
export const inputUserGets = validate([limit(), page()]);
export const inputUserDelete = validate([id_uuid()]);
export const inputUserUpdate = validate([id_uuid(), username(), email(), password(), role_id(), status_id()]);
export const inputUserCreate = validate([username(), email(), password(), role_id(), status_id()]);

/** post */
export const inputPostGet = validate([id_int()]);
export const inputPostGets = validate([page(), limit()]);
export const inputPostDelete = validate([id_int()]);
export const inputPostUpdate = validate([id_int(), slug(), content(), description(), keywords(), thumbnail(), title(), user_id(), status_id()]);
export const inputPostCreate = validate([slug(), content(), description(), keywords(), thumbnail(), title(), user_id(), status_id()]);
export const inputPostGetPublished = validate([id_int()]);
export const inputPostGetPublisheds = validate([limit(), page()]);

/** profile */
export const inputProfileUpsert = validate([id_uuid(), first_name(), last_name(), birthday(), about_me(), image_slug()]);

/** image */
export const inputImageGet = validate([id_int()]);
export const inputImageGets = validate([page(), limit()]);
export const inputImageView = validate([slug()]);
export const inputImageUpdate = validate([id_int(), status_id()]);
export const inputImageDelete = validate([id_int()]);

/** category */
export const inputCategoryGet = validate([id_int()]);
export const inputCategoryGets = validate([page(), limit()]);
export const inputCategoryCreate = validate([id_int()]);
export const inputCategoryUpdate = validate([id_int()]);
export const inputCategoryDelete = validate([id_int()]);

function id_uuid() {
  return param("id").notEmpty().withMessage("id is required").isUUID().withMessage("id must be a valid UUID");
}

function id_int() {
  return param("id").notEmpty().withMessage("id is required").isInt().withMessage("id must be a number");
}

function username() {
  return body("username")
    .notEmpty()
    .withMessage("username is required")
    .isLength({ min: 3 })
    .withMessage("username must be at least 3 characters long")
    .isAlpha()
    .withMessage("username must be a valid alpha [a-z]");
}

function email() {
  return body("email").notEmpty().withMessage("email is required").isEmail().withMessage("email must be a valid email");
}

function password() {
  return body("password")
    .notEmpty()
    .withMessage("password is required")
    .isStrongPassword({ minLength: 8, minLowercase: 1, minNumbers: "1", minSymbols: 1, minUppercase: 1 })
    .withMessage("password must be a strong password with at least 8 characters, 1 lowercase, 1 uppercase, 1 number, and 1 symbol");
}

function password2() {
  return body("password2")
    .notEmpty()
    .withMessage("password2 is required")
    .isStrongPassword({ minLength: 8, minLowercase: 1, minNumbers: "1", minSymbols: 1, minUppercase: 1 })
    .withMessage("password2 must be a strong password with at least 8 characters, 1 lowercase, 1 uppercase, 1 number, and 1 symbol")
    .custom((value, { req }) => {
      if (value !== req.body.password) throw new Error("password2 confirmation does not match password");
      return true;
    });
}

function limit() {
  return query("limit").notEmpty().withMessage("limit is required").isNumeric().withMessage("limit must be a number");
}

function page() {
  return query("page").notEmpty().withMessage("page is required").isNumeric().withMessage("page must be a number");
}

function role_id() {
  return body("role_id")
    .notEmpty()
    .withMessage("role_id is required")
    .isNumeric()
    .withMessage("role_id must be a number")
    .custom((value, { req }) => {
      if (value >= 2 && value <= 5) return true;
      throw new Error("role_id must be a valid role id");
    });
}

function slug() {
  return body("slug")
    .notEmpty()
    .withMessage("slug is required")
    .isSlug({ lower: true, strict: true })
    .withMessage("slug must be a valid lowercase and strict(-)")
    .isLength({ max: 100 })
    .withMessage("slug must be a maximum of 100 characters");
}

function title() {
  return body("title")
    .optional()
    .isLength({ max: 100 })
    .withMessage("title must be a maximum of 100 characters")
    .isString()
    .withMessage("title must be a valid string");
}

function content() {
  return body("content")
    .optional()
    .isLength({ max: 8000 })
    .withMessage("content must be a maximum of 100 characters")
    .isString()
    .withMessage("content must be a valid string");
}

function description() {
  return body("description")
    .optional()
    .isLength({ max: 100 })
    .withMessage("title must be a maximum of 100 characters")
    .isString()
    .withMessage("description must be a valid string");
}

function keywords() {
  return body("keywords")
    .optional()
    .isLength({ max: 100 })
    .withMessage("title must be a maximum of 100 characters")
    .isString()
    .withMessage("keywords must be a valid string");
}

function thumbnail() {
  return body("thumbnail").optional();
}

function status_id() {
  return body("status_id").notEmpty().withMessage("status_id is required").isNumeric().withMessage("status_id must be a number");
}

function user_id() {
  return body("user_id").optional().isUUID().withMessage("user_id must be a valid UUID");
}

function birthday() {
  return body("birthday")
    .optional()
    .isDate({ format: "YYYY-MM-DD", delimiters: ["-"], strictMode: true })
    .withMessage("birthday must be a valid date YYYY-MM-DD");
}

function first_name() {
  return body("first_name").optional().isAlpha().withMessage("first_name must be a valid alpha [a-z]");
}

function last_name() {
  return body("last_name").optional().isAlpha("en-US", { ignore: " " }).withMessage("last_name must be a valid alpha [a-z]");
}

function about_me() {
  return body("about_me").optional().isString().withMessage("about_me must be a valid string");
}

function image_slug() {
  return body("image_slug").optional().isString().withMessage("image_slug must be a valid string");
}
