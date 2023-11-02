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
  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    // console.table(boardWithCellValues);
  };

  const reset = () => {
    board = [];
  };

  return { getBoard, printBoard, selectCell, reset, init };
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
  let finished = false;
  let draw = false;
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
    finished = false;
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

  const getIndex = () => {
    const token1 = [];
    const token2 = [];

    board.forEach((row, num) => {
      row.forEach((cell, index) => {
        if (cell.getValue() == "x") token1.push([num, index]);
        if (cell.getValue() == "o") token2.push([num, index]);
      });
    });

    if (checkFull()) {
      // console.log(token1);
      // console.log(token2);
    }
    return { token1, token2 };
  };

  const check = (obj) => {
    return (
      (obj[0] == 1 && obj[1] == 1 && obj[2] == 1) ||
      (obj[0] == 2 && obj[1] == 1 && obj[2] == 1)
    );
  };

  const checkWin = () => {
    const token1 = getIndex().token1;
    const token2 = getIndex().token2;
    let counter1 = {};
    let counter2 = {};
    let counter3 = {};
    let counter4 = {};
    let count1 = 0;
    let count2 = 0;

    token1.forEach((row) => {
      let x = row[0];
      let y = row[1];
      counter1[x] = (counter1[x] || 0) + 1;
      counter2[y] = (counter2[y] || 0) + 1;
    });
    token2.forEach((row) => {
      let x = row[0];
      let y = row[1];
      counter3[x] = (counter3[x] || 0) + 1;
      counter4[y] = (counter4[y] || 0) + 1;
    });

    if (
      Object.values(counter1).includes(3) ||
      Object.values(counter2).includes(3)
    ) {
      return true;
    }
    if (
      Object.values(counter3).includes(3) ||
      Object.values(counter4).includes(3)
    ) {
      return true;
    }

    for (let val of Object.keys(counter1)) {
      if (counter1[val] == 2) count1++;
    }

    for (let val of Object.keys(counter3)) {
      if (counter1[val] == 2) count2++;
    }

    if (count1 >= 2 || (check(counter1) && check(counter2))) {
      return true;
    }

    if (count2 >= 2 || (check(counter3) && check(counter4))) {
      return true;
    }

    if (checkFull()) {
      return false;
    }
    console.log(counter1);
    console.log(counter2);
    console.log(counter3);
    console.log(counter4);
  };

  const getPlayer = () => activePlayer;

  const printNewRound = () => {
    gameBoard.printBoard();
    console.log();
  };

  const getStatus = () => finished;
  const playRound = (row, col) => {
    if (gameBoard.selectCell(row, col, activePlayer.getToken())) {
      winStatus = checkWin();
      if (winStatus == true) {
        // reset();
        finished = true;
        return;
      }
      if (winStatus == false) {
        draw = true;
        return;
      }
      if (winStatus == undefined) console.log("xdd");

      switchPlayer();
      printNewRound();
      console.log(winStatus);
    } else {
      return;
    }
  };

  printNewRound();

  return { playRound, getPlayer, getStatus, reset, setNames };
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
  const mode = document.querySelectorAll(".mode");
  let player = displayController.getPlayer();

  const render = () => {
    const board = gameBoard.getBoard();
    player = displayController.getPlayer();
    if (displayController.getStatus()) {
      turn.textContent = `${player.getName()} wins`;
    } else {
      turn.textContent = `${player.getName()}'s turn`;
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
    displayController.setNames(inp1.value, inp2.value);
    form.style.visibility = "hidden";
    render();
  };

  const handleMode = (e) => {
    alert(e.target.textContent);
    form.style.visibility = "visible";
    mode.forEach((btn) => {
      btn.style.visibility = "hidden";
    });
  };

  const handleClick = (e) => {
    const row = e.target.dataset.row;
    const col = e.target.dataset.col;
    displayController.playRound(row, col);
    announce();
    render();
  };

  const announce = () => {
    if (displayController.getStatus()) {
      const winner = document.getElementById("winner");
      winner.textContent = `${player.getName()} wins`;
      dialog.showModal();
    }
  };

  div.addEventListener("click", handleClick);
  btn.addEventListener("click", () => {
    displayController.reset();
    render();
  });
  submit.addEventListener("click", handleSubmit);
  close.addEventListener("click", () => {
    dialog.close();
    displayController.reset();
    render();
  });
  mode.forEach((btn) => {
    btn.addEventListener("click", handleMode);
  });

  // render();
})();
