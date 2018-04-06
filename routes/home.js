var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.session.userid) {
        res.render('home', {
            title: 'Área logada - Staff'
        });
    } else {
        var m = req.app.get('env') !== 'development' ? "https://" : "http://";
        res.redirect(m + req.headers.host + "/login");
    }
});

module.exports = router;