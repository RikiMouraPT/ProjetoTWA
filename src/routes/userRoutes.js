const express = require('express');
const router =  express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated, isManager } = require('../middlewares/auth');

router.get('/', isManager, userController.index);
router.get('/create', isManager, userController.create);
router.post('/', isManager, userController.store);
router.get('/:id', isAuthenticated, userController.show);
router.get('/:id/edit', isAuthenticated, userController.edit);
router.put('/:id', isAuthenticated, userController.update);
router.delete('/:id', isAuthenticated, userController.destroy);

module.exports = router;