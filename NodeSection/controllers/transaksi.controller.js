const transaksiModel = require(`../models/index`).transaksi
const userModel = require(`../models/index`).customer
const keranjangModel = require(`../models/index`).keranjang
const produkModel = require(`../models/index`).produk

const detailModel = require(`../models/index`).detail

exports.addTransaksi = async (request, response) => {
    try {
        const today = new Date()

        const userData = request.customer
        const userWallet = request.customer.teknoCoin

        const findKeranjang = await keranjangModel.findOne({where: request.body.keranjangID})

        if (findKeranjang.customerID !== userData.customerID) {
            return response.status(400).json({
                success: false,
                message: `Ini bukan keranjangmu`
            })
        }

        const produk = await produkModel.findOne({ where: { produkID: findKeranjang.produkID} })
        let kuantitas = request.body.kuantitas
        const harga = produk.hargaProduk * kuantitas

        if (kuantitas > produk.stokProduk) {
            return response.json({
                success: false,
                message: `Kuantitas yang anda masukan lebih besar dari stok produk!`
            })
        }

        if (harga > userWallet) {
            return response.json({
                success: false,
                message: `TeknoCoin User tidak mencukupi!`
            })
        }
        let a = userWallet - harga
        const updStokProduk = await produkModel.update(
            {stokProduk: produk.stokProduk - kuantitas}, 
            {where: {produkID: produk.produkID}})

        const updCoinUser = await userModel.update(
            {teknoCoin: a}, 
            {where: {customerID: userData.customerID}})
        
        let newTransaksi = {
            tanggal: today,
            jumlahHarga: harga,
            pesan: request.body.pesan,
            customerID: userData.customerID
        }

        const addedTransaksi = await transaksiModel.create(newTransaksi)
        
        let newDetail = {
            transaksiID: addedTransaksi.transaksiID,
            keranjangID: produk.produkID
        }

        const addedDetail = await detailModel.create(newDetail)

        return response.json({
            success: true,
            data: {
                transaksi: addedTransaksi,
                detail: addedDetail
            }
        })

    } catch (error) {
        return response.status(400).json({
            success: false,
            message: error.message
        })
    }
}
