var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/erro-login', function (req, res, next) {
    res.render('erro-login');
});

module.exports = router;