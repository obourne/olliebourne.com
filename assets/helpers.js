import { emojiChars } from './emoji-chars.js'

const emojiIndexes = emojiChars.length - 1

const getRandomEmoji = () => {
  const randomIndex = Math.floor(Math.random() * emojiIndexes)
  return emojiChars[randomIndex]
}

export const getEmojiRow = length => {
  const row = []
  for (let i = 0; i < length; i++) {
    row.push([getRandomEmoji(), getRandomEmoji()])
  }
  return row
}

export const getShiftedEmojiRow = previousRow => {
  const row = []
  row.push([getRandomEmoji(), getRandomEmoji()])
  return row.concat(previousRow.slice(0, -1))
}

export const getEmojiGrid = (columnLength, rowLength, seedGrid) => {
  const seedRow = seedGrid
    ? seedGrid[seedGrid.length - 1]
    : getEmojiRow(rowLength)
  const rows = []
  // if using custom seed don't render that row
  if (!seedGrid) {
    rows.push(seedRow)
  }
  for (let i = rows.length; i < columnLength; i++) {
    const previousRow = rows.length > 0 ? rows[rows.length - 1] : seedRow
    rows.push(getShiftedEmojiRow(previousRow))
  }
  return rows
}

export const getGridDimensions = (cellSquare, buffer = 0) => ({
  width: Math.floor(
    (document.documentElement.clientWidth - buffer) / cellSquare
  ),
  height: Math.floor(
    (document.documentElement.clientHeight - buffer) / cellSquare
  ),
})

export const debounce = (func, wait, immediate) => {
  let timeout
  return function() {
    let context = this,
      args = arguments
    let later = function() {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    let callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}
