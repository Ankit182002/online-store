const router = require('express').Router();
const productCtrl = require('../controllers/product.controller');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.get('/', productCtrl.listProducts);
router.get('/:id', productCtrl.getProduct);
router.post('/', auth, isAdmin, productCtrl.createProduct);
router.put('/:id', auth, isAdmin, productCtrl.updateProduct);
router.delete('/:id', auth, isAdmin, productCtrl.deleteProduct);

module.exports = router;