var express = require('express');
var router = express.Router();
const db = require('../db/index')

/* GET users listing. */
router.get('/', function(req, res, next) {
  const top = db.get('questions')
                .sortBy('points')
                .reverse()
                .take(3)
                .value()

  res.render("agenda", { title: "discussion agenda", top });
});

module.exports = router;
