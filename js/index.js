document.addEventListener('DOMContentLoaded', function () {
    const lobbyContainer = document.getElementById('state-lobby')
    const playingContainer = document.getElementById('state-playing')
  
    document.addEventListener('state', (event) => {
      const state = event.detail.state
  
      localStorage.setItem('state', state)
  
      lobbyContainer.classList.add('disabled')
      playingContainer.classList.add('disabled')
  
      switch (state) {
        case 'lobby':
          lobbyContainer.classList.remove('disabled')
          break
        case 'playing':
          playingContainer.classList.remove('disabled')
          break
        case "pause":
          
           break
        default:
          break
      }
    })

    document.addEventListener("status", (event) => {
      const status = event.detail.status
      localStorage.setItem("status", status)
      switch(status) {
        case "pause" :
          document.getElementById("player-name-paused").innerHTML = "Player Name : " + localStorage.getItem("username") 
          document.getElementById("popup-paused").classList.remove("disabled")  
        break
        case "gameOver":
          document.getElementById("player-name-over").innerHTML = "Player Name : " + localStorage.getItem("username")
          document.getElementById("score-player").innerHTML = "Score : " + localStorage.getItem("score")
          document.getElementById("popup-over").classList.remove("disabled")
          break
        case "playing":
          
          break
        default:
          break
      }
    })
  })


  setTimeout(() => {
    document.dispatchEvent(new CustomEvent(
      'state',
      {
        detail: { state: 'lobby' },
        bubbles: true
      }
    ))
    document.dispatchEvent(new CustomEvent(
      'status',
      {
        detail: { status: 'playing' },
        bubbles: true
      }
    ))
  }, 100)
  