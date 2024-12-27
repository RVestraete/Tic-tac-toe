function Cell() {

    let value = 0;

    const addItem = (player) => {
        value = player;
    };

    const getValue = () => value;

    return { addItem, getValue }

};

const Gameboard = (function () {
    const rows = 3;
    const columns = 3;
    const board = [];


    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        };
    };

    const getBoard = () => board;

    const updateBoard = (row, column, player) => {

        if (board[row][column].getValue() === 0) {
            board[row][column].addItem(player);
        } else {
            return;
        };

    };

    const printBoard = () => {

        const boardCellValues = board.map((row) => row.map((cell) => cell.getValue()));

        console.log(boardCellValues);


    };

    return { getBoard, updateBoard, printBoard };

})();

function GameController(playerOne = "Player 1", playerTwo = "Player 2") {

    const board = Gameboard;
    const rows = 3;
    let gameStatus = false;
    let drawFlag = false;

    const players = [
        {
            name: playerOne,
            item: 1,
            score: 0
        },
        {
            name: playerTwo,
            item: 2,
            score: 0
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const updatePlayersNames = (player1, player2) => {

        players[0].name = player1;
        players[1].name = player2;

    };

    const resetPlayersScores = () => {
        players[0].score = 0;
        players[1].score = 0;
    };

    const getActivePlayer = () => activePlayer;

    const getPlayers = () => players;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const checkWinner = (row, column) => {

        let colCount = 0, rowCount = 0, diagCount = 0, aDiagCount = 0;

        for (let i = 0; i < rows; i++) {

            if (board.getBoard()[row][i].getValue() === getActivePlayer().item) rowCount++;
            if (board.getBoard()[i][column].getValue() === getActivePlayer().item) colCount++;
            if (board.getBoard()[i][i].getValue() === getActivePlayer().item) diagCount++;
            if (board.getBoard()[i][rows - i - 1].getValue() === getActivePlayer().item) aDiagCount++;

            if (rowCount === rows || colCount === rows || diagCount === rows || aDiagCount === rows) return true;
        };

        return false;
    };

    let roundPlayed = 0;

    const playRound = (row, column) => {

        if (board.getBoard()[row][column].getValue() === 0) {
            console.log(`Adding ${getActivePlayer().name}'s item into ${row}, ${column}...`);

            board.updateBoard(row, column, getActivePlayer().item);

            roundPlayed++;

            if (checkWinner(row, column)) {

                gameStatus = true;

                activePlayer.score += 1;

                console.log(`The winner is ${getActivePlayer().name} !`);
                return

            } else if (roundPlayed === 9) {

                drawFlag = true;

            } else {
                switchPlayerTurn();
                printNewRound();
            };
        };
    };

    const getGameStatus = () => gameStatus;
    const getDrawFlag = () => drawFlag;
    const resetGame = () => {
        drawFlag = false;
        gameStatus = false;
        roundPlayed = 0;
    };

    printNewRound();

    return {
        playRound, getActivePlayer, getBoard: board.getBoard,
        getGameStatus, updatePlayersNames,
        resetPlayersScores, resetGame,
        getDrawFlag, getPlayers
    };

};


function ScreenController() {

    // Game handling 
    const game = GameController();

    const textContent = document.querySelector(".text-content");
    const gameBoard = document.querySelector(".game-board");
    const endDialog = document.getElementById("dialog-end");
    const endText = document.querySelector(".end-text");

    const updateBoard = () => {

        gameBoard.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        textContent.textContent = `${activePlayer.name}'s turn...`

        board.forEach((row, indexRow) => {
            row.forEach((cell, indexColumn) => {

                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");


                cellButton.dataset.row = indexRow;
                cellButton.dataset.column = indexColumn;

                if (cell.getValue() === 1) {
                    cellButton.textContent = "X";
                    cellButton.style.color = "red";
                } else if (cell.getValue() === 2) {
                    cellButton.textContent = "O";
                    cellButton.style.color = "blue";
                };

                gameBoard.appendChild(cellButton);

            });
        });

        if (game.getGameStatus()) {

            endText.textContent = `${game.getActivePlayer().name} is the winner !`
            endDialog.showModal();

        };

        if (game.getDrawFlag()) {

            endText.textContent = `This is a draw !`
            endDialog.showModal()

        };
    };

    const resetBoard = () => {

        gameBoard.textContent = "";

        const board = game.getBoard();


        board.forEach((row, indexRow) => {
            row.forEach((cell, indexColumn) => {

                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");

                cellButton.dataset.row = indexRow;
                cellButton.dataset.column = indexColumn;
                cellButton.textContent = "";
                cell.addItem(0);

                gameBoard.appendChild(cellButton);

            });
        });

        game.resetGame();
        updateScoreDisplay();

    };

    const updateScoreDisplay = () => {

        display.innerHTML = `<p> ${game.getPlayers()[0].name}` + `<span style="color: red;"> X </span> : ` + `${game.getPlayers()[0].score} </p>` +
            `<p> ${game.getPlayers()[1].name}` + `<span style="color: blue;"> O </span> : ` + `${game.getPlayers()[1].score} </p>`;

    };


    // Handling of the clicks on board buttons
    function clickHandlerBoard(e) {

        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if (!selectedColumn || !selectedRow) return;

        game.playRound(selectedRow, selectedColumn);
        updateBoard();

    };

    gameBoard.addEventListener("click", clickHandlerBoard);

    // Dialog and side buttons handling 

    const addPlayers = document.querySelector(".add-players");
    const closeDialog = document.querySelector(".x");
    const player1 = document.getElementById("player-1");
    const player2 = document.getElementById("player-2");
    const playersForm = document.querySelector(".players-form");
    const display = document.querySelector(".display");
    const reset = document.querySelector(".stop-game");
    const endForm = document.querySelector(".end-form");
    const dialog = document.getElementById("dialog");

    addPlayers.addEventListener("click", () => {
        dialog.showModal();
    });

    closeDialog.addEventListener("click", () => {
        dialog.close();

        player1.value = "";
        player2.value = "";

    });

    playersForm.addEventListener("submit", () => {

        game.updatePlayersNames(player1.value, player2.value);

        updateScoreDisplay();

        updateBoard();

        gameBoard.style.background = "#306754";

        player1.value = "";
        player2.value = "";

    });

    reset.addEventListener("click", () => {

        resetBoard();
        game.resetPlayersScores();

    });

    endForm.addEventListener("submit", resetBoard);



};


ScreenController();

