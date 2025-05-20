import PlantBase from './PlantBase.js'
import Pea from './Pea.js'
import { IcePeaShooterSprite } from '../GameObjects/Sprites.js'

class IcePeaShooter extends PlantBase {
  constructor (context, x, y, game) {
    super(context, x, y, 3, 1, 1.5, 175, IcePeaShooterSprite, game)
  }

  performAction () {
    if (
      super.performAction() && this.isEnemyInFront()) {
      const pea = new Pea(this.context, this.attackPower, this.x, this.y, true)
      
      this.game.peas[this.positionIdx.y].push(pea)
    }
  }
}

export default IcePeaShooter
