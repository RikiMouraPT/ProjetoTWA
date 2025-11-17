const express = require('express');
const router =  express.Router();
const departmentController = require('../controllers/departmentController');
const { isAuthenticated, isManager } = require('../middlewares/auth');

router.get('/', isManager, departmentController.index);
router.get('/create', isManager, departmentController.create);
router.post('/', isManager, departmentController.store);
router.get('/:id', isAuthenticated, departmentController.show);
router.get('/:id/edit', isManager, departmentController.edit);
router.put('/:id', isManager, departmentController.update);
router.delete('/:id', isManager, departmentController.destroy);

module.exports = router;