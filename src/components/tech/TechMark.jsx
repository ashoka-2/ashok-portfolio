import { Icon } from '@iconify/react'
import { brandIcons } from '../../utils/brandIcons.js'

export default function TechMark({ tech }) {
  const icon = brandIcons[tech.id]
  return icon ? <Icon icon={icon} color={tech.color || '#62A8E8'} aria-hidden="true" /> : null
}
