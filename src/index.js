import "./styles.css";

document.getElementById("app").innerHTML = `
  <h1>Mundane Debates</h1>
  <div>
    This is a single elimination tournament in which players will be randomly
    assigned a debate partner and a mundane topic. Each player will have 30
    seconds to make their case, then the team will vote on who won.
  </div></br>
  <form id="form-player-names">
    <label for="input-player-names">Player names (comma separated)</label>
    <input
      type="textarea"
      id="input-player-names"
      name="input-player-names"
    /></br>
    <span id="validation-error"></span></br>
    <button type="submit">Start</button>
  </form>`;

let topics = shuffle([
  "Toe ring",
  "Bedpan",
  "Medium thread-count sheets",
  "Thumbs",
  "Banana peel",
  "Triangles",
  "Orthopedic slippers",
  "Fire hydrant",
  "Bath robe",
  "Squeegee",
  "Country music",
  "Station wagon",
  "The color beige",
  "Curtains",
  "Free pamphlet",
  "Slightly smiling emoji",
  "Revolving door",
  "Escalator",
  "Corn",
  "Nebraska",
  "Carpet",
  "Bud light",
  "A stick",
  "American cheese",
  "Text edit",
  "Microsoft Teams",
  "A wall socket",
  "A wide brimmed hat",
  "A rolling suitcase",
  "A smart refrigerator",
  "Spreadsheets",
  "Fur",
  "Gray hair",
  "Toilet paper",
  "Nostrils",
  "Stripes",
  "Stripe",
  "A Hawaiian shirt",
  "Whispering",
  "Leftovers",
  "Kool Aid",
  "Stretch limo",
  "A single grain of rice",
  "A plateau",
  "String",
  "The regular flu",
  "Club soda",
  "Wheel of fortune",
  "The Bay Area",
  "Texas",
  "Life on Mars",
  "Louis Vuitton",
  "Water chestnuts",
  "Cardboard",
  "Internet explorer",
  "Tetris",
  "When someone writes their name in wet concrete",
  "Airplane food",
  "Cracking knuckles",
  "A flip phone",
  "Facebook",
  "Tic tac toe",
  "McDonald’s",
  "Cheezits",
  "A surgical mask",
  "A balloon not filled with helium",
  "Delaware",
  "A car dealership",
  "Student loans",
  "Gibberish",
  "A hairless cat",
  "The last sip of coffee",
  "An electric stove",
  "A turn signal",
  "One headlight",
  "A sale on edible arrangements",
  "Cauliflower pizza dough"
]);

const stringToArray = (names) => {
  let namesArr = names
    .replace(/\s+/g, "")
    .split(",")
    .map((name) => name.charAt(0).toUpperCase() + name.slice(1));
  return namesArr;
};

const assignPairs = (players) => {
  let pairs = [];

  while (players.length > 0) {
    if (players.length === 1) {
      pairs.push([players.pop(), "bye"]);
    } else {
      pairs.push(players.splice(0, 2));
    }
  }
  console.log("pairs", pairs.join(","));
  return pairs;
};

function shuffle(arr) {
  return arr.sort(() => 0.5 - Math.random());
}

const assignTopics = (pairs) => {
  let assignedTopics = [];

  pairs
    .filter((pair) => {
      return pair[1] !== "bye";
    })
    .forEach((pair) => {
      assignedTopics.push([
        { name: pair[0], topic: topics.splice(0, 1)[0] },
        { name: pair[1], topic: topics.splice(0, 1)[0] }
      ]);
    });

  return assignedTopics;
};

const showPairsForRound = (pairs, round) => {
  document.getElementById("app").innerHTML = `
    <h1>Round ${round}</h1>
    <ul>
      ${pairs.map((pair) => `<li> ${pair[0]} vs ${pair[1]} </li>`).join("")}
    </ul>
    <button id="play">Play</button>
  `;
};

const showPairWithTopics = (pairsWithTopics) => {
  const pair = pairsWithTopics.pop();
  document.getElementById("app").innerHTML = `
    <h1>${pair[0].name}: ${pair[0].topic}</h1>
    <h2>VS</h2>
    <h1>${pair[1].name}: ${pair[1].topic}</h1>
    <div><span id="time"></span></div><button id="start-timer">Start Timer</button></br></br>
    <form id="winner-form">
      <label for="winner-name">Who won?</label>
        <label>
          <input
            type="radio"
            id="radio-winner"
            name="radio-winner"
            value="${pair[0].name}"
            />
            ${pair[0].name}
        </label>
        <label>
          <input
            type="radio"
            id="radio-winner"
            name="radio-winner"
            value="${pair[1].name}"
            />
            ${pair[1].name}
         </label>
      <button type="submit">Submit winner</button>
    </form>
  `;
  const startTimerBtn = document.getElementById("start-timer");

  startTimerBtn.addEventListener("click", (event) => {
    setTimer(30);
  });

  const winnerForm = document.getElementById("winner-form");

  winnerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    selectWinner();
    if (pairsWithTopics.length === 0 && players.length === 1) {
      showWinner();
    } else if (pairsWithTopics.length > 0) {
      showPairWithTopics(pairsWithTopics);
    } else {
      playGame();
    }
  });
};

const setTimer = (timeInSeconds) => {
  let timeLeft = timeInSeconds;
  let elem = document.getElementById("time");
  let timerId = setInterval(countdown, 1000);

  function countdown() {
    if (timeLeft === -1) {
      clearTimeout(timerId);
      alert("Time's up!");
      elem.innerHTML = "";
    } else {
      elem.innerHTML = timeLeft + " seconds remaining";
      timeLeft--;
    }
  }
};

const addPlayerWithByeToWinners = (pairs) => {
  const pairWithBye = pairs.find((pair) => pair[1] === "bye");
  if (pairWithBye) {
    players.push(pairWithBye[0]);
  }
};
const selectWinner = () => {
  let winner = document.querySelector('input[name="radio-winner"]:checked')
    .value;
  players.push(winner);
};

const showWinner = () => {
  document.getElementById("app").innerHTML = `
    <h1>${players[0]} wins 🎉</h1>
    <button id="new-game">New game</button>
    `;

  const button = document.getElementById("new-game");
  button.addEventListener("click", () => (document.location = "/index.html"));
};

const validatePlayerNumber = () => {
  const validationErrorSpan = document.getElementById("validation-error");
  validationErrorSpan.innerHTML = `Enter at least two players`;
};

const playGame = () => {
  let pairs = assignPairs(shuffle(players));
  showPairsForRound(pairs, round);

  addPlayerWithByeToWinners(pairs);

  round++;

  const playButton = document.getElementById("play");

  playButton.addEventListener("click", (event) => {
    event.preventDefault();
    const pairsWithTopics = assignTopics(pairs);

    showPairWithTopics(pairsWithTopics);
  });
};

let players = [];
let round = 1;

// start of program
const form = document.getElementById("form-player-names");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let playerNamesInput = document.getElementById("input-player-names").value;
  players = stringToArray(playerNamesInput);

  if (players.length < 2) {
    validatePlayerNumber();
  } else {
    playGame();
  }
});
