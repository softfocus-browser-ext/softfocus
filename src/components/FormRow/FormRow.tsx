import { ReactNode } from 'react'
import './FormRow.css'

interface Props {
  name: string
  children: ReactNode
  displayValue?: number | string
}

const FormRow = ({ name, children, displayValue }: Props) => {
  return (
    <div className="formRow">
      <label htmlFor={ name }>{ name }</label>
      { children }
      { displayValue && <div className="displayValue">{ displayValue }</div> }
    </div>
  )
}

export default FormRow
