import { Moon, Sun } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../../features/preferences/themeSlice.js'

export default function ThemeToggle({ className = '' }) {
  const mode = useSelector((state) => state.theme.mode)
  const dispatch = useDispatch()
  const next = mode === 'dark' ? 'light' : 'dark'
  return <button className={`theme-toggle ${className}`} type="button" onClick={() => dispatch(toggleTheme())} aria-label={`Switch to ${next} mode`} aria-pressed={mode === 'light'} title={`Switch to ${next} mode`}>
    <span className="theme-toggle-track"><span className="theme-toggle-thumb">{mode === 'dark' ? <Moon size={13} /> : <Sun size={14} />}</span></span>
    <span className="theme-toggle-label">{mode === 'dark' ? 'DARK' : 'LIGHT'}</span>
  </button>
}
