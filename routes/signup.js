var express = require('express');

var router = express.Router();

router.get('/', function (req, res, next) {
    res.render("signup");
});

router.post('/', function (req, res, next) {
    res.send(req.body);
});

router.put('/', function (req, res, next) {

});

module.exports = router;