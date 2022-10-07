import Category from "../models/Category.js";
import httpresponse from "../helpers/http_response.js";
import { Op } from "sequelize";

export const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) return res.status(404).json(httpresponse(404, "Category not found"));

    const data = { data: category };
    if (category) return res.status(200).json(httpresponse(200, "Category found", data));
  } catch (error) {
    next(error);
  }
};

export const getCategorys = async (req, res, next) => {
  try {
    var page = Number(req.query.page) || 1;
    var limit = Number(req.query.limit) || 10;
    var offset = (page - 1) * limit;

    const categorys = await Category.findAndCountAll({
      limit: limit,
      offset: offset,
      where: { perent_category_id: null },
      // attributes: { exclude: ["perent_category_id"] },
      // include: [{ model: Category, as: "perent_category" }],
      raw: true,
      nest: true,
    });

    if (categorys.rows.length === 0) return res.status(404).json(httpresponse(404, "Category not found"));

    // create pagination
    const totalPage = Math.ceil(categorys.count / limit);
    const currentPage = page;
    const nextPage = page < totalPage ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    const pagination = {
      count: categorys.count,
      total_page: totalPage,
      current_page: currentPage,
      next_page: nextPage,
      prev_page: prevPage,
    };

    // child category

    const data = { data: categorys.rows, pagination };
    return res.status(200).json(httpresponse(200, "Category found", data));
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    const data = { data: category };
    if (category) return res.status(201).json(httpresponse(201, "Category created", data));
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    if (req.params.id == 1) return res.status(400).json(httpresponse(400, "Category cannot be updated"));

    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json(httpresponse(404, "Category not found"));

    const { slug, name, description, perent_category_id } = req.body;
    await category.update({ slug, name, description, perent_category_id });
    return res.status(200).json(httpresponse(200, "Category updated"));
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    if (req.params.id == 1) return res.status(400).json(httpresponse(400, "Category cannot be deleted"));

    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json(httpresponse(404, "Category not found"));

    await category.destroy();
    return res.status(200).json(httpresponse(200, "Category deleted"));
  } catch (error) {
    next(error);
  }
};
