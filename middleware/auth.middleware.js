const jwt = require('jsonwebtoken');

function verifyToken (req, res, next) {
    // console.log(req.get('authorization'))
    const token = req.get('authorization')?.split(' ')[1]
    if(token){
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY)
            return next() 
        } catch (error) {
        }
    }
    return res.status(401).json({ status:false,message: 'Unauthorized' });
}

module.exports = {verifyToken};