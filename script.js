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

    

    const placeMarker = (cell, player, playerIcon) => { //takes in an array location and current player to place their marker
        const unmarkedBoxes = board.filter((cell) => cell.getMarker() == ' ') //returns an array with all elements with a marker of -, or unmarked

        if (!unmarkedBoxes.length) return

        if (unmarkedBoxes.includes(board[cell]))  //checks that the selected array index is not alredy marked
            board[cell].addMarker(player) //adds the marker of the current player to the given array location 
            board[cell].addIcon(playerIcon) //adds url here so it can be accessed later through the Box object

    }
    
    return { getBoard, showBoard, placeMarker } //need to return any method or variable here to be used outside ex: board.getBoard works but now board.squares
}

//create individual cells for the board
function Box() {
    let marker = ' '
    let icon = ''

    const addMarker = (player) => { //sets the array element's marker value to whatever the current player is
        marker = player
    }

    const addIcon = (playerIcon) => { 
        icon = playerIcon
    }

    const getMarker = () => marker //returns marker when getMarker is called as a method

    const getIcon = () => icon

    return { addMarker, addIcon, getMarker, getIcon }

}

//create players
function createPlayers(playerOne = 'Genji', playerTwo = 'Hanzo') { //creates an array with two player objects with default names
    const players = [
        {
        name: playerOne,
        marker: 'O', //marker used for logic purposes only
        url: 'pics/genji-marker.png', //url for image to be used to mark squares
    },
     {
        name: playerTwo,
        marker: 'X',
        url: 'pics/hanzo-marker.png',
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

    const chooseHero = (hero) => { //changes the first player based on which hero icon is clicked
        if (hero == 'genji') {
            return playerTurn = playerOne
        } else if (hero == 'hanzo')
            return playerTurn = playerTwo
    }

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
            gameBoard[i].addIcon('')
            
        }
        playerTurn = playerOne
    }

    
    //play the rounds
    const playRound = function(cell) {
        console.log(`${getTurn().name} marks square ${cell}`)
        
        
        board.placeMarker(cell, getTurn().marker, getTurn().url) //accesses the board object, then runs the placeMarker method on the board array method given when calling playRound() and also taking the current active player's marker to use
        
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
                if (turn == 9 && isPlayerOneWin == false && isPlayerTwoWin == false) return winner = 'Draw'
            })
            
        }
        checkWinner()
        nextTurn()
        currentTurn()
    }
    const getWinner = () => winner

    const resetWinner = () => winner = ''
    
    return { chooseHero, playRound, getTurn, resetRound, getBoard: board.getBoard, getWinner, resetWinner }
}

const screenController = function() {
    const game = createGame()
    // game.currentTurn() //calling currentTurn here ensures it will only play once at the start
    const boardDisplay = document.querySelector('.board')
    const turnDisplay = document.querySelector('.turn-display')
    const errorDisplay = document.querySelector('.error-display')
    const resetButton = document.querySelector('.reset')
    const resultDisplay = document.querySelector('.result-display')
    const heroSelection = document.querySelector('.choose-hero')
    const genjiSelect = document.querySelector('#genji')
    const hanzoSelect = document.querySelector('#hanzo')
    turnDisplay.classList.add('hidden')
    resetButton.classList.add('hidden')
    resultDisplay.classList.add('hidden')
    errorDisplay.classList.add('hidden')
    
    const updateScreen = (reset) => {
        boardDisplay.textContent = ''
        const board = game.getBoard()
        const currentPlayer = game.getTurn()
        turnDisplay.textContent = `${currentPlayer.name}'s turn`
        board.forEach((index) => { //loops through every Box
            const box = document.createElement('div')
            const img = document.createElement('img')
            img.classList.add('icon')
            img.src = index.getIcon() //adds the src attribute and its value using the icon saved to the Box
            box.classList.add('box')
            box.dataset.cell = board.indexOf(index)
            box.dataset.marker = index.getMarker()
            // box.textContent = index.getMarker() //no longer needed since marker is only used for logic now
            boardDisplay.appendChild(box)
            if (img.src.includes('genji') || img.src.includes('hanzo')) { //need to check here because each Box has a default img src, so a blank image will display if we don't check
            box.appendChild(img) //an image icon is now used as a display marker
                if (reset == true) { //remove all images if reset is true from clicking the reset button
                    box.removeChild(img) 
                }
            }
    })
    reset = false
    }

    const chooseYourHero = (e) => {
        game.chooseHero(e.target.id) //use the id of the image element to decide which hero will be player one
        heroSelection.classList.add('hidden')
        turnDisplay.classList.remove('hidden')
        resetButton.classList.remove('hidden')
        unFreezeScreen()
        updateScreen() //updaet the screen so the new player one will be displayed
    }
    
    const freezeScreen = () => {// sets the value of winner to nothing and remove event listeners to "freeze" teh screen until the reset button is clicked
        game.resetWinner()
        boardDisplay.removeEventListener('click', clickHandler)
    }

    const unFreezeScreen = () => { //allow the board to be clicked again
        boardDisplay.addEventListener('click', clickHandler)
    }
    
    const clickHandler = (e) => {
        const clickedBox = e.target.dataset.cell
        console.log(e.target.dataset.marker)
        if (e.target.dataset.marker != ' ') {
            errorDisplay.classList.remove('hidden') //stops the loop if the selected square is marked by a player and let them retry and reveal error message
            errorDisplay.textContent = 'Square is already marked by a player'
            return
        }
        if (e.target.dataset.marker = ' ') errorDisplay.classList.add('hidden') //hide teh error message as long as valid squares are clicked
        
        game.playRound(clickedBox)
        console.log(game.getWinner().marker)
        if (game.getWinner().marker == 'O' || game.getWinner().marker == 'X') { //grab the winner value from checkWinner() and check if a player was assigned to it and check the marker
            resultDisplay.textContent = `${game.getWinner().name} Wins`
            turnDisplay.classList.add('hidden')
            resultDisplay.classList.remove('hidden')
            freezeScreen()
        }
        if (game.getWinner() == 'Draw') {  //check if winner was assigned the string "draw"
            resultDisplay.textContent = 'Draw'
            turnDisplay.classList.add('hidden')
            resultDisplay.classList.remove('hidden')
            freezeScreen()
        }
        
        updateScreen()
    }

    const resetBoard = () => {
        let reset = true
        boardDisplay.addEventListener('click', clickHandler)
        resetButton.classList.add('hidden')
        turnDisplay.classList.add('hidden')
        resultDisplay.classList.add('hidden')
        heroSelection.classList.remove('hidden')
        game.resetRound()
        updateScreen(reset) //send the reset variable ad true to updateScreen
        freezeScreen()
    }
    


    genjiSelect.addEventListener('click', chooseYourHero)
    hanzoSelect.addEventListener('click', chooseYourHero)
    boardDisplay.addEventListener('click', clickHandler)
    resetButton.addEventListener('click', resetBoard)
    
    updateScreen()
    freezeScreen()
    
}

screenController()
