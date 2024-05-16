const produkModel = require('../models/index').produk; // Sesuaikan dengan path model kamu
// const a = require(`node-schedule`)
const Op = require(`sequelize`).Op
/** load library 'path' and 'filestream' */
const path = require(`path`)
const fs = require(`fs`)
const produk = require("../models/produk")

exports.getAllProduk = async (request, response) => {
  /** call findAll() to get all data */
  let produks = await produkModel.findAll()
  return response.json({
    success: true,
    data: produks,
    message: `All Produks have been loaded`
  })
}


exports.findProduk = async (request, response) => {
  /** define keyword to find data */
  let key = request.params.key
  /** call findAll() within where clause and operation
  * to find data based on keyword */
 try {
  let produks = await produkModel.findAll({
    where: {
      [Op.or]: [
        { namaProduk: { [Op.substring]: key } },
        { hargaProduk: { [Op.substring]: key } },
        { stokProduk: { [Op.substring]: key } },
        { deskripsiProduk: { [Op.substring]: key } }
      ]
    }
  })
  return response.json({
    success: true,
    data: produks,
    message: `All Produks have been loaded`
  })
 } catch (error) {
  return response.json({
    success: false,
    message: error.message
  })
 }
  
}

const upload = require(`./upload-image`).single('image')
exports.addProduk = (request, response) => {
  /** run function upload */
  upload(request, response, async error => {
    /** check if there are error when upload */
    if (error) {
      return response.json({ message: error })
    }
    /** check if file is empty */
    // if (!request.file) {
    //     return response.json({ message: `Nothing to Upload` })
    // }
    /** prepare data from request */
    let newProduk = {
      namaProduk: request.body.namaProduk,
      hargaProduk: request.body.hargaProduk,
      stokProduk: request.body.stokProduk,
      deskripsiProduk: request.body.deskripsiProduk,
      image: null
    }
    if (request.file) {
      newProduk.image = request.file.filename
    }

    produkModel.create(newProduk)
      .then(result => {
        /** if insert's process success */
        return response.json({
          success: true,
          data: result,
          message: `New produk has been added`
        })
      })
      .catch(error => {
        /** if insert's process fail */
        return response.json({
          success: false,
          message: error.message
        })
      })
  })
}

exports.updateProduk = async (request, response) => {
  /** run upload function */
  upload(request, response, async error => {
    /** check if there are error when upload */
    if (error) {
      return response.json({ message: error })
    }
    /** store selected produk ID that will update */
    let produkID = request.params.id
    const selectedProduk = await produkModel.findOne({
      where: { produkID: produkID }
    })
    /** prepare produk's data that will update */
    let dataProduk = {
      namaProduk: request.body.namaProduk,
      hargaProduk: request.body.hargaProduk,
      stokProduk: request.body.stokProduk,
      deskripsi_produk: request.body.deskripsi_produk,
    }
    /** check if file is not empty,
    * it means update data within reupload file
    */
    if (request.file) {
      /** get old filename of image file */
      const oldImage = selectedProduk.image
      /** prepare path of old image to delete file */
      const pathImage = path.join(__dirname, `../image`, oldImage)
      /** check file existence */
      if (fs.existsSync(pathImage)) {
        /** delete old image file */
        fs.unlink(pathImage, error => console.log(error))
      }
      /** add new image filename to produk object */
      dataProduk.image = request.file.filename
    }
    /** execute update data based on defined id produk */
    produkModel.update(dataProduk, {
      where: {
        produkID: produkID
      }
    })
      .then(result => {
        /** if update's process success */
        return response.json({
          success: true,
          message: `Data produk has been updated`
        })
      })
      .catch(error => {
        /** if update's process fail */
        return response.json({
          success: false,
          message: error.message
        })
      })
  })
}

exports.deleteProduk = async (request, response) => {
  /** store selected produk's ID that will be delete */
  const produkID = request.params.id
  /** -- delete image file -- */
  /** get selected produk's data */
  const selectedProduk = await produkModel.findOne({
    where: { produkID: produkID }
  })
  /** get old filename of image file */
  const oldImage = selectedProduk.image
  /** prepare path of old image to delete file */
  const pathImage = path.join(__dirname, `../image`, oldImage)
  /** check file existence */
  if (fs.existsSync(pathImage)) {
    /** delete old image file */
    fs.unlink(pathImage, error => console.log(error))
  }
  /** -- end of delete image file -- */
  /** execute delete data based on defined id produk */
  produkModel.destroy({ where: { produkID: produkID } })
    .then(result => {
      /** if update's process success */
      return response.json({
        success: true,
        message: `Data produk has been deleted`
      })
    })
    .catch(error => {
      /** if update's process fail */
      return response.json({
        success: false,
        message: error.message
      })
    })
}