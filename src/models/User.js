import { createHash } from "crypto";
import sequelize from "../configs/database.js";
import { DataTypes } from "sequelize";

import Role from "./Role.js";
import Status from "./Status.js";
import Profile from "./Profile.js";

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
    },
    profile_id: {
      type: DataTypes.INTEGER,
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
    hooks: {
      beforeUpdate: (user, options) => {
        user.password = createHash("md5").update(user.password).digest("hex");
      },
      beforeCreate: (user, options) => {
        user.password = createHash("md5").update(user.password).digest("hex");
      },
    },
    defaultScope: {
      attributes: { exclude: ["password", "status_id", "role_id", "profile_id"] },
      // include: [
      //   { model: Profile, as: "profile" },
      //   { model: Status, as: "status" },
      //   { model: Role, as: "role" },
      // ],
      // raw: true,
    },
  }
);

User.belongsTo(Role, { foreignKey: "role_id" });
User.belongsTo(Status, { foreignKey: "status_id" });
User.belongsTo(Profile, { foreignKey: "profile_id" });

export default User;
