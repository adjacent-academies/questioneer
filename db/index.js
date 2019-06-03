const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({
  questions: [],
  count: 0,
  template: {
    id: "0",
    text: "",
    timestamp: "",
    points: 0,
    answered: false
  }
}).write();

module.exports = db;
