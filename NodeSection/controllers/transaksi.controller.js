const transaksiModel = require(`../models/index`).transaksi
const userModel = require(`../models/index`).customer
const keranjangModel = require(`../models/index`).keranjang
const produkModel = require(`../models/index`).produk

const detailModel = require(`../models/index`).detail

exports.addTransaksi = async (request, response) => {
    try {
      let a = new Date()

      // const pelanggan = request.customer

      const dataTransaksiList = {
        customerID: request.customer.customerID,
        tanggal: a,
        jumlahHarga: 0
      };  
      let jumlahHargas = 0

      // const keranjangPelanggan = await keranjangModel.findAll({where: {customerID: pelanggan.customerID}})
      
      const banyakKeranjang = request.body.banyakKeranjang;
      /*
          [
              {
                  keranjangID: 1,
              },
              {
                  keranjangID: 2,
              }
          ]
          */

          // const cekProdukKeranjang = await keranjangModel.findAll()
////////////////////////////////////////////////////////////////////////////////////////Pengecekan
      for (let i = 0; i < banyakKeranjang.length; i++) {
        const keranjangData = await keranjangModel.findOne({where: {keranjangID: banyakKeranjang[i].keranjangID}})

        const produkData = await produkModel.findOne({
          where: { produkID: keranjangData.produkID },
        });
        if (!produkData) {
          return response.json({
            success: false,
            message: "ID produk tidak ada di database",
          });
        }

        //Pengecekan kuantitas produk apakah berlebih?
        if (banyakKeranjang[i].kuantitas > produkData.stokProduk) {
          return response.json({
            success: false,
            message: "Kuantitas produk yang dimasukkan berlebih!",
          });
        }

        //pengecekan teknoCoin customer apakah cukup?
        jumlahHargas += keranjangData.subHarga
      }

      if (jumlahHargas > request.customer.teknoCoin) {
        console.log(request.customer.teknoCoin);
        return response.json({
          success: false,
          message: "Tekno Koin anda tidak mencukupi!",
        });
      }
////////////////////////////////////////////////////////////////////////////////////////Pengecekan

      const newTransaksiList = await transaksiModel.create(dataTransaksiList);
  
      for (let index = 0; index < banyakKeranjang.length; index++) {

        const keranjangData = await keranjangModel.findOne({where: {keranjangID: banyakKeranjang[index].keranjangID}})

        const produkData = await produkModel.findOne({
          where: { produkID: keranjangData.produkID },
        });


        //update stokProduk setelah dibeli
        await produkModel.update({stokProduk: produkData.stokProduk - keranjangData.kuantitas},{
          where: {
            produkID: produkData.produkID
          }
        })


        let newDetail = {
          transaksiID: newTransaksiList.transaksiID,
          keranjangID: produkData.produkID
          // kuantitas: keranjangModel.kuantitas
          // jumlahHarga: produkData.hargaProduk * banyakKeranjang[index].kuantitas,
        };
  
        await detailModel.create(newDetail);
      }

      await transaksiModel.update({jumlahHarga: jumlahHargas},{where: {transaksiID: newTransaksiList.transaksiID}})

      const user = request.customer

      await userModel.update({teknoCoin: user.teknoCoin - jumlahHargas}, {where: {customerID : user.customerID}})
  
      
      return response.json({
        success: true,
        message: "Data inserted",
      });
    } catch (error) {
      return response.json({
        success: false,
        message: error.message,
      });
    }
  };

  exports.AllUserTransaksi = async (request, response) => {
    try {
      const showAll = await transaksiModel.findAll({
        include: [
          {
            model: detailModel,
            as: "transaksiDetail"
          }
        ]
      })
      

      return response.json({
        success: true,
        data: showAll
      });

      
    } catch (error) {
      return response.json({
        success: false,
        message: error.message,
      });
    }
  }
// exports.addTransaksi = async (request, response) => {
//     try {
//         const today = new Date()

//         const userData = request.customer
//         const userWallet = request.customer.teknoCoin

//         const findKeranjang = await keranjangModel.findOne({where: request.body.keranjangID})

//         if (findKeranjang.customerID !== userData.customerID) {
//             return response.status(400).json({
//                 success: false,
//                 message: `Ini bukan keranjangmu`
//             })
//         }

//         const produk = await produkModel.findOne({ where: { produkID: findKeranjang.produkID} })
//         let kuantitas = request.body.kuantitas
//         const harga = produk.hargaProduk * kuantitas

//         if (kuantitas > produk.stokProduk) {
//             return response.json({
//                 success: false,
//                 message: `Kuantitas yang anda masukan lebih besar dari stok produk!`
//             })
//         }

//         if (harga > userWallet) {
//             return response.json({
//                 success: false,
//                 message: `TeknoCoin User tidak mencukupi!`
//             })
//         }
//         let a = userWallet - harga
//         const updStokProduk = await produkModel.update(
//             {stokProduk: produk.stokProduk - kuantitas}, 
//             {where: {produkID: produk.produkID}})

//         const updCoinUser = await userModel.update(
//             {teknoCoin: a}, 
//             {where: {customerID: userData.customerID}})
        
//         let newTransaksi = {
//             tanggal: today,
//             jumlahHarga: harga,
//             pesan: request.body.pesan,
//             customerID: userData.customerID
//         }

//         const addedTransaksi = await transaksiModel.create(newTransaksi)
        
//         let newDetail = {
//             transaksiID: addedTransaksi.transaksiID,
//             keranjangID: produk.produkID
//         }

//         const addedDetail = await detailModel.create(newDetail)

//         return response.json({
//             success: true,
//             data: {
//                 transaksi: addedTransaksi,
//                 detail: addedDetail
//             }
//         })

//     } catch (error) {
//         return response.status(400).json({
//             success: false,
//             message: error.message
//         })
//     }
// }
