import sequelize from "../configs/database.js";
import { DataTypes } from "sequelize";

const Category = sequelize.define(
  "category",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
    },
    description: {
      type: DataTypes.STRING(225),
      allowNull: true,
      defaultValue: null,
    },
    perent_category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Category.belongsTo(Category, { foreignKey: "perent_category_id", targetKey: "id" });

export default Category;
