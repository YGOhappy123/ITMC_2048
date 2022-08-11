import Grid from './Modules/Grid.js'
import Tile from './Modules/Tile.js'

const gameBoard = document.querySelector('.game-board')
const scoreElement = document.querySelector('.score')

let grid = new Grid (gameBoard)

// Create first 2 tiles when the game started (with default value 2 or 4)
grid.randomEmptyCell().tile = new Tile(gameBoard)
grid.randomEmptyCell().tile = new Tile(gameBoard)
grid.renderScore(scoreElement)
setUpInput()

function setUpInput () {
    window.addEventListener ('keydown', handleInput, {once: true})
}

async function handleInput (e) {
    switch (e.key) {
        case 'ArrowUp':
            if (!canMoveUp()) {
                setUpInput()
                return
            }
            await moveUp()
            break
        case 'ArrowDown':
            if (!canMoveDown()) {
                setUpInput()
                return
            }
            await moveDown()
            break
        case 'ArrowLeft':
            if (!canMoveLeft()) {
                setUpInput()
                return
            }
            await moveLeft()
            break
        case 'ArrowRight':
            if (!canMoveRight()) {
                setUpInput()
                return
            }
            await moveRight()
            break
        default:
            setUpInput()
            return
    }
    
    grid.cells.forEach(cell => cell.mergeTiles())

    const newTile = new Tile(gameBoard)
    grid.randomEmptyCell().tile = newTile
    grid.renderScore(scoreElement)

    if (
        !canMoveUp() &&
        !canMoveDown() &&
        !canMoveLeft() &&
        !canMoveRight()
    ) {
        newTile.waitForTransition(true).then(() => {
            const is2048 = grid.cells.some(cell => cell.tile.value >= 2048)
            alert(
                is2048 ?
                'Congratulation! You won the game':
                'Oop! You lose'
            )
            restartGame()
        })
        return
    }
    setUpInput()
}

function moveUp () {
    return slideCells(grid.cellColumns)
}

function moveDown () {
    return slideCells(grid.cellColumns.map(column => [...column].reverse()))
}

function moveLeft () {
    return slideCells(grid.cellRows)
}

function moveRight () {
    return slideCells(grid.cellRows.map(row => [...row].reverse()))
}

function slideCells (cells) {
    return Promise.all(         // Use Promise to wait for moving animations
        cells.flatMap(group => {
            const promises = []
            for (let i = 1; i < group.length; i++) {     
                // skip y = 0 cells because they cannot be moved up
                const cell = group[i]
                let lastValidCell
    
                if (cell.tile == null) continue
                for (let j = i-1; j >=0; j--) {
                    const aboveCell = group[j]
                    if (!aboveCell.acceptMove(cell.tile)) break
                    lastValidCell = aboveCell
                }
    
                if (lastValidCell != null) {
                    promises.push(cell.tile.waitForTransition())
                    if (lastValidCell.tile != null) {
                        lastValidCell.mergingTile = cell.tile
                    } else {
                        lastValidCell.tile = cell.tile
                    }
                    cell.tile = null
                }
            }
            return promises
        })
    )
}

function canMoveUp () {
    return canMove(grid.cellColumns)
}

function canMoveDown () {
    return canMove(grid.cellColumns.map(column => [...column].reverse()))
}

function canMoveLeft () {
    return canMove(grid.cellRows)
}

function canMoveRight () {
    return canMove(grid.cellRows.map(row => [...row].reverse()))
}

function canMove (cells) {
    return cells.some(group => {
        return group.some((movingCell, indexOfMovingCell) => {
            if (indexOfMovingCell === 0) return false
            if (movingCell.tile == null) return false
            const aboveCell = group[indexOfMovingCell - 1]
            return aboveCell.acceptMove(movingCell.tile)
        })
    })
}

function restartGame() {
    const tiles = [...document.querySelectorAll('.tile')]
    tiles.forEach(tile => tile.remove())
    const cells = [...document.querySelectorAll('.cell')]
    cells.forEach(cell => cell.remove())
    grid = new Grid (gameBoard, true)
    grid.randomEmptyCell().tile = new Tile(gameBoard)
    grid.randomEmptyCell().tile = new Tile(gameBoard)
    grid.renderScore(scoreElement)
    setUpInput()
}
