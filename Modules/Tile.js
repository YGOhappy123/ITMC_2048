export default class Tile {
    #tileElement
    #x
    #y
    #value

    constructor (tileContainer, value = Math.random() > 0.5 ? 2 : 4) {
        this.#tileElement = document.createElement('div')
        this.#tileElement.className = 'tile'
        tileContainer.appendChild(this.#tileElement)
        this.value = value
    }

    get value () {
        return this.#value
    }

    set x (value) {
        this.#x = value
        this.#tileElement.style.setProperty('--x', value)
    }

    set y (value) {
        this.#y = value
        this.#tileElement.style.setProperty('--y', value)
    }

    set value (val) {
        this.#value = val
        this.#tileElement.innerText = val
        const power = Math.log2(val)
        const bgLightness = 100 - power * 9
        this.#tileElement.style.setProperty('--bg-lightness', `${bgLightness}%`)
        this.#tileElement.style.setProperty('--text-lightness', `${bgLightness > 50 ? 10 : 90}%`)
    }

    removeTile () {
        this.#tileElement.remove()
    }
    
    waitForTransition (animation = false) {
        return new Promise (resolve => {
            this.#tileElement.addEventListener(
                animation ? 'animationend' : 'transitionend',
                resolve,
                {once: true}
            )
        })
    }
}