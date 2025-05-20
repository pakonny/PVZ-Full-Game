import ObjectBase from '../GameObjects/ObjectBase.js'
import Sprite from '../GameObjects/Sprite.js'
import { ZombieSprite } from '../GameObjects/Sprites.js'

class Zombie extends ObjectBase {
  _cooldown = 1.5
  _slowedMovementDiscount = 80
  _hurtAnimInterval = 0.4
  _slowedTime = 0.7
  _attackDebounce = 0.3
  _maxRotation = 90 * Math.PI / 180
  _rotationSpeed = 4 * Math.PI / 180
  
  constructor (context, y, game) {
    const sprite = new Sprite(
      context,
      ZombieSprite,
      75 * 10.6, 90 * y,
      75, 120,
      0, 43,
      false
    )

    super(sprite.x, sprite.y, sprite.width, sprite.height, sprite.positionIdx)

    this.context = context
    this.game = game

    this.areHurt = 0
    this.areSlowed = 0
    this.areAttacking = false
    this.attackSubject = null
    this.debounceTimeStamp = Date.now()

    this.health = 8
    this.attackPower = 1
    this.cooldown = 1.5
    this.movementSpeed = 1 / 2

    this.rotation = Math.PI / 180

    this.sprite = sprite
  }

  update () {
    if (this.health <= 0) {
      if (this.rotation < this._maxRotation) {
        this.rotation += this._rotationSpeed
        this.draw()
        return true
      } else {
        return false
      }
    }

    if (this.attackSubject && this.attackSubject.isDead()) {
      this.areAttacking = false
      this.sprite.areStoppedAnimating = false
      delete this.attackSubject
    }

    if (!this.areAttacking) {
      this.walk()
    }

    if (this.x < 0) {
      this.game.isOver = true
    }

    this.draw()

    return this.health > 0
  }

  attack (plant) {
    if ((Date.now() - this.debounceTimeStamp) / 1000 < this._attackDebounce) {
      return false
    }

    this.debounceTimeStamp = Date.now()

    plant.receiveDamage(this.attackPower)

    this.attackSubject = plant
    this.areAttacking = true
    this.sprite.areStoppedAnimating = true
  }

  receiveDamage (damage) {
    if (damage <= 0) {
      return
    }

    this.health -= damage
    this.areHurt = Date.now()
  }

  walk () {
    this.x -= (!this.areSlowed ? this.movementSpeed : (100 - this._slowedMovementDiscount) / 100 * this.movementSpeed)
    this.sprite.move(this.x, this.y, false)
  }

  slowDown () {
    this.areSlowed = Date.now()
  }

  draw () {
    this.context.save()
    
    this.context.translate(this.getBottom().x, this.getBottom().y)
    this.context.rotate(this.rotation)
    this.context.translate(-this.getBottom().x, -this.getBottom().y)
    if (this.areSlowed > 0) {
      this.context.filter = 'sepia(100%) hue-rotate(180deg) saturate(400%)'
      this.sprite.delay = this.sprite.defaultDelay + ((100 - this._slowedMovementDiscount * 0.4) / 100 * this.sprite.defaultDelay)

      if ((Date.now() - this.areSlowed) / 1000 >= this._slowedTime) {
        this.areSlowed = 0
        this.sprite.delay = this.sprite.defaultDelay
      }
    }

    if (this.areHurt > 0) {
      this.context.filter = !this.areSlowed 
        ? 'brightness(200%)'
        : `${this.context.filter} brightness(200%)`

      if ((Date.now() - this.areHurt) / 100 >= this._hurtAnimInterval) {
        this.areHurt = 0
        this.context.restore()
      }
    }
    this.sprite.draw()
    this.context.restore()
  }
}

export default Zombie

