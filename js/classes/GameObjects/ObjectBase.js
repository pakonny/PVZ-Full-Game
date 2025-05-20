class ObjectBase {
    constructor (x, y, width, height, positionIdx = null) {
      this.x = x
      this.y = y
      this.width = width
      this.height = height
      this.positionIdx = positionIdx 
    }
  
    getBottom () {
      return { x: this.x + (this.width / 2), y: this.y + this.height + 30 }
    }
  
  }
  
  export default ObjectBase
      