(function() {
  window.addEventListener("DOMContentLoaded", () => {
    ///////////////////////////////////////////////////////
    // listen to the new question form submission
    ///////////////////////////////////////////////////////
    const form = document.querySelector("form");
    const question = document.querySelector("input[name='question']");

    if (form) {
      form.addEventListener("submit", e => {
        e.preventDefault();
        axios
          .post("/", { question: question.value })
          .then(res => {
            confirmQuestionAdded(res, question);
            addQuestionToList(res);
          })
          .catch(e => console.log(e));
      });
    }

    ///////////////////////////////////////////////////////
    // listen to voting buttons on question cards
    ///////////////////////////////////////////////////////
    const questions = document.querySelector(".question.cards");

    if (questions) {
      questions.addEventListener("click", e => {
        let [up, down] = [isVote(e.target, "up"), isVote(e.target, "down")];
        // console.log(up, down)
        if (up || down) {
          let { cardId } = e.target.closest(".card").dataset;

          axios.put("/vote", { qid: cardId, points: up ? 1 : -1 }).then(res => {
            updateVotes(cardId, res.data.points);
            console.log(`card [${cardId}] voted ${up ? "up" : "down"}`);
          });
        }
      });
    }

    ///////////////////////////////////////////////////////
    // listen to done button on agenda cards
    ///////////////////////////////////////////////////////
    const agenda = document.querySelector(".agenda.cards");

    if (agenda) {
      agenda.addEventListener("click", e => {
        if (isDone(e.target)) {
          let { cardId } = e.target.closest(".card").dataset;
          console.log(`card ${cardId} is done!`);
        }
      });
    }
  });

  ///////////////////////////////////////////////////////
  // helper functions
  ///////////////////////////////////////////////////////

  function isDone(element) {
    return element.classList.contains("check");
  }

  function isVote(element, type) {
    return element.classList.contains(type);
  }

  function updateVotes(id, votes) {
    document.querySelector(
      `div[data-card-id=${id}] div.label`
    ).innerText = votes;
  }

  function confirmQuestionAdded(res, question) {
    question.value = "";
    question.placeholder = "";
    console.log(`question with id [${res.data.id}] added`);
  }

  function addQuestionToList(res) {
    const cards = document.querySelector(".question.cards");
    const source = document.querySelector("#question-template").innerHTML;
    Handlebars.registerHelper("formatDate", function(date) {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      };
      return new Date(date).toLocaleDateString("en-US", options);
    });
    const template = Handlebars.compile(source);
    cards.insertAdjacentHTML("afterbegin", template(res.data));
  }
})();
