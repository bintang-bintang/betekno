/** Load models */
const produk = require('../models/index').produk
const customer = require('../models/index').customer
const keranjang = require('../models/index').keranjang

exports.tambahProdukKeranjang = async (req, res) => {
    try {
        // Cek apakah customer dan produk tersedia
        let produkID = req.body.produkID

        //mencari produk dengan id produk
        const existingProduk = await produk.findOne({ where: { produkID: produkID } });

        if (!existingProduk) {
            return res.status(404).json(
                {
                    error: 'produk tidak ditemukan.'
                });
        }

        // Tambahkan produk ke keranjang
        const newKeranjang = await keranjang.create({
            customerID: req.customer.customerID,
            produkID: existingProduk.produkID
        });

        return res.status(201).json(
            {
                message: 'Produk berhasil ditambahkan ke keranjang.',
                data: newKeranjang
            });
    } catch (error) {
        console.error('Error tambahkan produk ke keranjang:', error);
        return res.status(500).json({ error: 'Terjadi kesalahan saat menambahkan produk ke keranjang.' });
    }
}

exports.showAllKeranjang = async (req, res) => {
    try {
        const allKeranjang = await keranjang.findAll({ where: { customerID: req.customer.customerID } })

        return res.json({
            success: true,
            data: allKeranjang
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

exports.deleteKeranjang = async (req, res) => {
    try {
        const { keranjangID } = req.params
        const hapusPickedKeranjang = await keranjang.destroy({ where: { keranjangID: keranjangID } })

        return res.json({
            success: true,
            message: `Keranjang berhasil dihapus`
        })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}