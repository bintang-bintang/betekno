const md5 = require(`md5`)
const jwt = require(`jsonwebtoken`)
const userModel = require(`../models/index`).customer
const secret = `mokleters`

const authenticate = async (request, response) => {
    let dataLogin = {
        email: request.body.email,
        password: md5(request.body.password)
    }
    /** check data username and password on user's table */
    let dataUser = await userModel.findOne({
        where: dataLogin
    })
    /** if data user exists */
    if (dataUser) {
        /** set payload for generate token.
        * payload is must be string.
        * dataUser is object, so we must convert to string.
        */
        let payload = JSON.stringify(dataUser)
        console.log(payload)
        /** generate token */
        let token = jwt.sign(payload, secret)
        /** define response */
        return response.json({
            success: true,
            logged: true,
            message: `Authentication Success`,
            token: token,
            data: dataUser
        })
    }
    /** if data user is not exists */
    return response.json({
        success: false,
        logged: false,
        message: `Authentication Failed. Invalid username or password`
    })
}


const authorize = (request, response, next) => {
    /** get "Authorization" value from request's header */
    const authHeader = request.headers.authorization;
    /** check nullable header */
    try {
        if (authHeader) {
            /** when using Bearer Token for authorization,
            * we have to split `headers` to get token key.
            * valus of headers = `Bearers tokenKey`
            */
            const token = authHeader.split(' ')[1];
            /** verify token using jwt */
            let verifiedUser = jwt.verify(token, secret);
            if (!verifiedUser) {
                return response.json({
                    success: false,
                    auth: false,
                    message: `Invalid Token or No Token`
                })
            }
            request.customer = verifiedUser; // payload
            /** if there is no problem, go on to controller */
            next();
        } else {
            return response.json({
                success: false,
                auth: false,
                message: `User Unauthorized`
            })
        }
    } catch (error) {
        return response.json({
            success: false,
            auth: false,
            message: error.message
        })
    }
    
}

module.exports = { authenticate, authorize }