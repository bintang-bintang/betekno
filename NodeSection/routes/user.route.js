const express = require(`express`)
const app = express()
app.use(express.json())

/** load function-------------------------------------------------------------------------*/
const userController = require(`../controllers/user.controller`)
const { validateUser, validateRegister } = require("../middlewares/user-validation")

const { midOne } = require("../middlewares/simple-middleware")

const { authorize } = require('../controllers/auth.controller')
const { IsUser, IsAdmin } = require('../middlewares/role-validation')

/** load function-------------------------------------------------------------------------*/


/** Routeeeeeee -------------------------------------------------------------------------*/

// app.get("/", userController.getAllUser)
// app.get("/:key", userController.findUser)
// app.post("/", userController.addUser)
// app.put("/:id", userController.updateUser)
// app.delete("/:id", userController.deleteUser)

// app.post("/", validateUser, userController.addUser)
// app.put("/:id", validateUser, userController.updateUser)

// app.get("/", [midOne], userController.getAllUser)

app.post("/",  validateUser, userController.addUser)
app.post("/register", validateUser, userController.register)
app.get("/", authorize, IsAdmin, userController.getAllUser)
app.get("/:key", authorize, IsAdmin, userController.findUser)
app.put("/:id",  userController.updateUserAdmin)
app.put("/:id", authorize, IsUser, validateUser,userController.updateUserCustomer)
app.put("/reset/:id", userController.resetPwd)
app.delete("/:id", authorize, IsAdmin, userController.deleteUser)

/** Routeeeeeee -------------------------------------------------------------------------*/


module.exports = app