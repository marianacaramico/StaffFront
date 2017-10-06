var express = require('express');

var router = express.Router();

/* GET USER*/
router.get('/:id', function (req, res, next) {
    var pedro = {
        "id_user": 1,
        "name": "Pedro Padilha",
        "username": "pedropadilha13",
        "password": "Teste1234"
    };

    var mateus = {
        "id_user": 2,
        "name": "Mateus Larrubia",
        "username": "mateuslarrubia987",
        "password": "T3st3lalala"
    };

    var id = req.params.id;
    var result;

    switch (id) {
        case "1":
            result = pedro;
            break;
        case "2":
            result = mateus;
            break;
        default:
            res.status(404);
            break;
    }

    res.send(result);
});

module.exports = router;