import { Link } from 'react-router-dom'
import { SparkleOutlineIcon } from './Icons'

export default function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Starlicht+">
      <SparkleOutlineIcon size={26} className="logo-mark" strokeWidth={1.4} />
      <span className="logo-text">STARLICHT</span>
      <sup>+</sup>
    </Link>
  )
}
