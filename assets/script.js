function Cell() {

    let value = 0;

    const addItem = (player) => {
        value = player;
    };

    const getValue = () => value; 

    return {addItem, getValue}

};

const Gameboard = (function (){
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

    const updateBoard = (row,column,player) => {

        if (board[row][column].getValue() === 0){
            board[row][column].addItem(player);
        } else {
            return;
        };

    };

    const printBoard = () => {
            
        const boardCellValues = board.map((row) => row.map((cell) => cell.getValue()));

        console.log(boardCellValues);


    };

    return {getBoard,updateBoard,printBoard};

})();

function GameController(playerOne = "Player 1", playerTwo = "Player 2") {

    const board = Gameboard;
    const rows = 3;
    let gameStatus = false;

    const players = [
        {
            name: playerOne,
            item: 1
        },
        {
            name: playerTwo,
            item: 2
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const updatePlayersNames = (player1,player2) => {

        players[0].name = player1;
        players[1].name = player2;

    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const checkWinner = (row, column) => {

        let colCount = 0, rowCount = 0, diagCount = 0, aDiagCount = 0;

        for(let i = 0; i < rows; i++){

            if (board.getBoard()[row][i].getValue() === getActivePlayer().item) rowCount++;
            if (board.getBoard()[i][column].getValue() === getActivePlayer().item) colCount++;
            if (board.getBoard()[i][i].getValue() === getActivePlayer().item) diagCount++;
            if (board.getBoard()[i][rows-i-1].getValue() === getActivePlayer().item) aDiagCount++;

            if (rowCount === rows || colCount === rows || diagCount === rows || aDiagCount === rows) return true;
        };

        return false;
    };

    const playRound = (row,column) => {
        console.log(`Adding ${getActivePlayer().name}'s item into ${row}, ${column}...`);

        board.updateBoard(row,column,getActivePlayer().item);

        if (checkWinner(row,column)){

            gameStatus = true;

            console.log(`The winner is ${getActivePlayer().name} !`);
            return

        } else {
            switchPlayerTurn();
            printNewRound();
        };
    };

    const getGameStatus = () => gameStatus;

    printNewRound();

    return {playRound,getActivePlayer,getBoard: board.getBoard, getGameStatus, updatePlayersNames};

};


function ScreenController () {

    // Game handling 
    const game = GameController();

    const textContent = document.querySelector(".text-content");
    const gameBoard = document.querySelector(".game-board");

    const updateBoard = () => {

        gameBoard.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        textContent.textContent = `${activePlayer.name}'s turn...`

        board.forEach((row,indexRow) => {
            row.forEach((cell,indexColumn) => {

                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");


                cellButton.dataset.row = indexRow;
                cellButton.dataset.column = indexColumn;
                cellButton.textContent = cell.getValue();

                gameBoard.appendChild(cellButton);

            });
        });
    };

    // Handling of the clicks on board buttons
    function clickHandlerBoard(e) {

        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if(!selectedColumn) return;

        game.playRound(selectedRow,selectedColumn);
        updateBoard();

    };

    gameBoard.addEventListener("click", clickHandlerBoard);

    updateBoard();


      // Dialog handling 

      const addPlayers = document.querySelector(".add-players");
      const closeDialog = document.querySelector(".x");
      const player1 = document.getElementById("player-1");
      const player2 = document.getElementById("player-2");
      const playersForm = document.querySelector(".players-form");
  
      addPlayers.addEventListener("click", () => {
          dialog.showModal();
        });
        
      closeDialog.addEventListener("click", () => {
          dialog.close();
  
          player1.value = "";
          player2.value = "";
  
        });
  
      playersForm.addEventListener("submit", () => {

        game.updatePlayersNames(player1.value,player2.value);

        updateBoard();
  
          player1.value = "";
          player2.value = "";
  
      });


};


ScreenController();

