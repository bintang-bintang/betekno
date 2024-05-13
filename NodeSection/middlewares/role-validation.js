const userModel = require(`../models/index`).customer
const Op = require(`sequelize`).Op

exports.IsUser = async (request, response, next) => {
    const userData = request.customer
    const findUser = await userModel.findOne({
        where:
        {
            [Op.and]:
                [
                    { email: userData.email },
                    { customerID: userData.customerID }
                ]
        }
    })


    if (!findUser) {
        return response.status(401).json({
            success: false,
            auth: false,
            message: `Data user ghaib/Token tidak valid`
        })
    }

    console.log(request.customer.role)
    if (request.customer.role == "customer") {
        next();
    }
    else {
        return response.status(401).json({
            success: false,
            auth: false,
            message: `Forbidden! You are Not Customer`
        })
    }
}
exports.IsAdmin = async (request, response, next) => {
    const findUser = await userModel.findOne({ where: { email: request.customer.email } })

    if (!findUser) {
        return response.status(401).json({
            success: false,
            auth: false,
            message: `Data user ghaib/Token tidak valid`
        })
    }

    if (request.customer.role == "admin") {
        next();
    }
    else {
        return response.status(401).json({
            success: false,
            auth: false,
            message: `Forbidden! You are Not Admin`
        })
    }
}    