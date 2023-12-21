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
        const showBoardValues = boardValues.join("|").replace(/([^|]+?\|[^|]+?\|[^|]+?)\|/g, "$1\n"); //new array specifically for display that adds "|" as a separator and makes a new line after 3 elements to represent a tic tac toe board
        console.log(showBoardValues)
    }

    const placeMarker = (cell, player) => { //takes in an array location and current player to place their marker
        const unmarkedBoxes = board.filter((cell) => cell.getMarker() == '-') //returns an array with all elements with a marker of -, or unmarked

        if (!unmarkedBoxes.length) return

        if (unmarkedBoxes.includes(board[cell]))  //checks that the selected array index is not alredy marked
            board[cell].addMarker(player) //adds the marker of the current player to the given array location 

    }

    return { getBoard, showBoard, placeMarker } //need to return any method or variable here to be used outside ex: board.getBoard works but now board.squares
}

//create individual cells for the board
function Box() {
    let marker = '-'

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
        marker: 'O',
    },
     {
        name: playerTwo,
        marker: 'X',
     }
    ]

    return {players} //returns the array; need to access the array first, then the player objects within
}

function createGame() {
    const board = createBoard() //grants access to methods of createBoard 
    const gameBoard = board.getBoard() //grants access to the board array through this variable
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
    //play the rounds
    const playRound = function(cell) {
        console.log(`${getTurn().name} marks square ${cell}`)
        cell = cell - 1 //makes number line up with array indexes example: inputting 1 will mark index 0, the first array element
 
        if (gameBoard[cell].getMarker() != '-') return console.log(`Square ${cell + 1} already marked, try again`) //stops the loop if the selectd square is marked by a player and let them retry

        board.placeMarker(cell, getTurn().marker) //accesses the board object, then runs the placeMarker method on the board array method given when calling playRound() and also taking the current active player's marker to use
        
        const checkWinner = () => {
            let winCondition = [
                [0, 1, 2],
                [0, 4, 8],
                [0, 3, 6],
                [3, 4, 5],
                [6, 7, 8],
                [1, 4, 7],
                [2, 4, 6],
                [2, 5, 8],
            ]
            let playerOneSquares = gameBoard.filter((cells) => {
                cells.value = gameBoard.indexOf(cells)
                return cells.getMarker() == 'O'
                })
            playerOneSquares = playerOneSquares.map((cells) => cells.value)

            let playerTwoSquares = gameBoard.filter((cells) => {
                cells.value = gameBoard.indexOf(cells)
                return cells.getMarker() == 'X'
                })
            playerTwoSquares = playerTwoSquares.map((cells) => cells.value)
            console.log(getTurn().marker)
            //checks the player marked squares against the possible win combonations to detect a winner
            winCondition.forEach(combo => { // loops through the array of win combonation arrays
                for (let el of combo) { 
                    if (!playerOneSquares.includes(el)) { //returns to repeat the loop as long as the marked squares don't equal a win combo
                        return
                    }
                }
                    console.log("Player One Wins")
                    
                })

                winCondition.forEach(combo => { // loops through the array of win combonation arrays
                    for (let el of combo) { 
                        if (!playerTwoSquares.includes(el)) { //returns to repeat the loop as long as the marked squares don't equal a win combo
                            return
                        }
                    }
                        console.log("Player Two Wins")
                        
                    })
                

            }
        checkWinner()
        nextTurn()
        currentTurn()

    }

    currentTurn()
    
    return { playRound, getTurn, nextTurn }
}

const game = createGame() //game can be played in the console by typing game.playRound() and inputting the square number
