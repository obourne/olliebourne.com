import { getEmojiGrid, getGridDimensions, debounce } from './helpers.js'

const emojiGridElement = document.querySelector('.emoji-grid-container')
const emojiSizeInputElement = document.querySelector('.emoji-size-input')

const createEmojiGridScreen = gridData => {
  const wrapperDiv = document.createElement('div')
  wrapperDiv.classList.add('emoji-grid-screen')
  gridData.forEach(rowData => {
    const rowElement = document.createElement('div')
    rowElement.classList.add('emoji-row')
    const rowFlipperElement = document.createElement('div')
    rowFlipperElement.classList.add('emoji-row-flipper')
    const rowFrontElement = document.createElement('div')
    rowFrontElement.classList.add('emoji-row-front')
    const rowBackElement = document.createElement('div')
    rowBackElement.classList.add('emoji-row-back')
    rowElement.appendChild(rowFlipperElement)
    rowFlipperElement.appendChild(rowFrontElement)
    rowFlipperElement.appendChild(rowBackElement)
    rowData.forEach(([emojiCharFront, emojiCharBack]) => {
      const emojiCellFrontElement = document.createElement('span')
      emojiCellFrontElement.classList.add('emoji-cell')
      emojiCellFrontElement.innerText = emojiCharFront
      rowFrontElement.appendChild(emojiCellFrontElement)
      const emojiCellBackElement = document.createElement('span')
      emojiCellBackElement.classList.add('emoji-cell')
      emojiCellBackElement.innerText = emojiCharBack
      rowBackElement.appendChild(emojiCellBackElement)
    })
    wrapperDiv.appendChild(rowElement)
  })
  return wrapperDiv
}

const emojiFlipAnimation = () => {
  const flipperElements = document.querySelectorAll('.emoji-row-flipper')
  const intervalId = setInterval(() => {
    let currentFlipperIndex = 0
    const flipRow = () => {
      const currentFlipper = flipperElements[currentFlipperIndex]
      if (!currentFlipper) return

      currentFlipperIndex++
      currentFlipper.classList.toggle('emoji-row-flipper--flipped')
      setTimeout(flipRow, 200)
    }
    flipRow()
  }, 5000)
  return () => clearInterval(intervalId)
}

const initEmojiGrid = () => {
  emojiGridElement.innerHTML = ''
  const emojiSize = Number(emojiSizeInputElement.value)
  emojiGridElement.style.setProperty('--emojiSize', `${emojiSize}px`)
  const gridStyles = getComputedStyle(emojiGridElement)
  const cellPixelSquare =
    emojiSize * parseInt(gridStyles.getPropertyValue('--emojiBoxRatio'))
  const { width, height } = getGridDimensions(cellPixelSquare, 100)
  const emojiGrid = getEmojiGrid(width, height)
  // TODO: replace emojis before flip back so we get infinite emojis
  emojiGridElement.appendChild(createEmojiGridScreen(emojiGrid))

  return emojiFlipAnimation()
}

let cleanupEmojiGrid = initEmojiGrid()

const regenerateEmojiGrid = () => {
  cleanupEmojiGrid()
  cleanupEmojiGrid = initEmojiGrid()
}

emojiSizeInputElement.addEventListener('change', regenerateEmojiGrid)
window.addEventListener('resize', debounce(regenerateEmojiGrid, 100))
