import PlantBase from './PlantBase.js'
import { WallNutSprite } from '../GameObjects/Sprites.js'

class WallNut extends PlantBase {
  constructor (context, x, y) {
    super(context, x, y, 5, 0, 0, 50, WallNutSprite)
  }
}

export default WallNut
