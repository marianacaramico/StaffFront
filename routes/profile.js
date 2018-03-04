var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('profile', {
        title: 'Staff - Perfil'
    });
});

router.post('/', function (req, res, next) {
    /* Definir um parâmetro para mostrar uma mensagem de sucesso / erro */
    res.render('profile', {
        title: 'Staff - Perfil'
    });
});

module.exports = router;