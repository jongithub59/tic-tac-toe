//create repesentation of the board
function createBoard() {
    const squares = 9
    const board = []

    for (let i = 0; i < squares; i++) {
        board.push(Box())

    }

    const getBoard = () => board //returns the array as board
    

    const showBoard = () => {
        const boardValues = board.map((cell) =>  cell.getMarker())
        console.log(boardValues)
    }

    return { getBoard, showBoard } //need to return any method or variable here to be used outside ex: board.getBoard works but now board.squares
}

//create individual cells for the board
function Box() {
    marker = 0

    placeMarker = (player) => marker = player

    getMarker = () => marker //returns marker when getMarker is called as a method

    return { placeMarker, getMarker}

}

//create players
function Players(playerOne = 'Player One', playerTwo = 'Player Two') {
    const player1 = {
        name: playerOne,
        marker: 1
    }
    const player2 = {
        name: playerTwo,
        marker: 2
    }
    return {player1, player2}
}

const board = createBoard() //grants access to methods of createBoard 
console.log(board)
board.showBoard()

const gameBoard = board.getBoard() //grants access to the board array thourgh this variable
console.log(gameBoard)



//play the rounds