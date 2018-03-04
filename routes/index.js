var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Staff - Uma nova maneira de recrutar seu staff'
    });
});

module.exports = router;