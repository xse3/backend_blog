import Image from "../models/Image.js";
import User from "../models/User.js";
import Status from "../models/Status.js";
import Profile from "../models/Profile.js";
import multer from "multer";
import httpresponse from "../helpers/http_response.js";

const fileSize = 1024 * 1024 * 1; // 1MB

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets/img");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: fileSize,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Not an image"));
    }
  },
});

export const uploadImage = (req, res, next) => {
  upload.single("picture")(req, res, (err) => {
    multerHandleError(req, res, err, next);
  });
};

export const uploadImages = (req, res, next) => {
  upload.array("picture")(req, res, (err) => {
    multerHandleError(req, res, err, next);
  });
};

async function multerHandleError(req, res, err, next) {
  if (err) {
    //multer error handler
    if (err.message == "Not an image")
      return res.status(400).json(httpresponse(400, "Validation error", { errors: { picture: "Only .png, .jpg and .jpeg format allowed" } }));
    if (err.message == "File too large")
      return res.status(400).json(httpresponse(400, "Validation error", { errors: { picture: `Max size ${fileSize / 1024}KB` } }));
    if (err.message == "Unexpected field")
      return res.status(400).json(httpresponse(400, "Validation error", { errors: { picture: "Only single file" } }));
    return res.status(500).json(httpresponse(500, err.message));
  }

  try {
    const files = req.file === undefined ? req.files : [req.file];

    if (files === undefined) return res.status(400).json(httpresponse(400, "Validation error", { errors: { picture: "Image is required" } }));

    const array = [];
    files.forEach((file) => {
      array.push({
        slug: file.filename,
        title: file.originalname,
        path: file.path.replace("public\\", "/").replace(/\\/g, "/"),
        status_id: 3,
        user_id: req.userId,
        created_at: new Date(),
        updated_at: new Date(),
      });
    });

    const images = await Image.bulkCreate(array);
    return res.status(200).json(httpresponse(200, "Image uploaded successfully", { data: images }));
  } catch (error) {
    next(error);
  }
}

export const getImage = async (req, res, next) => {
  try {
    const image = await Image.findByPk(req.params.id, {
      attributes: { exclude: ["status_id", "user_id"] },
      include: [
        { model: User, as: "user", include: [{ model: Profile, as: "profile" }] },
        { model: Status, as: "status" },
      ],
    });
    if (!image) return res.status(404).json(httpresponse(404, "Image not found"));
    return res.status(200).json(httpresponse(200, "Image found", { data: image }));
  } catch (error) {
    next(error);
  }
};

export const getImages = async (req, res, next) => {
  try {
    var page = Number(req.query.page) || 1;
    var limit = Number(req.query.limit) || 10;
    var offset = (page - 1) * limit;

    const images = await Image.findAndCountAll({
      limit: limit,
      offset: offset,
      include: [
        { model: User, as: "user", include: [{ model: Profile, as: "profile" }] },
        { model: Status, as: "status" },
      ],
      raw: true,
      nest: true,
    });

    if (images.rows.length === 0) return res.status(404).json(httpresponse(404, "Images not found"));

    //create pagination
    const totalPage = Math.ceil(images.count / limit);
    const currentPage = page;
    const nextPage = page < totalPage ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    const pagination = {
      count: images.count,
      total_page: totalPage,
      current_page: currentPage,
      next_page: nextPage,
      prev_page: prevPage,
    };

    const data = { data: images.rows, pagination };
    if (images.rows.length > 0) return res.status(200).json(httpresponse(200, "Images found", data));
  } catch (error) {
    next(error);
  }
};

export const updateImage = async (req, res, next) => {
  try {
    const image = await Image.findByPk(req.params.id);
    if (!image) return res.status(404).json(httpresponse(404, "Image not found"));

    await image.update({
      title: req.body.title,
      status_id: req.body.status_id,
      updated_at: new Date(),
    });

    return res.status(200).json(httpresponse(200, "Image updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteImage = async (req, res, next) => {
  try {
    const image = await Image.findByPk(req.params.id);
    if (!image) return res.status(404).json(httpresponse(404, "Image not found"));
    await image.destroy();
    return res.status(200).json(httpresponse(200, "Image deleted successfully"));
  } catch (error) {
    next(error);
  }
};

export const viewImage = (req, res, next) => {
  res.sendFile(req.params.slug, { root: "public/assets/img" }, (err) => {
    if (err) return res.status(404).json(httpresponse(404, "Image not found"));
  });
};

export const viewImagePublished = async (req, res, next) => {
  try {
    const image = await Image.findOne({ where: { slug: req.params.slug, status_id: 3 } });
    if (!image) return res.status(404).json(httpresponse(404, "Image not found"));
    res.sendFile(req.params.slug, { root: "public/assets/img" }, (err) => {
      if (err) return res.status(404).json(httpresponse(404, "Image not found"));
    });
  } catch (error) {
    next(error);
  }
};
