const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const process = require('process');
const { Op } = require("sequelize");
const {user} = require("../models");
const Joi = require('joi');

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

async function login(req, res, next) {
  let success = false
  let token=null
  let tokenData=null
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  })
  const validate = schema.validate(req.body)
  if(!validate.error){
    const data = await user.findOne({
      where: {
        [Op.or]: [
          { nip: validate.value.username },
		      { username: validate.value.username }
        ],
        [Op.and]: [
          { deleted: 0 }
        ]
      }
    });
  
    if(data){
      if(bcrypt.compareSync(validate.value.password, data.password)){
        let now = new Date();
        tokenData = {
          iat: Math.floor(now.getTime() / 1000),
          // exp: Math.floor(now.addDays(1).getTime() / 1000),
          user_id: data.user_id,
          username: data.username,
          name: data.name,
          nip: data.nip,
          role: data.role,
        }
      token = jwt.sign(tokenData, process.env.SECRET_KEY,{ expiresIn: '24h' });
      }
    }
    if(token)success=true
    
  }else{
    console.log(validate.error)
  }  
  res.json({ success:success,accessToken: token, data:tokenData });
}

function register(req, res, next) {
  res.json({ user: 'register' });
}

module.exports = { 
  login,
  register,
};