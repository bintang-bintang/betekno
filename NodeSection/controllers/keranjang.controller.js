/** Load models */
const produk = require('../models/index').produk
const customer = require('../models/index').customer
const keranjang = require('../models/index').keranjang

exports.tambahProdukKeranjang = async (req, res) => {
    try {
        // Cek apakah customer dan produk tersedia
        let produkID = req.body.produkID
        const pelanggan = req.customer

        //mencari produk dengan id produk
        const existingProduk = await produk.findOne({ where: { produkID: produkID } });

        if (!existingProduk) {
            return res.status(404).json(
                {
                    error: 'produk tidak ditemukan.'
                });
        }

        let produkTambah = {
            customerID: req.customer.customerID,
            produkID: existingProduk.produkID,
            kuantitas: 1,
            subHarga: existingProduk.hargaProduk,
            status: true
        }

        const pelannganKeranjang = await keranjang.findAll({ where: { customerID: pelanggan.customerID } })
        for (let i = 0; i < pelannganKeranjang.length; i++) {
            if (pelannganKeranjang[i].produkID === existingProduk.produkID && pelannganKeranjang[i].customerID === pelanggan.customerID) {
                
                await keranjang.update({kuantitas: pelannganKeranjang[i].kuantitas +1},
                    {where: {keranjangID: pelannganKeranjang[i].keranjangID}})

                const findKerangjang = await keranjang.findOne({where: {keranjangID: pelannganKeranjang[i].keranjangID}})
                
                await keranjang.update({subHarga: existingProduk.hargaProduk * findKerangjang.kuantitas},
                    {where: {keranjangID: pelannganKeranjang[i].keranjangID}})
                
                await keranjang.update({status: true},
                    {where: {keranjangID: pelannganKeranjang[i].keranjangID}})

                
                return res.status(201).json(
                    {
                        message: 'penambahan produk kuantitas.'
                    });
            }
        }



        // const existedKeranjang = await keranjang.findOne({where: {produkID: null}}) 

        // for (let i = 0; i < array.length; i++) {
        //     const element = array[i];

        // }


        
        // Tambahkan produk ke keranjang
        const newKeranjang = await keranjang.create(produkTambah)

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
        const allKeranjang = await keranjang.findAll({ where: { customerID: req.customer.customerID, status: true } })

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