import Post from "../models/Post.js";
import User from "../models/User.js";
import Profile from "../models/Profile.js";
import Status from "../models/Status.js";
import Category from "../models/Category.js";

import httpresponse from "../helpers/http_response.js";

/**
 * Find data post by primary key
 * @returns
 */
export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "user",
          include: [{ model: Profile, as: "profile" }],
        },
        { model: Status, as: "status" },
      ],
      raw: true,
      nest: true,
    });
    if (!post) return res.status(404).json(httpresponse(404, "Post not found"));

    const categoryList = post.category_list.split(",");
    const category = async () => {
      return await Promise.all(
        categoryList.map(async (cat) => {
          const category = await Category.findByPk(cat);
          return category;
        })
      );
    };

    post.category = await category();
    delete post.category_list;

    const data = { data: post };
    if (post) return res.status(200).json(httpresponse(200, "Post found", data));
  } catch (error) {
    next(error);
  }
};

/**
 * Find all post
 * @returns
 */
export const getPosts = async (req, res, next) => {
  try {
    var page = Number(req.query.page) || 1;
    var limit = Number(req.query.limit) || 10;
    var offset = (page - 1) * limit;
    var order = req.query.order || "DESC";
    // var filds = req.query.filds || "id,slug,content,description,keywords,thumbnail,title,created_at,updated_at,user_id,status_id,category_list";

    const posts = await Post.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["created_at", order]],
      include: [
        {
          model: User,
          as: "user",
          include: [{ model: Profile, as: "profile" }],
        },
        { model: Status, as: "status" },
      ],
      raw: true,
      nest: true,
    });

    if (posts.rows.length === 0) return res.status(404).json(httpresponse(404, "Posts not found"));

    //create pagination
    const totalPage = Math.ceil(posts.count / limit);
    const currentPage = page;
    const nextPage = page < totalPage ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    const pagination = {
      count: posts.count,
      total_page: totalPage,
      current_page: currentPage,
      next_page: nextPage,
      prev_page: prevPage,
    };

    const dataPosts = async () => {
      return await Promise.all(
        posts.rows.map(async (post) => {
          const categoryList = post.category_list.split(",");
          const category = async () => {
            return await Promise.all(
              categoryList.map(async (cat) => {
                const category = await Category.findByPk(cat);
                return category;
              })
            );
          };

          post.category = await category();
          delete post.category_list;

          return post;
        })
      );
    };

    const data = { data: await dataPosts(), pagination };
    if (posts.rows.length > 0) return res.status(200).json(httpresponse(200, "Posts found", data));
  } catch (error) {
    next(error);
  }
};

/**
 * Find post by primary key and only status published
 * @returns
 */
export const getPostPublished = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      where: { status_id: 3 },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username"],
          include: [{ model: Profile, as: "profile", attributes: ["first_name", "last_name", "picture"] }],
        },
      ],
      // raw: true,
    });

    if (!post) return res.status(404).json(httpresponse(404, "Post not found"));

    const data = { data: post };
    if (post) return res.status(200).json(httpresponse(200, "Post found", data));
  } catch (error) {
    next(error);
  }
};

/**
 * Find all post only status published
 * @returns
 */
export const getPostsPublished = async (req, res, next) => {
  try {
    var page = Number(req.query.page) || 1;
    var limit = Number(req.query.limit) || 10;
    var offset = (page - 1) * limit;
    var order = req.query.order || "DESC";

    const posts = await Post.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["created_at", order]],
      attributes: { exclude: ["description"] },
      where: { status_id: 3 },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username"],
          include: [{ model: Profile, as: "profile", attributes: ["first_name", "last_name", "picture"] }],
        },
      ],
      // raw: true,
    });

    if (posts.rows.length === 0) return res.status(404).json(httpresponse(404, "Posts not found"));

    //create pagination
    const totalPage = Math.ceil(posts.count / limit);
    const currentPage = page;
    const nextPage = page < totalPage ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    const pagination = {
      count: posts.count,
      total_page: totalPage,
      current_page: currentPage,
      next_page: nextPage,
      prev_page: prevPage,
    };

    const data = { data: posts.rows, pagination };
    if (posts.rows.length > 0) return res.status(200).json(httpresponse(200, "Posts found", data));
  } catch (error) {
    next(error);
  }
};

/**
 * Update post by primary key
 * @returns
 */
export const updatePost = async (req, res, next) => {
  try {
    delete req.body.id;

    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json(httpresponse(404, "Post not found"));

    await post.update(req.body);
    if (post[0] === 1) return res.status(200).json(httpresponse(200, "Post updated successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * Delete post by primary key
 * @returns
 */
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json(httpresponse(404, "Post not found"));

    await post.destroy();
    if (post === 1) return res.status(200).json(httpresponse(200, "Post deleted successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * Crate a new post
 * @returns
 */
export const createPost = async (req, res, next) => {
  try {
    req.body.user_id = req.userId;
    req.body.created_at = new Date();

    delete req.body.id;

    //check slug
    const slug = await Post.findOne({ where: { slug: req.body.slug } });
    if (slug) return res.status(400).json(httpresponse(400, "Validation error", { errors: { slug: "Slug already exists" } }));

    const post = await Post.create(req.body);
    if (!post) return res.status(400).json(httpresponse(400, "Post not created"));

    const data = { data: post };
    if (post) return res.status(200).json(httpresponse(200, "Post created successfully", data));
  } catch (error) {
    next(error);
  }
};
