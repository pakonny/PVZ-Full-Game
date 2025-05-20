import ObjectBase from './ObjectBase.js'

class Lawnmower extends ObjectBase {
  _speed = 5

  constructor (context, y) {
    super(
      5, 90 * y + 120,
      82, 82
    )

    this.context = context

    this.isActivated = false

    this.imageIdle = new Image()
    this.imageIdle.src = '/assets/General/lawnmowerIdle.gif'
    this.imageActive = new Image()
    this.imageActive.src = '/assets/General/lawnmowerActivated.gif'
  }

  activate () {

    this.isActivated = true

    if(this.x > 805) {
      return false
    }

    this.x += this._speed
    return true
  }

  draw () {
    if (this.isActivated) {
      this.context.drawImage(this.imageActive, this.x, this.y, this.width, this.height)
    } else {
      this.context.drawImage(this.imageIdle, this.x, this.y, this.width, this.height)
    }
  }
}

export default Lawnmower
