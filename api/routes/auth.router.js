const { verify_user_email } = require("../auth");
const authRouter = require('express').Router();
const auth = require("../controllers/auth.controller");

authRouter.post("/signin", auth.signin);

authRouter.post("/signup", [
        verify_user_email.checkDuplicateUsernameOrEmail,
        verify_user_email.checkRoleExists
    ],
    auth.signup
)

module.exports = authRouter;