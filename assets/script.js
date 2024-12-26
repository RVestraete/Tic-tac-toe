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

    return {playRound,getActivePlayer,getBoard: board.getBoard, getGameStatus, checkWinner};

};


function SreenController () {

}


