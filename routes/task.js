var express = require('express');

var router = express.Router();

/* GET Task */
router.get('/', function (req, res, next) {
    var result = '';
    result = '{	"count": 2,	"tasks": [{ "id_task": 1, "id_task_type": 1, "id_user_owner": 1, "title": "entregar um documento no centro de sao paulo", "description": "entregar um documento na rua sao bento, 10, ate as 14h de hoje", "creation_date": "2017-09-15 20:43:00", "due_date": "2017-09-15 21:43:00", "value": 150.90, "status": "open" }, { "id_task": 2, "id_task_type": 2, "id_user_owner": 2, "title": "bolo de chocolate para uma festa", "description": "fazer um bolo de chocolate e entregar dia 16 ao meio dia na rua haddock lobo, 595", "creation_date": "2017-09-15 20:43:00", "due_date": "2017-09-15 21:43:00", "value": 200, "status": "open" }]}';

    res.send(result);
});

router.get('/:id', function (req, res, next) {
    var result = '';
    result = '{ "id_task": 1, "id_task_type": 1, "id_user_owner": 1, "title": "entregar um documento no centro de sao paulo", "description": "entregar um documento na rua sao bento, 10, ate as 14h de hoje", "creation_date": "2017-09-15 20:43:00", "due_date": "2017-09-15 21:43:00", "value": 150.90, "status": "open" }';

    res.send(result);
});

module.exports = router;