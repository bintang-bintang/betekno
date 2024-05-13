const express = require(`express`)
const app = express()
const cors = require(`cors`)
app.use(cors())

const {midOne} = require(`./middlewares/simple-middleware`)
app.use(midOne); //use getAll on CRUD User to check!


const userRoute = require(`./routes/user.route`)
app.use(`/user`, userRoute)

const produkRoute = require(`./routes/produk.route`)
app.use(`/produk`, produkRoute)

const keranjang = require(`./routes/keranjang.route`)
app.use(`/keranjang`, keranjang)

const transaksi = require(`./routes/transaksi.route`)
app.use(`/transaksi`, transaksi)

const auth = require(`./routes/auth.route`)
app.use(`/auth`, auth)


/** define port of server */
const PORT = 8000
/** run server based on defined port */
app.listen(PORT, () => {
    console.log(`Server of TeknoHub runs on port ${PORT}`)
})
