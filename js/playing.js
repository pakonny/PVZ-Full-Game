import Game from "./Game.js"


const containerId = '#state-playing'
const countdownDisplay = document.getElementById('countdown')

function isStateValid () {
  return localStorage.getItem('state') === 'playing'
}

document.addEventListener('DOMContentLoaded', function () {
  const canvas = document.querySelector(`${containerId} .game-board`)
  const context = canvas.getContext('2d')

  canvas.width = 806
  canvas.height = 600

  let game

  document.addEventListener('state', (event) => {
    const state = event.detail.state

    if (state === 'playing') {
      const countdownLoop = setInterval(() => {
        countdownDisplay.innerHTML = `${Number(countdownDisplay.innerHTML) - 1}`
      }, 1000)

      setTimeout(() => {
        clearInterval(countdownLoop)
        countdownDisplay.classList.add('hidden')

        game = new Game(context, canvas)
        game.init()
        window.requestAnimationFrame(gameLoop)
      }, 3000)
    }
  })

  canvas.addEventListener('click', (event) => {
    game.onClick(event)
  }, false)

  canvas.addEventListener('mousemove', (event) => {
    game.onHover(event)
  }, false)

  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'


  function draw () {
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.save()

    game.update()

    context.restore()
  }

  function gameLoop () {
    if (isStateValid()) {
      draw()
    }
    window.requestAnimationFrame(gameLoop)
  }

  const pausePopup = document.getElementById("popup-paused")
  document.addEventListener("keypress", function(e) {
    if(e.keyCode == 32) {
          game.paused()
    }
   })
  const continueButton = document.getElementById("continue")
  continueButton.addEventListener('click', function() {
    pausePopup.classList.add("disabled")
    gameLoop()
  })
})

