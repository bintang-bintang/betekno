const express = require(`express`)
const app = express()
app.use(express.json())

/** load function-------------------------------------------------------------------------*/
const produkController = require(`../controllers/produk.controller`)
const { authorize } = require('../controllers/auth.controller')
const { IsUser, IsAdmin } = require('../middlewares/role-validation')

/** load function-------------------------------------------------------------------------*/


/** Routeeeeeee -------------------------------------------------------------------------*/

app.get("/", authorize, IsAdmin, produkController.getAllProduk)
app.get("/:key", authorize, IsAdmin, produkController.findProduk)
app.post("/", authorize, IsAdmin, produkController.addProduk)
app.put("/", authorize, IsAdmin, produkController.updateProduk)
app.delete("/", authorize, IsAdmin, produkController.deleteProduk)

/** Routeeeeeee -------------------------------------------------------------------------*/


module.exports = app