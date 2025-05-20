import Zombie from './classes/Zombies/Zombie.js'
import SunFlower from './classes/Plants/SunFlower.js'
import PeaShooter from './classes/Plants/PeaShooter.js'
import IcePeaShooter from './classes/Plants/IcePeaShooter.js'
import WallNut from './classes/Plants/WallNut.js'
import Sun from './classes/Plants/Sun.js'
import Planter from './classes/Planter.js'
import Lawnmower from './classes/GameObjects/Lawnmower.js'
import Shovel from './classes/Shovel.js'

function getPlant (type) {
  switch (type) {
    case 'sunflower':
      return SunFlower
    case 'peashooter':
      return PeaShooter
    case 'icepeashooter':
      return IcePeaShooter
    case 'wallnut':
      return WallNut
    default:
      console.error('Invalid plant type:', type)
      break
  }
}

const lastNumbers = []
function randBetween (min, max) {

  let randomNumber
  
  do {
    randomNumber = Math.floor(Math.random() * (max - min + 1) + min)
  } while (lastNumbers.includes(randomNumber))

  lastNumbers.push(randomNumber)
  
  if (lastNumbers.length >= 3) {
    lastNumbers.shift()
  }

  return randomNumber
}

const sunDisplay = document.querySelector('.sun-display')
const usernameDisplay = document.querySelector('.username-display')
const scoreDisplay = document.querySelector('.score-display')
const timeDisplay = document.querySelector('.time-display')

class Game {
  _columns = 8
  _rows = 5

  _zombieInterval = 5
  _sunInterval = 3

  constructor (context, canvas) {
    this.context = context
    this.canvas = canvas
    
    this.plants = Array.from({ length: this._rows }, () => [])
    this.zombies = Array.from({ length: this._rows }, () => [])
    this.suns = []
    this.peas = Array.from({ length: this._rows }, () => [])
    this.lawnmowers = Array.from({ length: this._rows }, (_, i) => new Lawnmower(context, i))

    this.planter = new Planter(context, this)
    this.shovel = new Shovel(context, this)
    this.isShovelling = false

    this.level = Number(localStorage.getItem('level'))

    this.deceasedPlants = []
    this.deceasedZombies = []
    this.deceasedPeas = []
    this.deceasedLawnmowers = []

    this.sun = 50
    
    this.sunIntervalTime = Date.now()
    this.zombieIntervalTime = Date.now()

    this.isOver = false
    this.isPaused = false

    this.minutes = 0
    this.seconds = 0
    this.timeLoop = null
  }

  init () {
    usernameDisplay.innerHTML = localStorage.getItem('username')
    localStorage.setItem('score', '0')

    this.sunIntervalTime = Date.now()
    this.zombieIntervalTime = Date.now()

    this.level = Number(localStorage.getItem('level'))

    this.spawnSun(25)
    this.spawnSun(25)

    if (this.timeLoop) {
      clearInterval(this.timeLoop)
    }

    this.timeLoop = setInterval(() => {
      this.updateTime()
    }, 1000)
  }

  update () {
    if (this.isOver) {
      return
    }

    if(this.isPaused) {
      setTimeout(() => {
        document.dispatchEvent(new CustomEvent(
          "status" ,
          {
            detail : {status : "pause"},
            bubbles : true
          }
        ))
      }, 100)    
    }

    if ((Date.now() - this.zombieIntervalTime) / 1000 >= this._zombieInterval) {
      this.zombieIntervalTime = Date.now()
      this.spawnZombie()
    }

    if ((Date.now() - this.sunIntervalTime) / 1000 >= this._sunInterval) {
      this.sunIntervalTime = Date.now()
      this.spawnSun(50)
    }

    this.planter.onUpdate()

    for (let x = 0; x < this._rows; ++x) {
      const peaRow = this.peas[x]
      const plantRow = this.plants[x]
      const zombieRow = this.zombies[x]
      const lawnmower = this.lawnmowers[x]
      
      this.peas[x] = peaRow.filter(pea => {
        return !zombieRow.some(zombie => {
          const collision = this.checkCollision(pea, zombie, 10)
          if (collision) {
            zombie.receiveDamage(pea.damage)
            if (pea.isIcePea) {
              zombie.slowDown()
            }
          }
          return collision
        })
      })

      zombieRow.forEach(zombie => {
        plantRow.forEach(plant => {
          if (plant && this.checkCollision(zombie, plant, 35)) {
            zombie.attack(plant)
          }
        })
        
        if (lawnmower && this.checkCollision(zombie, lawnmower)) {
          if (!lawnmower.isActivated) {
            lawnmower.isActivated = true
          }

          if (lawnmower.isActivated) {
            lawnmower.activate()
            zombie.receiveDamage(999)
          }
        }
      })

      if (lawnmower && lawnmower.isActivated) {
        if (!lawnmower.activate()) {
          this.deceasedLawnmowers.unshift(x)
        }
      }
    }

    for (let x = 0; x < this._rows; ++x) {
      for (let y = 0; y < this._columns; ++y) {
        const plant = this.plants[x][y]

        if (!plant) {
          continue
        }
        
        if (plant.isDead()) {
          this.deceasedPlants.unshift([x, y])
          continue
        }

        plant.performAction()
        plant.draw()
      }
    }

    for (let i = 0; i < this._rows; i++) {
      const zombieRow = this.zombies[i]
      const peaRow = this.peas[i]

      peaRow.forEach((pea, id) => {
        if (!pea.update()) {
          this.deceasedPeas.unshift([i, id])
        }
      })

      zombieRow.forEach(zombie => {
        if (!zombie.update()) {
          this.deceasedZombies.unshift(i)
        }
      })
    }

    this.shovel.draw()

    this.lawnmowers.forEach(lawnmower => {
      if (lawnmower) {
        lawnmower.draw()
      }
    })

    for (let i = this.suns.length - 1; i >= 0; i--) {
      const sun = this.suns[i]

      if (!sun.update()) {
        this.suns.splice(i, 1)
      }
    }

    this.deceasedPlants.forEach(plantId => {
      if (!this.plants[plantId[0]]) {
        return
      }

      this.plants[plantId[0]][plantId[1]] = null
    })

    this.deceasedPeas.forEach(peaId => {
      this.peas[peaId[0]].splice(peaId[1], 1)
    })

    this.deceasedZombies.forEach(zombieRow => {
      localStorage.setItem('score', `${Number(localStorage.getItem('score')) + 1}`)
      scoreDisplay.innerHTML = localStorage.getItem('score')
      
      this.zombies[zombieRow].shift()
    })

    this.deceasedLawnmowers.forEach(row => {
      this.lawnmowers[row] = null
    })

    this.deceasedPlants = []
    this.deceasedPeas = []
    this.deceasedZombies = []
  }

