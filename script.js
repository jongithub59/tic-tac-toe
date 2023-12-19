//create repesentation of the board
function createBoard() {
    const squares = 9
    const board = []

    for (let i = 0; i < squares; i++) {
        board.push(Box())

    }

    const getBoard = () => board //returns the array as board

    const showBoard = () => { //displays the play area and which squares are marked by each player
        const boardValues = board.map((cell) =>  cell.getMarker()) 
        console.log(boardValues)
    }

    const placeMarker = (cell, player) => { //takes in an array location and current player to place their marker
        const unmarkedBoxes = board.filter((cell) => cell.getMarker() == 0) //returns an array with all elements with a marker of zero, or unmarked

        if (!unmarkedBoxes.length) return

        if (unmarkedBoxes.includes(cell)) {
            cell.addMarker(player) //adds the marker of the current player to the given array location 
        } else
            console.log(`Square already marked`)

    }
    

    return { getBoard, showBoard, placeMarker } //need to return any method or variable here to be used outside ex: board.getBoard works but now board.squares
}

//create individual cells for the board
function Box() {
    let marker = 0

    const addMarker = (player) => { //sets the array element's marker value to whatever the current player is
        marker = player
    }

    const getMarker = () => marker //returns marker when getMarker is called as a method

    return { addMarker, getMarker }

}

//create players
function createPlayers(playerOne = 'Player One', playerTwo = 'Player Two') { //creates an array with two player objects with default names
    const players = [
        {
        name: playerOne,
        marker: 1
    },
     {
        name: playerTwo,
        marker: 2
     }
    ]
    return {players} //returns the array; need to access the array first, then the player objects within
}

function createGame() {
    const players = createPlayers()
    const playerOne = players.players[0] 
    const playerTwo = players.players[1]

    playerTurn = playerOne //sets Player1 as the first player to make a move

    const nextTurn = function() { //sets the other player as the active player
        if (playerTurn == playerOne) {
            playerTurn = playerTwo
        } else 
            playerTurn = playerOne
    }

    const getTurn = () => playerTurn //returns the currently active player

    const currentTurn = function() { 
        board.showBoard()
        console.log(`It is ${getTurn().name}'s turn`)
    }

    const playRound = function(cell) {
        console.log(`${getTurn().name} marks square ${gameBoard.indexOf(cell) + 1}`)

        board.placeMarker(cell, getTurn().marker) //accesses the board object, then runs the placeMarker method on the board array method given when calling playRound() and also taking the current active player's marker to use

        nextTurn()
        currentTurn()

    }
    const board = createBoard() //grants access to methods of createBoard 

    currentTurn()

    const gameBoard = board.getBoard() //grants access to the board array thourgh this variable


    playRound(gameBoard[1])
    playRound(gameBoard[3])

    // board.showBoard()

}

createGame()





//play the rounds