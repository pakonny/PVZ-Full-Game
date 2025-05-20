import ObjectBase from './ObjectBase.js'

class Sprite extends ObjectBase {
  constructor (context, spriteObj, x, y, width, height, offsetX = 0, offsetY = 0, withSize = false) {
    let relativeX
    let relativeY

    if (withSize) {
      relativeX = width * x + offsetX
      relativeY = height * y + offsetY
    } else {
      relativeX = x + offsetX
      relativeY = y + offsetY
    }

    super(relativeX, relativeY, width, height, { x, y })

    this.context = context

    this.offsetX = offsetX
    this.offsetY = offsetY
    this.positionIdx = { x, y }

    this.areStoppedAnimating = false
    this.spriteArray = spriteObj.sprites
    this.currentIndex = 0
    this.defaultDelay = spriteObj.delay
    this.delay = spriteObj.delay

    this.lastUpdateTime = 0
  }

  updateIndex () {
    const currentTime = Date.now()
    if (currentTime - this.lastUpdateTime > this.delay) {
      this.currentIndex = (this.currentIndex + 1) % this.spriteArray.length
      this.lastUpdateTime = currentTime
    }
  }

  getCurrentSprite () {
    return this.spriteArray[this.currentIndex]
  }

  move (x, y, withSize = false) {
    if (withSize) {
      this.x = this.width * x + this.offsetX
      this.y = this.height * y + this.offsetY
    } else {
      this.x = x + this.offsetX
      this.y = y + this.offsetY
    }
  }

  draw () {
    this.context.drawImage(this.getCurrentSprite(), this.x, this.y, this.width, this.height)

    if (!this.areStoppedAnimating) {
      this.updateIndex()
    }
  }
}

export default Sprite