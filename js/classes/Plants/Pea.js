import ObjectBase from '../GameObjects/ObjectBase.js'

function randBetween (min, max) {
  const randomFraction = Math.random()

  return min + randomFraction * (max - min)
}

class Pea extends ObjectBase {
  _speed = 4.5

  constructor (context, damage, x, y, isIcePea = false) {
    super(x + 57, y + randBetween(0, 6), 24, 26)

    this.context = context
    this.isIcePea = isIcePea

    this.damage = damage

    this.image = new Image()
    this.image.src = (!isIcePea 
      ? '/assets/General/Pea.png'
      : '/assets/General/IcePea.png'
    )
  }

  update () {
    if (this.x >= 805) {
      return false
    }

    this.x += this._speed
    this.draw()

    return true
  }

  draw () {
    this.context.drawImage(this.image, this.x, this.y, this.width, this.height)
  }
}

export default Pea
