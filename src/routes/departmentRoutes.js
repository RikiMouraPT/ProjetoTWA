const express = require('express');
const router =  express.Router();
const departmentController = require('../controllers/departmentController');

router.get('/', departmentController.index);
router.get('/create', departmentController.create);
router.post('/', departmentController.store);
router.get('/:id', departmentController.show);
router.get('/:id/edit', departmentController.edit);
router.put('/:id', departmentController.update);
router.delete('/:id', departmentController.destroy);

module.exports = router;