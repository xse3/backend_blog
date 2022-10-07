import sequelize from "../configs/database.js";
import { DataTypes } from "sequelize";

import Status from "./Status.js";
import User from "./User.js";

const Image = sequelize.define(
  "image",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      d5efaultValue: 3,
    },
    user_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Image.belongsTo(Status, { foreignKey: "status_id", targetKey: "id" });
Image.belongsTo(User, { foreignKey: "user_id", targetKey: "id" });

export default Image;
