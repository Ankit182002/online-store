const router = require('express').Router();
const orderCtrl = require('../controllers/order.controller');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.post('/create', auth, orderCtrl.createOrder); 
router.post('/confirm', auth, orderCtrl.confirmPayment);
router.get('/me', auth, orderCtrl.getOrdersForUser);
router.get('/', auth, isAdmin, orderCtrl.getAllOrders);
router.put('/:id/status', auth, isAdmin, orderCtrl.updateOrderStatus);
router.delete('/:id', auth, orderCtrl.deleteOrder);

module.exports = router;