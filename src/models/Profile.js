import sequelize from "../configs/database.js";
import { DataTypes } from "sequelize";

const Profile = sequelize.define(
  "profile",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: null,
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
    },
    picture: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
    },
    about_me: {
      type: DataTypes.STRING(225),
      allowNull: true,
      defaultValue: null,
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
  }
);

export default Profile;
