const containerId = '#state-lobby'
const usernameInput = document.querySelector(`${containerId} .input-username`)
const levelInput = document.querySelector(`${containerId} .input-level`)
const playButton = document.querySelector(`${containerId} .button-playgame`)
const instructionButton = document.querySelector(`${containerId} .button-instruction`)
const closeButton = document.querySelector(`${containerId} .button-close`)
const instructionBox = document.querySelector(`${containerId} .instruction-box`)
let usernameValue, levelValue

usernameInput.addEventListener('change', ({ target }) => {
  usernameValue = target.value.trim()

 if(areInputsFilled()){
   playButton.disabled = false
 }
})

levelInput.addEventListener('change', ({ target }) => {
  levelValue = target.value

  if (areInputsFilled()) {
    playButton.disabled = false
  }
})
      
playButton.addEventListener('click', () => {
  if (!usernameValue || usernameValue === '') {
    return alert('Isi Username Sebelum Memulai')
  }

  if (!levelValue) {
    return alert('Pilih Level Terlebih Dahulu')
  }

  localStorage.setItem('username', usernameValue)
  localStorage.setItem('level', levelValue)

  setTimeout(() => {
    document.dispatchEvent(new CustomEvent(
      'state',
      {
        detail: { state: 'playing' },
        bubbles: true
      }
    ))
  }, 100)
})

instructionButton.addEventListener('click', () => {
  instructionBox.classList.toggle('enabled')
})

closeButton.addEventListener('click', () => {
  instructionBox.classList.toggle('enabled')
})


function areInputsFilled(){
  return usernameValue && usernameValue != "" && levelValue
}

