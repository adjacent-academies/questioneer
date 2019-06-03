const shortid = require("shortid");
const express = require("express");
const router = express.Router();
const db = require("../db/index");

router.get("/", (req, res, next) => {
  const questions = db.get("questions").sortBy('timestamp').reverse().value();
  res.render("index", { title: "ask and vote", questions });
});

router.post("/", (req, res, next) => {
  const template = db
    .get("template")
    .cloneDeep()        // https://github.com/typicode/lowdb#how-to-query
    .value();

  const question = Object.assign(template, {
    id: shortid.generate(),
    timestamp: new Date(),
    text: req.body.question
  });

  db.get("questions")
    .push(question)
    .write();

  db.update("count", n => n + 1).write();

  res.send(question);
});

router.put("/vote", (req, res, next) => {
  console.log(`voting ${req.body.qid} by [${req.body.points}]`)

  const question = db
    .get("questions")
    .find({ id: req.body.qid })
    .update("points", n => n + req.body.points)
    .write();

  res.send(question)
});

module.exports = router;
