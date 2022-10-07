import Category from "../models/Category.js";
import Post from "../models/Post.js";
import Profile from "../models/Profile.js";
import Role from "../models/Role.js";
import Status from "../models/Status.js";
import Tag from "../models/Tag.js";
import User from "../models/User.js";
import Image from "../models/Image.js";

async function createTable() {
  try {
    // await Role.sync();
    // await Status.sync();
    await Category.sync();
    // await Tag.sync();
    // await Profile.sync();
    // await User.sync();
    // await Post.sync();
    // await Image.sync();

    // await createData();

    console.log("Table has been created");
  } catch (error) {
    console.log("Table has not been created", error.message);
  }
}

async function createData() {
  try {
    await Status.bulkCreate([
      { id: 1, name: "active" },
      { id: 2, name: "inactive" },
      { id: 3, name: "publish" },
      { id: 4, name: "private" },
      { id: 5, name: "pending" },
      { id: 6, name: "review" },
      { id: 7, name: "draft" },
    ]);

    await Role.bulkCreate([
      { id: 1, name: "su" },
      { id: 2, name: "admin" },
      { id: 3, name: "operator" },
      { id: 4, name: "editor" },
      { id: 5, name: "writer" },
    ]);

    await Category.bulkCreate([{ id: 1, name: "Uncategorized", slug: "uncategorized", description: "Uncategorized" }]);

    await Profile.bulkCreate([
      {
        id: 1,
        first_name: "Super",
        last_name: "Admin",
        about_me: "Im Super Admin",
        created_at: new Date(),
      },
    ]);

    await User.bulkCreate([
      {
        id: "00000000-0000-0000-0000-000000000000",
        email: "su@gmail.com",
        username: "superadmin",
        password: "cac7b4845460208aca41e1c469921147", // Su.12345
        role_id: 1, // su
        status_id: 1, // active
        profile_id: 1,
        created_at: new Date(),
      },
    ]);

    await Image.bulkCreate([
      {
        id: 1,
        slug: "thumbnail",
        title: "Thumbnail",
        path: "/assets/img/thumbnail.png",
        user_id: "00000000-0000-0000-0000-000000000000",
        created_at: new Date(),
      },
    ]);

    console.log("Data has been created");
  } catch (error) {
    console.log("Data has not been created", error);
  }
}

async function dropTable() {
  try {
    await Post.drop();
    await User.drop();
    await Category.drop();
    await Tag.drop();
    await Status.drop();
    await Role.drop();
    await Profile.drop();

    console.log("Table has been dropped");
  } catch (error) {
    console.log("Table has not been dropped", error.message);
  }
}

export { createTable, dropTable };
