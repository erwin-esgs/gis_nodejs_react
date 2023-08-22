const jwt = require('jsonwebtoken');

function verifyAdmin (req, res, next) {
    const token = req.get('authorization')?.split(' ')[1]
    if(token){
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY)
            if(decoded.role == 0)return next() 
        } catch (error) {
        }
    }
    return res.status(401).json({ status:false,message: 'Unauthorized' });
}

module.exports = {verifyAdmin};