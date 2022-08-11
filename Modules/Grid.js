const GRID_REPEAT = 4
const CELL_SIZE = 16
const CELL_GAP = 2

export default class Grid {
    #cells
    
    constructor (gridElement) {
        gridElement.style.setProperty('--grid-repeat', GRID_REPEAT)
        gridElement.style.setProperty('--cell-size', `${CELL_SIZE}vmin`)
        gridElement.style.setProperty('--cell-gap', `${CELL_GAP}vmin`)

        this.#cells = createCellElements(gridElement).map((cellElement, index) => {
            return new Cell (
                cellElement,
                index % GRID_REPEAT,
                Math.floor(index / GRID_REPEAT)
            )
        })
    }

    get cells () {
        return this.#cells
    }

    get #emptyCells () {
        return this.cells.filter(cell => cell.tile == null)
    }

    get cellColumns () {
        return this.#cells.reduce((cellColumns, cell) => {
            cellColumns[cell.x] = cellColumns[cell.x] || []
            cellColumns[cell.x][cell.y] = cell
            return cellColumns
        }, [])
    }

    get cellRows () {
        return this.#cells.reduce((cellRows, cell) => {
            cellRows[cell.y] = cellRows[cell.y] || []
            cellRows[cell.y][cell.x] = cell
            return cellRows
        }, [])
    }

    randomEmptyCell () {
        const randomIndex = Math.floor(Math.random() * this.#emptyCells.length)
        return this.#emptyCells[randomIndex]
    }

    calcScore () {
        const notEmptyCells = this.cells.filter(cell => cell.tile != null)
        const tiles = notEmptyCells.map(cell => cell.tile)
        const totalScore = tiles.reduce((score, tile) => score += tile.value ,0)
        return totalScore
    }

    renderScore (scoreElement) {
        scoreElement.innerText = `Your score: ${this.calcScore()}`
    }
}

class Cell {
    #cellElement
    #x
    #y
    #tile
    #mergingTile

    constructor (cellElement, x, y) {
        this.#cellElement = cellElement
        this.#x = x
        this.#y = y
    }

    get x () {
        return this.#x
    }

    get y () {
        return this.#y
    }

    get tile () {
        return this.#tile
    }

    set tile (val) {
        this.#tile = val
        if (this.#tile != null) {
            this.#tile.x = this.#x
            this.#tile.y = this.#y
        }
    }

    get mergingTile () {
        return this.#mergingTile
    }

    set mergingTile (tile) {
        this.#mergingTile = tile
        if (this.#mergingTile != null) {
            this.#mergingTile.x = this.#x
            this.#mergingTile.y = this.#y
        }
    }

    acceptMove (tile) {
        // Accept movement if above cell is empty or (have same value and haven't done a merge)
        return (this.tile == null || (this.mergingTile == null && this.tile.value === tile.value))
    }

    mergeTiles () {
        // if both tiles can marge, sum 2 values, remove mergingTile from DOM and reset variable
        if (this.tile == null || this.mergingTile == null) return
        this.tile.value += this.mergingTile.value
        this.mergingTile.removeTile()
        this.mergingTile = null
    }
}

function createCellElements (gridElement, restart = false) {
    const cellsArr = []
    const cellQuantity = GRID_REPEAT * GRID_REPEAT
    for(let i = 0; i < cellQuantity; i++) {
        const cellElement = document.createElement('div')
        cellElement.className = 'cell'
        cellsArr.push(cellElement)
        gridElement.appendChild(cellElement)
    }
    return cellsArr
}