var express = require('express');

var router = express.Router();

router.get('/', function (req, res, next) {
    res.render("signup", {
        title: 'Cadastre-se para utilizar o Staff'
    });
});

router.post('/', function (req, res, next) {
    res.json({ error: "Function not implemented" });
});

router.put('/', function (req, res, next) {
    res.json({ error: "Function not implemented" });
});

module.exports = router;