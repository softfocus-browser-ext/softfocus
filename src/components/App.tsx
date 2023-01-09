import { useEffect, useState } from 'react'
import MainToggle from './MainToggle'
import FormRow from './FormRow'
import Input from './Input'
import SETTING_DEFAULTS from '../constants/setting-defaults'
import type { settingTypes } from '../types'

const App = () => {
  const [enabled, setEnabled] = useState<boolean>(false)
  const [height, setHeight] = useState<number>(0)
  const [color, setColor] = useState<string>(SETTING_DEFAULTS.COLOR)
  const [opacity, setOpacity] = useState<number>(0)
  const [blur, setBlur] = useState<number>(0)
  const [edge, setEdge] = useState<number>(0)

  const formConfig = [
    {
      name: 'height',
      type: 'range',
      min: 10,
      max: 500,
      step: 10,
      value: height,
      displayValue: `${ height }px`,
      setValue: setHeight,
    },
    {
      name: 'color',
      type: 'color',
      value: color,
      setValue: setColor,
    },
    {
      name: 'opacity',
      type: 'range',
      min: 0,
      max: 100,
      value: opacity,
      displayValue: `${ opacity }%`,
      setValue: setOpacity,
    },
    {
      name: 'blur',
      type: 'range',
      min: 0,
      max: 10,
      value: blur,
      displayValue: blur,
      setValue: setBlur,
    },
    {
      name: 'edge',
      type: 'range',
      min: 0,
      max: 100,
      value: edge,
      displayValue: edge,
      setValue: setEdge,
    },
  ]

  useEffect(() => {
    chrome.storage.local
      .get(['enabled'])
      .then(result => {
        setEnabled(result.enabled)
      })

    chrome.storage.sync
      .get()
      .then((data: settingTypes) => {
        setHeight(data?.height || SETTING_DEFAULTS.HEIGHT)
        setColor(data?.color || SETTING_DEFAULTS.COLOR)
        setOpacity(data?.opacity || SETTING_DEFAULTS.OPACITY)
        setBlur(data?.blur || SETTING_DEFAULTS.BLUR)
        setEdge(data?.edge || SETTING_DEFAULTS.EDGE)
      })
  }, [])

  useEffect(() => {
    chrome.tabs && chrome.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => {
      chrome.tabs.sendMessage(
        tabs[0].id || 0,
        {
          enabled,
          height,
          color,
          opacity,
          blur,
          edge,
        } as settingTypes,
        // (response: any) => {
        //   // no need to do anything
        // }
      )
    })
  }, [
    enabled,
    height,
    color,
    opacity,
    blur,
    edge,
  ])

  return (
    <>
      <MainToggle
        label="On"
        enabled={enabled}
        setEnabled={setEnabled}
      />

      <fieldset>
        <legend>Soft<b>Focus</b> Settings</legend>

        { formConfig.map(({
          name,
          type,
          min,
          max,
          step,
          value,
          displayValue,
          setValue
        }) => (
          <FormRow
            key={`setting-row-${ name }`}
            name={name}
            displayValue={displayValue}
          >
            <Input
              type={type}
              name={name}
              { ...(min && { min }) }
              { ...(max && { max }) }
              { ...(step && { step }) }
              value={value}
              setValue={setValue}
            />
          </FormRow>
        ))}
      </fieldset>
    </>
  );
}

export default App
