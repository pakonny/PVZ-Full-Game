const ZombieSprites = []
ZombieSprites.length = 33

const SunFlowerSprites = []
SunFlowerSprites.length = 19

const PeaShooterSprites = []
PeaShooterSprites.length = 26

const IcePeaShooterSprites = []
IcePeaShooterSprites.length = 28

const WallNutSprites = []
WallNutSprites.length = 27

for (let i = 0; i < 33; i++) {
  if (i < ZombieSprites.length) {
    ZombieSprites[i] = new Image()
    ZombieSprites[i].src = `/assets/Zombie/frame_${i + 1}_delay-0.05s.gif`
  }

  if (i < SunFlowerSprites.length) {
    SunFlowerSprites[i] = new Image()
    SunFlowerSprites[i].src = `/assets/SunFlower/frame_${i + 1}_delay-0.06s.gif`
  }

  if (i < PeaShooterSprites.length) {
    PeaShooterSprites[i] = new Image()
    PeaShooterSprites[i].src = `/assets/PeaShooter/frame_${i}_delay-0.12s.gif`
  }

  if (i < IcePeaShooterSprites.length) {
    IcePeaShooterSprites[i] = new Image()
    IcePeaShooterSprites[i].src = `/assets/IcePea/frame_${i}_delay-0.12s.gif`
  }

  if (i < WallNutSprites.length) {
    WallNutSprites[i] = new Image()
    WallNutSprites[i].src = `/assets/WallNut/frame_${i}_delay-0.12s.gif`
  }
}

const ZombieSprite = { delay: 60, sprites: ZombieSprites }
const SunFlowerSprite = { delay: 85, sprites: SunFlowerSprites }
const PeaShooterSprite = { delay: 100, sprites: PeaShooterSprites }
const IcePeaShooterSprite = { delay: 100, sprites: IcePeaShooterSprites }
const WallNutSprite = { delay: 115, sprites: WallNutSprites }

export { ZombieSprite, SunFlowerSprite, PeaShooterSprite, IcePeaShooterSprite, WallNutSprite }
