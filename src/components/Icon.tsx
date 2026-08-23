interface Props {
  name: string
  className?: string
}

export function Icon({ name, className }: Props) {
  const classes = className ? `material-symbols-outlined ${className}` : 'material-symbols-outlined'
  return <span className={classes}>{name}</span>
}
