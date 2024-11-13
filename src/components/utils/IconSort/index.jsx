const IconSort = ({ column }) => {
  const desc = column.isSortedDesc ? ' ▼' : ' ▲'

  return <span>{column.isSorted ? desc : ''}</span>
}

export default IconSort
