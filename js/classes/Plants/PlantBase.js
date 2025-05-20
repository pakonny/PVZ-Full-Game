import ObjectBase from '../GameObjects/ObjectBase.js'
import Sprite from '../GameObjects/Sprite.js'

class PlantBase extends ObjectBase {
  _hurtAnimInterval = 0.4

  constructor (context, x, y, health, attackPower, cooldown, price, spriteObj, game) {
    const sprite = new Sprite(
      context,
      spriteObj,
      x, y,
      82, 87,
      95, 124,
      true
    )

    super(sprite.x, sprite.y, sprite.width, sprite.height, sprite.positionIdx)

    this.context = context
    this.game = game

    this.health = health
    this.attackPower = attackPower
    this.cooldown = cooldown * 1000
    this.price = price
    
    this.cooldownTimestamp = 0
    this.damageReceived = 0

    this.debounceTimeStamp = Date.now()

    this.sprite = sprite
  }

  performAction () {
    if (!this.isCooldownOver() && this.isDead) {
      return false
    }

    this.resetCooldown()
    this.startCooldown()

    return true
  }
  
  receiveDamage (damage) {
    if (damage <= 0) {
      return
    }

    this.health -= damage
    this.damageReceived = Date.now()
  }

  startCooldown () {
    this.cooldownTimestamp = Date.now()
  }

  resetCooldown () {
    if (this.cooldownTimestamp !== 0) {
      const elapsedTime = Date.now() - this.cooldownTimestamp

      if (elapsedTime >= this.cooldown) {
        this.cooldownTimestamp = 0
      }
    }
  }

  isCooldownOver () {
    if (this.cooldown <= 0) {
      return false
    }

    if (this.cooldownTimestamp === 0) {
      return true
    } else {
      const elapsedTime = Date.now() - this.cooldownTimestamp
      return elapsedTime >= this.cooldown
    }
  }

  draw () {
    this.context.save()

    if (this.damageReceived > 0) {
      this.context.filter = 'brightness(200%)'

      if ((Date.now() - this.damageReceived) / 100 >= this._hurtAnimInterval) {
        this.damageReceived = 0
      }
    }

    this.sprite.draw()
    this.context.restore()
  }

  isDead () {
    return this.health <= 0
  }

  isEnemyInFront () {
    if (this.game.zombies[this.positionIdx.y].length <= 0) {
      return false
    }

    for (let i = 0; i < this.game.zombies[this.positionIdx.y].length; ++i) {
      const zombie = this.game.zombies[this.positionIdx.y][i]

      if (zombie.x > this.x) {
        return true
      }
    }

    return false
  }
}

export default PlantBase
