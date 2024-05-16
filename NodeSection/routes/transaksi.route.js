const express = require(`express`)
const app = express()
app.use(express.json())

/** load function-------------------------------------------------------------------------*/
const transaksiController = require(`../controllers/transaksi.controller`)
const { validateUser, validateRegister } = require("../middlewares/user-validation")

const { midOne } = require("../middlewares/simple-middleware")

const { authorize } = require('../controllers/auth.controller')
const { IsUser, IsAdmin } = require('../middlewares/role-validation')

/** load function-------------------------------------------------------------------------*/


/** Routeeeeeee -------------------------------------------------------------------------*/

app.post("/", authorize, transaksiController.addTransaksi)
app.get("/", transaksiController.AllUserTransaksi)

/** Routeeeeeee -------------------------------------------------------------------------*/


module.exports = app