const express = require('express');
const router =  express.Router();
const vacationController = require('../controllers/vacationController');

router.get('/', vacationController.index);
router.post('/', vacationController.store);
router.get('/create', vacationController.create);
router.get('/:id', vacationController.show);
router.put('/:id/accept', vacationController.accept);
router.put('/:id/reject', vacationController.reject);
router.delete('/:id', vacationController.destroy);


module.exports = router;