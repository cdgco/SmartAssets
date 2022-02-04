const { verify_user } = require("../auth");
const userRouter = require('express').Router();
const user = require("../controllers/user.controller");

userRouter.post("/signin", user.signin);

userRouter.post("/signup", [
        verify_user.checkDuplicateUsernameOrEmail,
        verify_user.checkRoleExists
    ],
    user.signup
)
userRouter.get("/", user.findAll);

userRouter.get("/:id", user.findOne);

userRouter.put("/:id", user.update);

userRouter.delete("/:id", user.delete);

module.exports = userRouter;