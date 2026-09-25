const express = require("express");
const authMiddleware= require("../middlewares/auth.middleware")

const accountController = require("../controllers/account.controller")

const router = express.Router();



/*
post/api/account/

create a new account 

protected Route

*/

router.post("/", authMiddleware.authMiddleware , accountController.createAccountController)




module.exports = router