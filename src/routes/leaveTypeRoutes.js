const express = require('express');
const router =  express.Router();
const leaveTypeController = require('../controllers/leaveTypeController');
const { isManager } = require('../middlewares/auth');

router.get('/', isManager, leaveTypeController.index);
router.post('/', isManager, leaveTypeController.store);
router.get('/create', isManager, leaveTypeController.create);
router.get('/:id', isManager, leaveTypeController.show);
router.get('/:id/edit', isManager, leaveTypeController.edit);
router.put('/:id', isManager, leaveTypeController.update);
router.delete('/:id', isManager, leaveTypeController.destroy);

module.exports = router;