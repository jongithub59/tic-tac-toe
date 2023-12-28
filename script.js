//create repesentation of the board
function createBoard() {
    const squares = 9
    const board = []
    let boardValues = []


    for (let i = 0; i < squares; i++) {
        board.push(Box())
    }

    const getBoard = () => board //returns the array as board

    const showBoard = () => { //displays the play area and which squares are marked by each player
        boardValues = board.map((cell) =>  cell.getMarker()) 
        // console.log(boardValues)
        boardValues = boardValues.join("|").replace(/([^|]+?\|[^|]+?\|[^|]+?)\|/g, "$1\n"); //new array specifically for display that adds "|" as a separator and makes a new line after 3 elements to represent a tic tac toe board
        console.log(boardValues)
    }

    

    const placeMarker = (cell, player) => { //takes in an array location and current player to place their marker
        const unmarkedBoxes = board.filter((cell) => cell.getMarker() == ' ') //returns an array with all elements with a marker of -, or unmarked

        if (!unmarkedBoxes.length) return

        if (unmarkedBoxes.includes(board[cell]))  //checks that the selected array index is not alredy marked
            board[cell].addMarker(player) //adds the marker of the current player to the given array location 

    }
    
    return { getBoard, showBoard, placeMarker } //need to return any method or variable here to be used outside ex: board.getBoard works but now board.squares
}

//create individual cells for the board
function Box() {
    let marker = ' '

    const addMarker = (player) => { //sets the array element's marker value to whatever the current player is
        marker = player
    }

    const getMarker = () => marker //returns marker when getMarker is called as a method

    return { addMarker, getMarker }

}

//create players
function createPlayers(playerOne = 'Genji', playerTwo = 'Hanzo') { //creates an array with two player objects with default names
    const players = [
        {
        name: playerOne,
        marker: 'O',
        url: 'genji.png',
    },
     {
        name: playerTwo,
        marker: 'X',
        url: 'hanzo.png',
     }
    ]

    return {players} //returns the array; need to access the array first, then the player objects within
}

const createGame = () => {
    const board = createBoard() //grants access to methods of createBoard 
    const gameBoard = board.getBoard() //grants access to the board array through this variable
    // const boardValues = board.showBoard()
    const players = createPlayers()
    const playerOne = players.players[0] 
    const playerTwo = players.players[1]
    let turn = 1
    let winner = ''

    playerTurn = playerOne //sets Player1 as the first player to make a move

    const nextTurn = function() { //sets the other player as the active player
        turn++
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
    
    const resetRound = () => { //resets everything that was manipulated during the game
        playerOneSquares = []
        playerTwoSquares = []
        turn = 1
        for(let i = 0; i < gameBoard.length; i++){
            gameBoard[i].addMarker(' ')
        }
        playerTurn = playerOne
    }

    
    //play the rounds
    const playRound = function(cell) {
        console.log(`${getTurn().name} marks square ${cell}`)
        
        
        board.placeMarker(cell, getTurn().marker) //accesses the board object, then runs the placeMarker method on the board array method given when calling playRound() and also taking the current active player's marker to use
        
        // let playerSquares = boardValues.getBoardValues()
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
            
            const createPlayerSquares = () => { //creates an array showing the squares marked by players using their indexes so that they can be compared to the win combinations to find a winner 
                playerSquares = gameBoard.filter((cell) => {
                    cell.value = gameBoard.indexOf(cell)
                    return cell.getMarker() != ' '
                })
                playerTwoSquares = playerSquares.filter(cell => cell.getMarker() == 'X')
                playerOneSquares = playerSquares.filter(cell => cell.getMarker() == 'O')
                playerOneSquares = playerOneSquares.map( (cell) => cell.value)
                playerTwoSquares = playerTwoSquares.map( (cell) => cell.value)
            }
            createPlayerSquares()
            
            // checks the player marked squares against the possible win combonations to detect a winner
            winCondition.some(combo => { // loops through the array of win combonation arrays
                let isPlayerOneWin = !combo.some((i) => playerOneSquares.indexOf(i) == -1)  //checks each index of the win condition array to see if it exists in the player marked array, if it doesn't, -1 will be returned, so we check for when -1 is nNOT returned
                let isPlayerTwoWin = !combo.some((i) => playerTwoSquares.indexOf(i) == -1)
                if (isPlayerOneWin) return winner = playerOne
                if (isPlayerTwoWin) return winner = playerTwo
            })
            if (turn == 9) {
                return winner = 'Draw'

            }
            
        }
        checkWinner()
        nextTurn()
        currentTurn()
    }
    const getWinner = () => winner

    const resetWinner = () => winner = ''
    
    return { playRound, getTurn, resetRound, getBoard: board.getBoard, getWinner, resetWinner }
}

const screenController = function() {
    const game = createGame()
    // game.currentTurn() //calling currentTurn here ensures it will only play once at the start
    const boardDisplay = document.querySelector('.board')
    const turnDisplay = document.querySelector('.turn-display')
    const errorDisplay = document.querySelector('.error-display')
    const resetButton = document.querySelector('.reset')
    const resultDisplay = document.querySelector('.result-display')

    const updateScreen = () => {
        boardDisplay.textContent = ''
        const board = game.getBoard()
        const currentPlayer = game.getTurn()
        turnDisplay.textContent = `${currentPlayer.name}'s turn`
        board.forEach((index) => {
            const box = document.createElement('div')
            box.classList.add('box')
            box.dataset.cell = board.indexOf(index)
            box.dataset.marker = index.getMarker()
            box.textContent = index.getMarker()
            boardDisplay.appendChild(box)
        })
    }

    const freezeScreen = () => {// sets the value of winner to nothing and remove event listeners to "freeze" teh screen until the reset button is clicked
        game.resetWinner()
        boardDisplay.removeEventListener('click', clickHandler)
    }
    
    const clickHandler = (e) => {
        const clickedBox = e.target.dataset.cell
        if (e.target.textContent != ' ') return errorDisplay.textContent = 'Square is already marked by a player' //stops the loop if the selectd square is marked by a player and let them retry
        if (e.target.textContent = ' ') errorDisplay.textContent = ''
        
        game.playRound(clickedBox)
        console.log(game.getWinner().marker)
        if (game.getWinner().marker == 'O' || game.getWinner().marker == 'X') { //grab the winner value from checkWinner() and check if a player was assigned to it and check the marker
            resultDisplay.textContent = `${game.getWinner().name} Wins`
            freezeScreen()
        }
        if (game.getWinner() == 'Draw') {  //check if winner was assigned the string "draw"
            resultDisplay.textContent = 'Draw'
            freezeScreen()
        }
        
        updateScreen()
    }
    
    const resetBoard = () => {
        boardDisplay.addEventListener('click', clickHandler)
        boardDisplay.textContent = ' '
        resultDisplay.textContent = ''
        game.resetRound()
        updateScreen()
    }

    boardDisplay.addEventListener('click', clickHandler)
    resetButton.addEventListener('click', resetBoard)

    updateScreen()

}

screenController()
