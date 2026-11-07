import { COMBOBOX_LIST_CLASSES, COMBOBOX_OPTION_CLASSES } from '@/constants'

export function CategorySuggestions(props) {
  const { id, label, options, activeIndex, isExpanded, onSelect } = props

  return (
    <ul
      id={id}
      role="listbox"
      aria-label={`${label} suggestions`}
      hidden={!isExpanded}
      className={COMBOBOX_LIST_CLASSES}
    >
      {options.map(({ name, id: optionId }, index) => (
        <li
          key={optionId}
          id={optionId}
          role="option"
          aria-selected={index === activeIndex}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onSelect(name)}
          className={COMBOBOX_OPTION_CLASSES}
        >
          {name}
        </li>
      ))}
    </ul>
  )
}
