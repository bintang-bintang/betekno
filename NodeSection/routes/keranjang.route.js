const express = require(`express`)
const app = express()
app.use(express.json())

/** load function-------------------------------------------------------------------------*/
const keranjangController = require(`../controllers/keranjang.controller`)
const { validateUser, validateRegister } = require("../middlewares/user-validation")

const { midOne } = require("../middlewares/simple-middleware")

const { authorize } = require('../controllers/auth.controller')
const { IsUser, IsAdmin } = require('../middlewares/role-validation')

/** load function-------------------------------------------------------------------------*/


/** Routeeeeeee -------------------------------------------------------------------------*/

app.post("/", authorize, IsUser, keranjangController.tambahProdukKeranjang)
app.get("/", authorize, IsUser, keranjangController.showAllKeranjang)
app.delete("/:keranjangID", authorize, IsUser, keranjangController.deleteKeranjang)

/** Routeeeeeee -------------------------------------------------------------------------*/


module.exports = app