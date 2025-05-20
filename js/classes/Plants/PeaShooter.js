import PlantBase from './PlantBase.js'
import Pea from './Pea.js'
import { PeaShooterSprite } from '../GameObjects/Sprites.js'

class PeaShooter extends PlantBase {
  constructor (context, x, y, game) {
    super(context, x, y, 3, 1.7, 1.5, 100, PeaShooterSprite, game)
  }

  performAction () {
    if (super.performAction() && this.isEnemyInFront()) {
      const pea = new Pea(this.context, this.attackPower, this.x, this.y)
      
      this.game.peas[this.positionIdx.y].push(pea)
    }
  }
}

export default PeaShooter
