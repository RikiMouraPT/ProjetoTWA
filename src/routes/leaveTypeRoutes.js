const express = require('express');
const router =  express.Router();
const leaveTypeRoutes = require('../controllers/leaveTypeController');

router.get('/', leaveTypeRoutes.index);
router.post('/', leaveTypeRoutes.store);
router.get('/create', leaveTypeRoutes.create);
router.get('/:id', leaveTypeRoutes.show);
router.get('/:id/edit', leaveTypeRoutes.edit);
router.put('/:id', leaveTypeRoutes.update);
router.delete('/:id', leaveTypeRoutes.destroy);

module.exports = router;