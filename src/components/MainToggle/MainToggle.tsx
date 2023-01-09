import './MainToggle.css';

interface Props {
  label: string
  enabled: boolean
  setEnabled: Function
}

const TOGGLE_KEY = 'enabled'

const InputSwitch = ({
  label,
  enabled,
  setEnabled,
}: Props) => {
  return (
    <label htmlFor={TOGGLE_KEY}>
      <input
        type="checkbox"
        role="switch"
        id={TOGGLE_KEY}
        name={TOGGLE_KEY}
        checked={enabled}
        onChange={e => setEnabled(() => {
          chrome?.storage?.local.set({ [TOGGLE_KEY]: e.target.checked })
          return e.target.checked
        })}
      /> {label}
    </label>
  )
};

export default InputSwitch;
