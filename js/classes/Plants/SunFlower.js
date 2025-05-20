import PlantBase from './PlantBase.js'
import Sun from './Sun.js'
import { SunFlowerSprite } from '../GameObjects/Sprites.js'

class SunFlower extends PlantBase {
  constructor (context, x, y, game) {
    super(context, x, y, 3, 0, 10, 50, SunFlowerSprite, game)
  }

  performAction () {
    if (super.performAction()) {
      const sun = new Sun(this.context, this.price, this.x, this.y, true)

      this.game.suns.push(sun)
    }
  }
}

export default SunFlower
