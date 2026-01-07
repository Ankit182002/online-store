const router = require('express').Router();
const cartCtrl = require('../controllers/cart.controller');
const auth = require('../middleware/auth');

router.get('/', auth, cartCtrl.getCart);
router.post('/', auth, cartCtrl.addItem);
router.post('/remove', auth, cartCtrl.removeItem);
router.post('/clear', auth, cartCtrl.clearCart);

module.exports = router;