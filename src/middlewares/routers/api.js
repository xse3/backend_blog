import express from "express";

const api = express.Router();

/** controllers */
import { getUser, createUser, updateUser, deleteUser, getUsers } from "../../controllers/user.js";
import { getPost, getPosts, getPostPublished, getPostsPublished, updatePost, deletePost, createPost } from "../../controllers/post.js";
import { getCategory, getCategorys, createCategory, updateCategory, deleteCategory } from "../../controllers/category.js";
import { upsertProfile } from "../../controllers/profile.js";
import { uploadImage, uploadImages, getImage, getImages, updateImage, deleteImage, viewImage, viewImagePublished } from "../../controllers/image.js";

/** authentication */
import {
  inputUserDelete,
  inputUserUpdate,
  inputUserCreate,
  inputUserGet,
  inputUserGets,
  inputPostGet,
  inputPostGets,
  inputPostUpdate,
  inputPostDelete,
  inputPostCreate,
  inputPostGetPublished,
  inputPostGetPublisheds,
  inputAuthLogin,
  inputAuthRegister,
  inputImageGet,
  inputImageGets,
  inputImageView,
  inputImageUpdate,
  inputImageDelete,
  inputProfileUpsert,
  inputCategoryGet,
  inputCategoryGets,
  inputCategoryCreate,
  inputCategoryUpdate,
  inputCategoryDelete,
} from "../authentication/validation.js";

import { tokenUser, loginUser, logoutUser, registerUser } from "../authentication/auth.js";
import { roleUser } from "../authentication/access.js";

/** auth */
api.post("/auth/login", inputAuthLogin, loginUser);
api.post("/auth/register", inputAuthRegister, registerUser);
api.post("/auth/logout", tokenUser, logoutUser);
api.post("/auth/reset");
api.post("/auth/vetify");

/** user */
api.get("/user/:id", tokenUser, inputUserGet, getUser);
api.get("/users?", tokenUser, inputUserGets, getUsers);
api.post("/user/", tokenUser, inputUserCreate, createUser);
api.put("/user/:id", tokenUser, inputUserUpdate, updateUser);
api.delete("/user/:id", tokenUser, inputUserDelete, deleteUser);

/** post */
api.get("/post/:id", tokenUser, inputPostGet, getPost);
api.get("/posts?", tokenUser, inputPostGets, getPosts);
api.post("/post", tokenUser, inputPostCreate, createPost);
api.put("/post/:id", tokenUser, inputPostUpdate, updatePost);
api.delete("/post/:id", tokenUser, inputPostDelete, deletePost);
api.get("/post/published/:id", inputPostGetPublished, getPostPublished);
api.get("/posts/published?", inputPostGetPublisheds, getPostsPublished);

/** category */
api.get("/category/:id", tokenUser, inputCategoryGet, getCategory);
api.get("/categorys?", tokenUser, inputCategoryGets, getCategorys);
api.post("/category", tokenUser, inputCategoryCreate, createCategory);
api.put("/category/:id", tokenUser, inputCategoryUpdate, updateCategory);
api.delete("/category/:id", tokenUser, inputCategoryDelete, deleteCategory);

/** profile */
api.post("/profile/:id", tokenUser, inputProfileUpsert, upsertProfile); //:id is user.id

/** image */
api.get("/image/:id", tokenUser, inputImageGet, getImage);
api.get("/images?", tokenUser, inputImageGets, getImages);
api.post("/image", tokenUser, uploadImage);
api.post("/images", tokenUser, uploadImages);
api.put("/image/:id", tokenUser, inputImageUpdate, updateImage);
api.delete("/image/:id", tokenUser, inputImageDelete, deleteImage);
api.get("/image/view/:slug", tokenUser, inputImageView, viewImage);
api.get("/image/view/published/:slug", inputImageView, viewImagePublished);

/** post */
export default api;
