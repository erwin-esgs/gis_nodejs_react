const express = require('express');
let router = express.Router();
const  { 
  checkES,
  getData,
} = require('../controllers/elastic.controller')

router.get('/', checkES);
router.post('/', getData);
// router.post('/register', register);

module.exports = router;
