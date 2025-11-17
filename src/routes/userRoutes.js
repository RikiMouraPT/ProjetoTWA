const express = require('express');
const router =  express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated, isManager } = require('../middlewares/auth');

router.get('/', userController.index);
router.get('/create', userController.create);
router.post('/', userController.store);
router.get('/:id', userController.show);
router.get('/:id/edit', userController.edit);
router.put('/:id', userController.update);
router.delete('/:id', userController.destroy);

module.exports = router;