  onClick (event) {
    const rect = this.canvas.getBoundingClientRect()
    const clickPos = { x: event.clientX - rect.left, y: event.clientY - rect.top }

    console.log(`clickPos: {x: ${clickPos.x}, y: ${clickPos.y}}`)
    this.suns.forEach(sun => {
      if (this._isClickWithinObject(clickPos, sun)) {
        this.sun += sun.value
        if (this.sun >= 999) {
          this.sun = 999
        }

        sun.isCollected = true
        sunDisplay.innerHTML = `${Number(this.sun)}`
      }
    })

    if (!this.isShovelling) {
      this.planter.onClick(clickPos)
    }

    this.shovel.onClick(clickPos)
  }

  onHover (event) {
    const rect = this.canvas.getBoundingClientRect()
    const mousePos = { x: event.clientX - rect.left, y: event.clientY - rect.top }

    this.planter.onHover(mousePos)
    this.shovel.onHover(mousePos)
  }

  placePlant (type, x, y, skipPriceCheck = true) {
    if (!this._isValidPos(x, y)) {
      return
    }

    if (this.plants[y][x] != null) {
      console.log(this.plants[y][x])
      return
    }

    const PlantClass = getPlant(type)
    const plant = new PlantClass(
      this.context,
      x, y,
      this
    )

    if (!skipPriceCheck) {
      if (this.sun >= plant.price) {
        this.sun -= plant.price
        sunDisplay.innerHTML = `${Number(this.sun)}`
      } else {
        return
      }
    }

    this.plants[y][x] = plant
    
    plant.startCooldown()
  }

  spawnSun (value) {
    const sun = new Sun(this.context, value)
    this.suns.push(sun)
  }

  removePlant (x, y) {
    if (!this._isValidPos(x, y)) {
      return
    }

    this.deceasedPlants.unshift([y, x])
  }

  spawnZombie () {
    for (let i = 0; i < this.level; i++) {
      this.placeZombie(randBetween(0, 4))
    }

    // this.placeZombie(4)
  }

  placeZombie (y) {
    const zombie = new Zombie(this.context, y, this)

    this.zombies[y].push(zombie)
  }

  checkCollision (objectA, objectB, reduceBox = 0) {
    return (
      objectA.x < objectB.x + objectB.width - reduceBox &&
      objectA.x + objectA.width > objectB.x + reduceBox &&
      objectA.y < objectB.y + objectB.height - reduceBox &&
      objectA.y + objectA.height > objectB.y + reduceBox
    )
  }

  updateTime () {
    if (this.seconds === 59) {
      ++this.minutes
      this.seconds = 0
    } else {
      ++this.seconds
    }

    if (this.minutes <= 9) {
      timeDisplay.innerHTML = `0${this.minutes}`
    } else {
      timeDisplay.innerHTML = `${this.minutes}`
    }

    if (this.seconds <= 9) {
      timeDisplay.innerHTML += `:0${this.seconds}`
    } else {
      timeDisplay.innerHTML += `:${this.seconds}`
    }
  }


  _isValidPos (x, y) {
    if (x < 0 || x > this._columns - 1) {
      return false
    }

    return !(y < 0 || y > this._rows - 1)
  }

  _isClickWithinObject (clickPos, obj) {
    return (
      clickPos.x >= obj.x &&
      clickPos.x <= obj.x + obj.width &&
      clickPos.y >= obj.y &&
      clickPos.y <= obj.y + obj.height
    )
  }

  _getPosIdFromRelPos (relativeX, relativeY) {
    const x = Math.floor((relativeX - 95) / 82)
    const y = Math.floor((relativeY - 124) / 87)

    return { x, y }
  } 

 paused() {
  this.isPaused = true 
 }
}

export default Game
