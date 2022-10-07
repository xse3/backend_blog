import sequelize from "../configs/database.js";
import { DataTypes } from "sequelize";

import User from "./User.js";
import Status from "./Status.js";
import Category from "./Category.js";
import Tag from "./Tag.js";

const Post = sequelize.define(
  "post",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      defaultValue: null,
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
    },
    keywords: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
    },
    thumbnail: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
    },
    category_list: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: 1,
    },
    user_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    defaultScope: {
      attributes: { exclude: ["user_id", "status_id"] },
      // include: [
      //   { model: User, as: "user" },
      //   { model: Status, as: "status" },
      // ],
    },
  }
);

export default Post;

Post.belongsTo(User, { foreignKey: "user_id", targetKey: "id" });
Post.belongsTo(Status, { foreignKey: "status_id", targetKey: "id" });