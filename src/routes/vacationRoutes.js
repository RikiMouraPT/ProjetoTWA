const express = require('express');
const router =  express.Router();
const vacationController = require('../controllers/vacationController');
const { isAuthenticated, isManager } = require('../middlewares/auth');

router.get('/', isManager, vacationController.index);
router.get('/byUser/:userId', isAuthenticated, vacationController.indexByUser);
router.post('/', isAuthenticated, vacationController.store);
router.get('/create', isAuthenticated, vacationController.create);
router.get('/:id', isAuthenticated, vacationController.show);
router.put('/:id/accept', isManager, vacationController.accept);
router.put('/:id/reject', isManager, vacationController.reject);
router.delete('/:id', isAuthenticated, vacationController.destroy);

module.exports = router;