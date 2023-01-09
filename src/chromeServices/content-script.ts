import { settingTypes } from '../types'
import SETTING_DEFAULTS from '../constants/setting-defaults'

const debounce = require('lodash.debounce')

const ID_SETTINGS_PANEL = 'sf-settings-panel'
const ID_TOP_FOCUSER = 'sf-top-focuser'
const ID_BOTTOM_FOCUSER = 'sf-bottom-focuser'
const CLASSNAME_FOCUSER = 'sf-focuser'

const adjustMargins = debounce((bodyElement: Element, cssHeight: string) => {
  // @ts-ignore
  bodyElement.style['marginTop'] = cssHeight
  // @ts-ignore
  bodyElement.style['marginBottom'] = cssHeight
}, 1000)

const initialize = () => {
  Promise
    .all([
      chrome.storage.local.get([ 'enabled' ]),
      chrome.storage.sync.get()
    ])
    .then(([enabled, settings]) => {
      drawFocusers({ ...settings, ...enabled })
    })
}

initialize()

const drawFocusers = async ({
  enabled = SETTING_DEFAULTS.ENABLED,
  height = SETTING_DEFAULTS.HEIGHT,
  color = SETTING_DEFAULTS.COLOR,
  opacity = SETTING_DEFAULTS.OPACITY,
  blur = SETTING_DEFAULTS.BLUR,
  edge = SETTING_DEFAULTS.EDGE,
} : settingTypes) => {
  const pageBody = document.querySelector(`body:not(#${ ID_SETTINGS_PANEL })`)
  let topFocuser = document.getElementById(ID_TOP_FOCUSER)
  let bottomFocuser = document.getElementById(ID_BOTTOM_FOCUSER)

  if (!topFocuser) {
    topFocuser = document.createElement('div')
    topFocuser.id = ID_TOP_FOCUSER
    topFocuser.className = CLASSNAME_FOCUSER
    pageBody?.appendChild(topFocuser)
  }

  if (!bottomFocuser) {
    bottomFocuser = document.createElement('div')
    bottomFocuser.id = ID_BOTTOM_FOCUSER
    bottomFocuser.className = CLASSNAME_FOCUSER
    pageBody?.appendChild(bottomFocuser)
  }

  const focuserHeight = Math.round((window.innerHeight - height) / 2)
  const opacityHex = Math.round((opacity / 100) * 255).toString(16)
  const cssValues = {
    visibility: enabled ? 'visible' : 'hidden',
    height: `${focuserHeight}px`,
    bgTop: `linear-gradient(180deg, ${ color }${ opacityHex } 0%, ${ color }${ opacityHex } ${ edge }%, ${ color }00 100%)`,
    bgBottom: `linear-gradient(0deg, ${ color }${ opacityHex } 0%, ${ color }${ opacityHex } ${ edge }%, ${ color }00 100%)`,
    blur: `blur(${ blur }px)`,
  }

  topFocuser.style['visibility'] = cssValues.visibility
  topFocuser.style['height'] = cssValues.height
  topFocuser.style['background'] = cssValues.bgTop
  topFocuser.style['backdropFilter'] = cssValues.blur

  bottomFocuser.style['visibility'] = cssValues.visibility
  bottomFocuser.style['height'] = cssValues.height
  bottomFocuser.style['background'] = cssValues.bgBottom
  bottomFocuser.style['backdropFilter'] = cssValues.blur

  adjustMargins(pageBody, enabled ? cssValues.height : 'auto')
}

const messagesFromReactAppListener = (
  message: settingTypes,
  // sender: chrome.runtime.MessageSender,
  // sendResponse: (response: any) => void
) => {
  drawFocusers(message)
}

chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
