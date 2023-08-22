const { Op } = require("sequelize");
const {user} = require("../models");
const Joi = require('joi');
const process = require('process');
const bcrypt = require('bcrypt');

const modelClass = user;

async function create(req, res, next) {
  let data;
  let success = false;
  try {
    const schema = Joi.object({
      nip: Joi.string().alphanum().required(),
      name: Joi.string().required(),
      username: Joi.string().required(),
      password: Joi.string().required(),
      role: Joi.string().not("").optional(),
    })
    const validate = schema.validate(req.body)
    if(!validate.error){
      validate.value.password = bcrypt.hashSync(validate.value.password, bcrypt.genSaltSync( parseInt(process.env.SALT , 10) ));
      validate.value.deleted = 0
      validate.value.last_login = 0
      data = await modelClass.create(validate.value);
      delete data["password"];
      success = true
    }else{
      console.log(JSON.stringify(validate.error))
    } 
  } catch (error) {
    console.log(error)
  }
  res.json({ success:success,data:data});  
}

async function read(req, res, next) {
  let data;
  let success = false;
  try {
    data = await modelClass.findAll({
      raw:true,
      attributes: ['user_id', 'nip', 'name', 'username', 'role', 'last_login', 'createdAt', 'updatedAt'],
      where:{ [Op.and]: [
        {deleted: 0 },
      ]},
    });
    success = true
  } catch (error) {
    console.log(error)
  }
  res.json({ success:success,data:data});
}

async function detail(req, res, next) {
  let data;
  let success = false;
  try {
    let id = req.params['id']
    const schema = Joi.object({
      id: Joi.number().integer().required(),
    })
    const validate = schema.validate({id}) 
    if(!validate.error){
      data = await modelClass.findOne({
        // raw:true, 
        attributes: ['user_id', 'nip', 'name', 'username', 'role', 'last_login', 'createdAt', 'updatedAt'],
        where:{ [Op.and]: [
          {user_id: validate.value.id },
          {deleted: 0 },
        ]},
      })
      success = true
    }else{
      console.log(validate.error)
    }  
  } catch (error) {
    console.log(error)
  }
  res.json({ success:success,data:data});
}

async function update(req, res, next) {
  let data;
  let success = false;
  try {
    const schema = Joi.object({
      id: Joi.number().integer().required(),
      nip: Joi.string().alphanum(),
      name: Joi.string(),
      username: Joi.string(),
      password: Joi.string().allow(''),
      role: Joi.string().not(""),
    })
    req.body.id = req.params['id'];
    const validate = schema.validate(req.body)
    if(!validate.error){
      console.log(JSON.stringify(validate.value))
      data = Object.fromEntries(Object.entries(validate.value).filter(([_, v]) => v != null && v != ""));
      console.log(data)
      if(data.password){
        if(data.password != ""){
        data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync( parseInt(process.env.SALT , 10) ));
        }
      }
      success = await modelClass.update(data, {
        where: { [Op.and]: [
          {user_id: validate.value.id },
          {deleted: 0 },
        ]},
        returning: true,
        plain: true
      });
    }else{
      console.log(validate.error)
    }
  } catch (error) {
    console.log(error)
  }
  res.json({ success:success,data:data});
}

async function remove(req, res, next) {
  let data;
  let success = false;
  try {
    const schema = Joi.object({
      id: Joi.number().integer().required(),
    })
    //const validate = schema.validate(req.body)
    let id = req.params['id']
    const validate = schema.validate({id})
    if(!validate.error){
      data = await modelClass.update({deleted:1}, {
          where: { [Op.and]: [
            {user_id: validate.value.id },
            {deleted: 0 },
          ]}
        });
      success = true
    }else{
      console.log(validate.error)
    }
  } catch (error) {
    console.log(error)
  }
  res.json({ success:success,data:data});
}

async function removeBatch(req, res, next) {
  let data;
  let success = false;
  try {
    const schema = Joi.object({
      id: Joi.array().items(Joi.number().required()).required()
    })
    //const validate = schema.validate(req.body)
    let id = req.body.id
    const validate = schema.validate({id})
    if(!validate.error){
      data = await modelClass.update({deleted:1}, {
          where: { [Op.and]: [
            {user_id: {
              [Op.in] : id
            }},
            {deleted: 0 },
          ]}
        });
      success = true
    }else{
      console.log(validate.error)
    }
  } catch (error) {
    console.log(error)
  }
  res.json({ success:success,data:data});
}

module.exports = { 
  create,
  read,
  detail,
  update,
  remove,
  removeBatch,
};