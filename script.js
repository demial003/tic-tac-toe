const gameBoard = (function () {
  const rows = 3;
  const cols = 3;

  let board = [];

  const init = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < cols; j++) {
        board[i].push(Cell());
      }
    }
  };

  const selectCell = (row, col, token) => {
    let cell = board[row][col];
    if (cell.getValue() == "") {
      cell.addToken(token);
      return true;
    } else {
      return false;
    }
  };

  const getBoard = () => board;

  const getEmpty = () => {
    const boardWithCellValues = [];
    board.forEach((row, num) => {
      row.forEach((cell, index) => {
        if (cell.getValue() == "") boardWithCellValues.push([num, index]);
      });
    });
    return boardWithCellValues;
  };

  const reset = () => {
    board = [];
  };

  return { getBoard, getEmpty, selectCell, reset, init };
})();

function Player() {
  let token = "";
  let name = "";

  const selectToken = (value) => {
    token = value;
  };

  const getToken = () => token;

  const setName = (newName) => {
    name = newName;
  };

  const getName = () => name;

  return { selectToken, getToken, setName, getName };
}

function Cell() {
  let value = "";

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { addToken, getValue };
}

const displayController = (function () {
  gameBoard.init();

  const players = [Player(), Player()];
  let board = gameBoard.getBoard();
  let finished = undefined;
  players[0].selectToken("x");
  players[1].selectToken("o");
  let activePlayer = players[0];

  const setNames = (name1, name2) => {
    players[0].setName(name1);
    players[1].setName(name2);
  };

  const reset = () => {
    gameBoard.reset();
    gameBoard.init();
    finished = undefined;
    activePlayer = players[0];
    board = gameBoard.getBoard();
  };

  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const checkFull = () => {
    let full = true;

    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell.getValue() == "") {
          full = false;
        }
      });
    });

    if (full) {
      console.log("board is full");
    }

    return full;
  };

  const checkWin = () => {
    const board = gameBoard.getBoard();
    let won = false;
    for (let i = 0; i < 3; i++) {
      if (
        (board[0][i].getValue() !== "") &
        (board[0][i].getValue() == board[1][i].getValue()) &
        (board[0][i].getValue() == board[2][i].getValue())
      ) {
        console.log("xdd");
        return true;
      } else if (
        (board[i][0].getValue() !== "") &
        (board[i][0].getValue() == board[i][1].getValue()) &
        (board[i][0].getValue() == board[i][2].getValue())
      ) {
        console.log("ddx");
        return true;
      }
    }

    for (let i = 0; i < 3; i++) {
      if (
        (board[0][0].getValue() !== "") &
        (board[0][0].getValue() == board[1][1].getValue()) &
        (board[0][0].getValue() == board[2][2].getValue())
      ) {
        console.log("xpp");
        return true;
      } else if (
        (board[2][0].getValue() !== "") &
        (board[2][0].getValue() == board[1][1].getValue()) &
        (board[2][0].getValue() == board[0][2].getValue())
      ) {
        console.log("ppx");
        return true;
      }
    }

    if (!won & checkFull()) {
      console.log("icant");
      return false;
    }

    return undefined;
  };

  const getPlayer = () => activePlayer;

  const printNewRound = () => {
    // gameBoard.printBoard();
    console.log();
  };

  const getStatus = () => finished;

  const selectRandom = (token) => {
    let empty = gameBoard.getEmpty();
    let index = Math.floor(Math.random() * empty.length);
    let coords = empty[index];

    return gameBoard.selectCell(coords[0], coords[1], token);
  };

  const playPveRound = (row, col) => {
    if (gameBoard.selectCell(row, col, activePlayer.getToken())) {
      winStatus = checkWin();
      if (winStatus == true) {
        // reset();
        finished = true;
        return;
      }
      if (winStatus == false) {
        finished = false;
        return;
      }
      // if (winStatus == undefined) console.log("xdd");

      switchPlayer();
      if (selectRandom(activePlayer.getToken())) {
        console.log(activePlayer.getName());
        winStatus = checkWin();
        if (winStatus == true) {
          // reset();
          finished = true;
          return;
        }
        if (winStatus == false) {
          finished = false;
          return;
        }
      }
      switchPlayer();
      printNewRound();

      // console.log(winStatus);
    } else {
      return;
    }
  };

  const playRound = (row, col) => {
    if (gameBoard.selectCell(row, col, activePlayer.getToken())) {
      winStatus = checkWin();
      if (winStatus == true) {
        // reset();
        finished = true;
        return;
      }
      if (winStatus == false) {
        finished = false;
        return;
      }
      // if (winStatus == undefined) console.log("xdd");

      switchPlayer();
      printNewRound();
      // console.log(winStatus);
    } else {
      return;
    }
  };

  printNewRound();

  return {
    playRound,
    getPlayer,
    getStatus,
    reset,
    setNames,
    selectRandom,
    playPveRound,
  };
})();

const ScreenControl = (function () {
  const div = document.getElementById("board");
  const container = document.getElementById("container");
  const turn = document.getElementById("turn");
  const btn = document.createElement("button");
  const submit = document.getElementById("submit");
  const form = document.querySelector("form");
  const dialog = document.querySelector("dialog");
  const close = document.getElementById("close");
  const modes = document.querySelectorAll(".mode");
  const row2 = document.querySelector(".form-row2");
  let player = displayController.getPlayer();
  let mode = "";

  const render = () => {
    const board = gameBoard.getBoard();
    player = displayController.getPlayer();
    if (displayController.getStatus()) {
      turn.textContent = `${player.getName()} wins`;
      const winner = document.getElementById("winner");
      winner.textContent = `${player.getName()} wins`;
      dialog.showModal();
    } else if (displayController.getStatus() == undefined) {
      turn.textContent = `${player.getName()}'s turn`;
    } else {
      turn.textContent = "draw";
    }
    div.textContent = "";
    board.forEach((row, num) => {
      row.forEach((cell, index) => {
        const cellbtn = document.createElement("button");
        cellbtn.textContent = cell.getValue();
        cellbtn.dataset.row = num;
        cellbtn.dataset.col = index;
        cellbtn.classList.add("cell");
        div.appendChild(cellbtn);
      });
    });

    btn.classList.add("reset");
    btn.textContent = "Restart";
    container.appendChild(btn);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let inp1 = e.target.form[0];
    let inp2 = e.target.form[1];
    if (mode == "PVE") {
      displayController.setNames(inp1.value, "AI");
    } else {
      displayController.setNames(inp1.value, inp2.value);
    }

    form.style.visibility = "hidden";
    render();
  };

  const handleMode = (e) => {
    mode = e.target.textContent;
    form.style.visibility = "visible";
    modes.forEach((btn) => {
      btn.style.visibility = "hidden";
    });
    if (mode == "PVE") {
      row2.style.visibility = "hidden";
    }
  };

  const handleClick = (e) => {
    const row = e.target.dataset.row;
    const col = e.target.dataset.col;

    if (mode == "PVP") {
      displayController.playRound(row, col);
    } else {
      displayController.playPveRound(row, col);
    }

    render();
  };

  div.addEventListener("click", handleClick);
  btn.addEventListener("click", () => {
    displayController.reset();
    render();
  });
  submit.addEventListener("click", handleSubmit);
  close.addEventListener("click", () => {
    dialog.close();
    // displayController.reset();
    // render();
  });
  modes.forEach((btn) => {
    btn.addEventListener("click", handleMode);
  });

  // render();
})();
