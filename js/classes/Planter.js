const plantSeeds = {
    sunflower: {
      x: 202,
      y: 18,
      width: 45,
      height: 60,
      price: 50,
      element: document.querySelector('.seed.sunflower'),
      imageSrc: '/assets/SunFlower/frame_1_delay-0.06s.gif'
    },
    wallnut: {
      x: 256,
      y: 18,
      width: 45,
      height: 60,
      price: 50,
      element: document.querySelector('.seed.wallnut'),
      imageSrc: '/assets/WallNut/frame_0_delay-0.12s.gif'
    },
    peashooter: {
      x: 310,
      y: 18,
      width: 45,
      height: 60,
      price: 100,
      element: document.querySelector('.seed.peashooter'),
      imageSrc: '/assets/PeaShooter/frame_0_delay-0.12s.gif' 
    },
    icepeashooter: {
      x: 364,
      y: 18,
      width: 45,
      height: 60,
      price: 175,
      element: document.querySelector('.seed.icepeashooter'),
      imageSrc: '/assets/IcePea/frame_0_delay-0.12s.gif'
    }
  }
  
  class Planter {
    constructor (context, game) {
      this.context = context
      this.game = game
  
      this.selectedPlant = null
      this.hoverPlant = { x: 0, y: 0, image: new Image() }
      this.isHovering = true
    }
  
    onHover (mousePos) {
      if (this.selectedPlant != null) {
        const posId = this.game._getPosIdFromRelPos(mousePos.x, mousePos.y)
  
        if (this.game._isValidPos(posId.x, posId.y)) {
          this.isHovering = true
          this.setHoverPlant(plantSeeds[this.selectedPlant], posId)
        } else {
          this.isHovering = false
        }
      }
  
      for (const plantSeedId in plantSeeds) {
        const plantSeed = plantSeeds[plantSeedId]
        if (this.game._isClickWithinObject(mousePos, plantSeed)) {
          plantSeed.element.classList.add('hover')
        } else {
          plantSeed.element.classList.remove('hover')
        }
      }
    }
  
    onClick (clickPos) {
      if (this.selectedPlant != null) {
        const posId = this.game._getPosIdFromRelPos(clickPos.x, clickPos.y)
  
        if (this.game._isValidPos(posId.x, posId.y)) {
          this.isHovering = false
          this.game.placePlant(this.selectedPlant, posId.x, posId.y, false)
          this.selectedPlant = null
        }
      }
  
      for (const plantSeedId in plantSeeds) {
        const plantSeed = plantSeeds[plantSeedId]
  
        if (this.game._isClickWithinObject(clickPos, plantSeed) && this.game.sun >= plantSeed.price) {
          if (this.selectedPlant === plantSeedId) {
            this.selectedPlant = null
          } else {
            this.selectedPlant = plantSeedId
          }
        }
      }
    }
  
    onUpdate () {
      for (const plantSeedId in plantSeeds) {
        const plantSeed = plantSeeds[plantSeedId]
  
        if (this.game.sun < plantSeed.price) {
          plantSeed.element.classList.add('disabled')
          continue
        }
  
        plantSeed.element.classList.remove('disabled')
      }
  
      this.draw()
    }
  
    setHoverPlant (plantSeed, posId) {
      this.hoverPlant.x = 82 * posId.x + 95
      this.hoverPlant.y = 87 * posId.y + 124
      this.hoverPlant.image.src = plantSeed.imageSrc
    }
  
    draw () {
      if (this.isHovering) {
        this.context.save()
  
        this.context.filter = 'opacity(50%)'
        this.context.drawImage(this.hoverPlant.image, this.hoverPlant.x, this.hoverPlant.y, 82, 87)
  
        this.context.restore()
      }
  
      for (const plantSeedId in plantSeeds) {
        const plantSeed = plantSeeds[plantSeedId]
  
        if (plantSeedId === this.selectedPlant) {
          plantSeed.element.classList.add('selected')
        } else {
          plantSeed.element.classList.remove('selected')
        }
      }
    }
  }
  
  export default Planter
  