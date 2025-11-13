const express = require('express');
const router =  express.Router();
const departmentRoutes = require('../controllers/departmentController');

router.get('/', departmentRoutes.index);
router.get('/create', departmentRoutes.create);
router.post('/', departmentRoutes.store);
router.get('/:id', departmentRoutes.show);
router.get('/:id/edit', departmentRoutes.edit);
router.put('/:id', departmentRoutes.update);
router.delete('/:id', departmentRoutes.destroy);

module.exports = router;