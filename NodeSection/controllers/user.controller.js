/** load model for `users` table */
const { validationResult, body } = require(`express-validator`);
const userModel = require(`../models/index`).customer
const md5 = require(`md5`)

/** load Operation from Sequelize */
const Op = require(`sequelize`).Op

/** create function for read all data */
exports.getAllUser = async (request, response) => {
    /** call findAll() to get all data */
    let users = await userModel.findAll()
    return response.json({
        success: true,
        data: users,
        message: `All users have been loaded`
    })
}

/** create function for filter */
exports.findUser = async (request, response) => {
    /** define keyword to find data */
    let keyword = request.params.key
    /** call findAll() within where clause and operation
    * to find data based on keyword */

    let users = await userModel.findAll({
        where: {
            [Op.or]: [
                { customerID: { [Op.substring]: keyword } },
                { nama: { [Op.substring]: keyword } },
                { alamat: { [Op.substring]: keyword } },
                { email: { [Op.substring]: keyword } },
                { role: { [Op.substring]: keyword } }
            ]
        }
    })
        .then(result => {
            /** if insert's process success */
            return response.json({
                success: true,
                data: result,
                message: `User has been updated!`
            })
        })
        .catch(error => {
            /** if insert's process fail */
            return response.status(400).json({
                success: false,
                message: error.message
            })
        })

}

/** create function for add new user */
exports.addUser = (request, response) => {
    /** prepare data from request */
    let newUser = {
        nama: request.body.nama,
        password: md5(request.body.password),
        email: request.body.email,
        alamat: request.body.alamat,
        teknoCoin: request.body.teknoCoin,
        role: request.body.role
    }
    /** execute inserting data to user's table */
    userModel.create(newUser)
        .then(result => {
            /** if insert's process success */
            return response.json({
                success: true,
                data: result,
                message: `New user has been inserted`
            })
        })
        .catch(error => {
            /** if insert's process fail */
            return response.json({
                success: false,
                message: error.message
            })
        })
}

/** create function for update user */
exports.updateUserAdmin = async (request, response) => {
    try {
        // Jalankan setiap validasi dan tunggu hasilnya
        await Promise.all(
            [
                body('nama').notEmpty().withMessage('Nama tidak boleh kosong'),
                body('alamat').notEmpty().withMessage('Alamat tidak boleh kosong'),
                body('email').notEmpty().withMessage('Email tidak boleh kosong').isEmail().withMessage('Format email tidak valid')
            ].map(validation => validation.run(request))
        );

        // Tangkap kesalahan validasi jika ada
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json(
                {
                    success: false,
                    errors: errors.array()
                });
        }

        // Persiapkan data yang telah diubah
        let dataUser = {
            nama: request.body.nama,
            email: request.body.email,
            alamat: request.body.alamat,
            teknoCoin: request.body.teknoCoin,
            role: request.body.role
        };
        // Jika password disertakan dalam permintaan, hash password baru
        if (request.body.password) {
            dataUser.password = md5(request.body.password);
        }
        // Tentukan ID pengguna yang akan diperbarui
        let userID = request.params.id;

        // Eksekusi pembaruan data berdasarkan ID pengguna yang ditentukan
        const result = await userModel.update(dataUser, { where: { customerID: userID } });

        // Jika proses pembaruan berhasil
        return response.json({
            success: true,
            data: dataUser,
            message: `Data pengguna telah diperbarui`
        });
    } catch (error) {
        // Jika terjadi kesalahan dalam proses validasi atau pembaruan
        console.error('Error in updating user:', error);
        return response.status(500).json(
            {
                success: false,
                message: 'Internal server error'
            });
    }
};
exports.updateUserCustomer = async (request, response) => {
    try {
        // Jalankan setiap validasi dan tunggu hasilnya
        await Promise.all(
            [
                body('nama').notEmpty().withMessage('Nama tidak boleh kosong'),
                body('alamat').notEmpty().withMessage('Alamat tidak boleh kosong'),
                body('email').notEmpty().withMessage('Email tidak boleh kosong').isEmail().withMessage('Format email tidak valid')
            ].map(validation => validation.run(request))
        );

        // Tangkap kesalahan validasi jika ada
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json(
                {
                    success: false,
                    errors: errors.array()
                });
        }

        // Persiapkan data yang telah diubah
        let dataUser = {
            nama: request.body.nama,
            alamat: request.body.alamat,
            email: request.body.email,
        };
        // Jika password disertakan dalam permintaan, hash password baru
        if (request.body.password) {
            dataUser.password = md5(request.body.password);
        }
        // Tentukan ID pengguna yang akan diperbarui
        let userID = request.params.id;

        // Eksekusi pembaruan data berdasarkan ID pengguna yang ditentukan
        const result = await userModel.update(dataUser, { where: { customerID: userID } });

        // Jika proses pembaruan berhasil
        return response.json({
            success: true,
            data: dataUser,
            message: `Data pengguna telah diperbarui`
        });
    } catch (error) {
        // Jika terjadi kesalahan dalam proses validasi atau pembaruan
        console.error('Error in updating user:', error);
        return response.status(500).json(
            {
                success: false,
                message: 'Internal server error'
            });
    }
};

/** create function for delete data */
exports.deleteUser = (request, response) => {
    /** define id user that will be update */
    let userID = request.params.id
    /** execute delete data based on defined id user */
    userModel.destroy({ where: { userID: userID } })
        .then(result => {
            /** if update's process success */
            return response.json(
                {
                    success: true,
                    message: `Data user has been deleted`
                })
        })
        .catch(error => {
            /** if update's process fail */
            return response.json(
                {
                    success: false,
                    message: error.message
                })
        })
}

exports.register = async (request, response) => {

    let inputEmail = request.body.email
    let newUser =
    {
        nama: request.body.nama,
        email: inputEmail,
        password: md5(request.body.password),
        alamat: request.body.alamat,
        teknoCoin: 0,
        role: "customer"
    }

    const existingEmail = await userModel.findOne({ where: { email: inputEmail } })
    if (existingEmail) {
        return response.json(
            {
                success: false,
                message: 'Email \'' + inputEmail + '\' already exists'
            });
    }

    /** execute inserting data to user's table */
    userModel.create(newUser).then(result => {
        /** if insert's process success */
        return response.json({
            success: true,
            data: result,
            message: `New user has been inserted`
        })
    })
        .catch(error => {
            /** if insert's process fail */
            return response.json({
                success: false,
                // message: error.message
            })
        })
}

/** create function for reset password */
exports.resetPwd = async (request, response) => {
    /** define id user for whom the password will be reset */
    let userID = request.params.id;

    /** prepare data from request */
    let oldPassword = md5(request.body.oldPassword);
    let newPassword = md5(request.body.newPassword);

    try {
        /** check if the old password matches the existing password */
        const user = await userModel.findOne({
            where: { userID: userID, password: oldPassword },
        });

        if (!user) {
            return response.json({
                success: false,
                message: "Old password is incorrect. Password reset failed.",
            });
        }

        /** update the password with the new password */
        await userModel.update(
            { password: newPassword },
            {
                where: { userID: userID }
            }
        );

        return response.json({
            success: true,
            message: "Password has been successfully reset.",
        });
    } catch (error) {
        return response.json({
            success: false,
            message: error.message,
        });
    }
};
