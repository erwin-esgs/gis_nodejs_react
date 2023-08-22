const express = require('express');
let router = express.Router();
const  { 
  create,
  read,
  detail,
  update,
  remove,
  removeBatch,
} = require('../controllers/user.controller')

router.get('/', read);
router.get('/:id', detail);
router.post('/delete', removeBatch);
router.post('/', create);
router.patch('/:id', update);
router.delete('/:id', remove);

module.exports = router;
