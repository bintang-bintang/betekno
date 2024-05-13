const midOne = async (req, res, next) => {
    console.log('Run Middleware One');
    next();
};

module.exports = {midOne};
