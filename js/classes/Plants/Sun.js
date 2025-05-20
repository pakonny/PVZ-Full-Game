import ObjectBase from '../GameObjects/ObjectBase.js'

function randBetween (min, max) {
  const randomFraction = Math.random()

  return min + randomFraction * (max - min)
}

const lastNumbers = []

function randBetweenRanges (ranges) {
  let randomNumber

  do {
    const [min, max] = ranges[Math.floor(Math.random() * ranges.length)]
    randomNumber = Math.floor(Math.random() * (max - min + 1) + min)
  } while (lastNumbers.includes(randomNumber))

  lastNumbers.push(randomNumber)

  if (lastNumbers.length >= 3) {
    lastNumbers.shift()
  }

  return randomNumber
}


function cubicBezier (t, p0, p1, p2, p3) {
  const term1 = Math.pow(1 - t, 3) * p0
  const term2 = 3 * Math.pow(1 - t, 2) * t * p1
  const term3 = 3 * (1 - t) * Math.pow(t, 2) * p2
  const term4 = Math.pow(t, 3) * p3

  return term1 + term2 + term3 + term4
}

class Sun extends ObjectBase {
  _gravity = 1 / 2
  _disappearTime = 7
  _sunPositionX = 119
  _sunPositionY = 11
  _disappearSpeed = 0.02

  constructor (context, value, x, y, isFromPlant = false) {
    super(
      (isFromPlant ? x + 7 : randBetweenRanges([[10, 183], [422, 630], [702, 750]])),
      (isFromPlant ? y : -60),
      60,
      60
    )

    this.isFromPlant = isFromPlant

    this.context = context
    this.value = value

    this.groundYPos = (isFromPlant ? y + 20 : randBetween(325, 500))

    this.velocity = { x: randBetween(-1, 1), y: -6 }

    this.startTime = 0
    this.globalAlpha = 1

    this.isDeceased = false
    this.preDeceasing = false
    this.isCollected = false
    this.isFalling = true

    this.image = new Image()
    this.image.src = 'assets/General/Sun.png'
  }

  update () {   
    if (this.startTime > 0 && !this.isFalling) {
      const elapsedTime = (Date.now() - this.startTime) / 1000

      if (elapsedTime >= this._disappearTime) {
        this.preDeceasing = true
      }
    }
    
    if (this.isDeceased) {
      this.draw()

      return false
    }

    if (this.isCollected) {
      this.globalAlpha = 1

      const deltaX = this._sunPositionX - this.x
      const deltaY = this._sunPositionY - this.y

      const distanceToSun = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      if (distanceToSun < 0.1) {
        this.isDeceased = true
        this.draw()
        return false
      }

      const easingX = cubicBezier(0.5, 0, 0, 0.33, 1)
      const easingY = cubicBezier(0.5, 0, 0, 0.33, 1)

      this.x += deltaX * easingX
      this.y += deltaY * easingY

      this.draw()

      return true
    }

    if (this.preDeceasing) {
      if (this.globalAlpha > 0) {
        this.globalAlpha -= this._disappearSpeed

        this.draw()
        return true
      }

      this.globalAlpha = 0.4
      this.isDeceased = true
      return false
    }

    if (this.y < this.groundYPos) {
      if (this.isFromPlant) {
        this.velocity.y += this._gravity

        this.x += this.velocity.x
        this.y += this.velocity.y
      } else {
        this.y += this._gravity
      }
    } else {
      this.startTime = this.startTime > 0 ? this.startTime : Date.now()
      this.isFalling = false
    }

    this.draw()

    return true
  }

  draw () {
    this.context.save()

    this.context.globalAlpha = this.globalAlpha
    this.context.drawImage(this.image, this.x, this.y, this.width, this.height)

    this.context.restore()
  }
}

export default Sun
