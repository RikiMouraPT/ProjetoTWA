const express = require('express');
const router =  express.Router();
const leaveTypeController = require('../controllers/leaveTypeController');

router.get('/', leaveTypeController.index);
router.post('/', leaveTypeController.store);
router.get('/create', leaveTypeController.create);
router.get('/:id', leaveTypeController.show);
router.get('/:id/edit', leaveTypeController.edit);
router.put('/:id', leaveTypeController.update);
router.delete('/:id', leaveTypeController.destroy);

module.exports = router;