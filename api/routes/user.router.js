const userRouter = require('express').Router();
const users = require("../controllers/user.controller.js");

// Create a new user
userRouter.post("/", users.registerNewUser);

userRouter.post("/login", users.loginUser);

// Retrieve all users
userRouter.get("/", users.findAll);

// Retrieve all admin users
userRouter.get("/admin", users.findAllAdmin);

// Retrieve a single user with id
userRouter.get("/:id", users.findOne);

// Update a user with id
userRouter.put("/:id", users.update);

// Delete a user with id
userRouter.delete("/:id", users.delete);

module.exports = userRouter;