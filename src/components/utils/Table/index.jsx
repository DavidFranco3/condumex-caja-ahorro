import { useMemo } from 'react'
import { useTable, useSortBy } from 'react-table'
import IconSort from '../IconSort'

const Table = ({ columns, data }) => {
  const dataTable = useMemo(() => data)

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows, 
  } = useTable(
    {
      columns,
      data: dataTable,
    },
    useSortBy
  )

  return (
    <>
      <table className="min-w-full text-center" {...getTableProps()}>
        <thead className="border-b bg-gray-50">
          {headerGroups.map((headerGroup, indexHeader) => (
            <tr key={indexHeader} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, indexColumn) => (
                <th
                  key={indexColumn}
                  scope="col"
                  className="text-sm font-extrabold text-gray-900 px-6 py-4"
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render('Header')}
                  <IconSort column={column} />
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <tr key={i} className="bg-white border-b" {...row.getRowProps()}>
                {row.cells.map((cell, indexCell) => {
                  const component =
                    cell.column.id === 'acciones'
                      ? cell.render('Cell')
                      : cell.column.format(cell.value)
                  const fontBold = cell.column.id === 'folio' ? 'font-bold' : 'font-normal'
                  return (
                    <td
                      key={indexCell}
                      {...cell.getCellProps()}
                      className={`${fontBold} text-sm text-gray-900 px-4 py-1`}
                    >
                      {component}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export default Table
