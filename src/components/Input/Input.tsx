import { useEffect } from 'react'

import './Input.css'

const debounce = require('lodash.debounce')

const doStoreValue = debounce((name: string, value: string | number) => {
  chrome?.storage?.sync.set({ [name]: value })
}, 500)

interface Props {
  type: string
  name: string
  min?: number
  max?: number
  step?: number
  value: string | number
  setValue: Function
}

const Input = ({
  type,
  name,
  min,
  max,
  step,
  value,
  setValue
}: Props) => {
  useEffect(() => {
    doStoreValue(name, value)
  }, [name, value])

  return (
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      { ...(min && { min }) }
      { ...(max && { max }) }
      { ...(step && { step }) }
      onChange={e => setValue(e.target.value)}
    />
  )
}

export default Input
