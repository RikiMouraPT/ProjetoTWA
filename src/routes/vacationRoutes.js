const express = require('express');
const router =  express.Router();
const vacationController = require('../controllers/vacationController');
const { isAuthenticated, isManager } = require('../middlewares/auth');

router.get('/', isManager, vacationController.index);
router.get('/create', isAuthenticated, vacationController.create);
router.post('/', isAuthenticated, vacationController.store);
router.get('/:id', isAuthenticated, vacationController.show);
router.get('/:id/edit', isAuthenticated, vacationController.edit);
router.put('/:id', isAuthenticated, vacationController.update);
router.delete('/:id', isAuthenticated, vacationController.destroy);

router.get('/byUser/:userId', isAuthenticated, vacationController.indexByUser);
router.put('/:id/accept', isManager, vacationController.accept);
router.put('/:id/reject', isManager, vacationController.reject);

module.exports = router;