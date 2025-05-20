import ObjectBase from './GameObjects/ObjectBase.js'

class Shovel extends ObjectBase {
  constructor (context, game) {
    super(
      640, 14,
      60, 60
    )
    this.context = context
    this.game = game

    this.shovelProperty = { x: 640, y: 14, width: 60, height: 60 }

    this.isHovering = false
    this.grass = { x: 0, y: 0, image: new Image() }
    this.grass.image.src = '/assets/General/Grass.bmp'

    this.image = new Image()
    this.image.src = '/assets/General/Shovel.png'
  }

  onClick (clickPos) {
    if (this.game.isShovelling) {
      const posId = this.game._getPosIdFromRelPos(clickPos.x, clickPos.y)
      this.game.removePlant(posId.x, posId.y)
    }

    this.game.isShovelling = false
    this.game.isHovering = false

    if (this.game._isClickWithinObject(clickPos, this.shovelProperty)) {
      this.game.isShovelling = !this.game.isShovelling

      if (this.game.isShovelling) {
        this.x = this.shovelProperty.x + (this.shovelProperty.width / 2)
        this.y = this.shovelProperty.y + (this.shovelProperty.height / 2)
      }
    }
  }

  onHover (mousePos) {
    if (this.game.isShovelling) {
      this.x = mousePos.x
      this.y = mousePos.y

      const posId = this.game._getPosIdFromRelPos(mousePos.x, mousePos.y)
      if (this.game._isValidPos(posId.x, posId.y)) {
        this.isHovering = true

        this.grass.x = 82 * posId.x + 95
        this.grass.y = 87 * posId.y + 124
      } else {
        this.isHovering = false
      }
    }
  }

  draw () {
    if (this.game.isShovelling) {
      if (this.isHovering) {
        this.context.save()

        this.context.filter = 'sepia(100%) hue-rotate(320deg) saturate(1000%) contrast(100%) opacity(50%)'
        this.context.drawImage(this.grass.image, this.grass.x, this.grass.y, 82, 87)

        this.context.restore()
      }

      this.context.drawImage(this.image, this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height)
    } else {
      this.context.drawImage(this.image, this.shovelProperty.x, this.shovelProperty.y, this.shovelProperty.width, this.shovelProperty.height)
    }
  }
}

export default Shovel