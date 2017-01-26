/* globals Audio, alert */

import jquery from 'jquery'

const $ = jquery
const BACKGROUND_COLOR_NEUTRAL = '#ffffff'
const BACKGROUND_COLOR_FAILED = '#ffcccc'
const BACKGROUND_COLOR_PASSED = '#ccffcc'
let bodyBackgroundColor = BACKGROUND_COLOR_NEUTRAL

const SECONDS_IN_CYCLE = 120

const twoDigitsFormat = number => ('0' + Math.floor(number)).slice(-2)

const timerDisplay = $('#timeleft')
const timer = $('#timer')
const quitButton = $('#quit')
const startButton = $('#start')
const stopButton = $('#stop')
const resetButton = $('#reset')

/**
 * TODO: Implement Mouse Move (Does that actually make sense for this?)
 * TODO: Close does not really work …
 */
class Babysteptimer {
  constructor () {
    Babysteptimer.updateTimer(0, BACKGROUND_COLOR_NEUTRAL)
    quitButton.click(() => {
      alert('Please close the window!')
    })
    startButton.click(() => {
      Babysteptimer.updateTimer(0, BACKGROUND_COLOR_NEUTRAL, true)
      new TimerThread().start()
    })
    stopButton.click(() => {
      timerRunning = false
      Babysteptimer.updateTimer(0, BACKGROUND_COLOR_NEUTRAL, false)
    })
    resetButton.click(() => {
      currentCycleStartTime = Date.now()
      bodyBackgroundColor = BACKGROUND_COLOR_PASSED
    })
  }

  static updateTimer (time, color, running) {
    timerDisplay.text(Babysteptimer.getRemainingTimeCaption(time))
    timer.css('background-color', color)
    if (running) {
      stopButton.show()
      resetButton.show()
      startButton.hide()
    } else {
      stopButton.hide()
      resetButton.hide()
      startButton.show()
    }
  }

  static getRemainingTimeCaption (elapsedTime) {
    const elapsedSeconds = elapsedTime / 1000
    const remainingSeconds = SECONDS_IN_CYCLE - elapsedSeconds
    const remainingMinutes = remainingSeconds / 60
    return twoDigitsFormat(remainingMinutes) + ':' + twoDigitsFormat(remainingSeconds - Math.floor(remainingMinutes) * 60)
  }

  static playSound (name) {
    new Audio('./sounds/' + name + '.wav').play()
  }
}

let timerRunning = false
let currentCycleStartTime
let lastRemainingTime

/**
 * TODO: Maybe use requestAnimationFrame
 */
class TimerThread {
  start () {
    if (timerRunning) return false
    this.run()
    return true
  }

  run () {
    timerRunning = true
    currentCycleStartTime = Date.now()
    this.interval = window.setInterval(() => {
      if (!timerRunning) return
      let elapsedTime = Date.now() - currentCycleStartTime
      if (elapsedTime >= SECONDS_IN_CYCLE * 1000 + 980) {
        currentCycleStartTime = Date.now()
        elapsedTime = Date.now() - currentCycleStartTime
      }
      if (elapsedTime >= 5000 && elapsedTime < 6000 && BACKGROUND_COLOR_NEUTRAL !== bodyBackgroundColor) {
        bodyBackgroundColor = BACKGROUND_COLOR_NEUTRAL
      }

      let remainingTime = Babysteptimer.getRemainingTimeCaption(elapsedTime)
      if (remainingTime !== lastRemainingTime) {
        if (remainingTime === '00:10') {
          Babysteptimer.playSound('struck')
        } else if (remainingTime === '00:00') {
          Babysteptimer.playSound('shipsbell')
          bodyBackgroundColor = BACKGROUND_COLOR_FAILED
        }
        Babysteptimer.updateTimer(elapsedTime, bodyBackgroundColor, true)
        lastRemainingTime = remainingTime
      }
    }, 10)
  }
}

/* eslint-disable no-new */
new Babysteptimer()
