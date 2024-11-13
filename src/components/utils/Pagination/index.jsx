import {
  faAnglesLeft,
  faAnglesRight,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'react-bootstrap'

const Pagination = ({
  setPageSize,
  gotoPage,
  prevPage,
  nextPage,
  canPrevPage,
  canNextPage,
  pageCount,
  pageIndex,
  pageSize,
  blockSize = [5, 10, 20, 30, 50, 100],
}) => {
  return (
    <div className="min-w-full text-center border-b bg-gray-50">
      <div className="flex justify-around items-center space-x-4 py-2 flex-col md:flex-row gap-2 md:gap-0">
        <div className="flex justify-center space-x-2">
          <Button
            type="button"
            className="btn-sm"
            variant={canPrevPage ? 'info' : 'secondary'}
            onClick={() => gotoPage(0)}
            disabled={!canPrevPage}
          >
            <FontAwesomeIcon className='text-white' icon={faAnglesLeft} />
          </Button>
          <Button
            type="button"
            className="btn-sm"
            variant={canPrevPage ? 'info' : 'secondary'}
            onClick={() => prevPage()}
            disabled={!canPrevPage}
          >
            <FontAwesomeIcon className='text-white' icon={faChevronLeft} />
          </Button>
          <Button
            type="button"
            className="btn-sm"
            variant={canNextPage ? 'info' : 'secondary'}
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            <FontAwesomeIcon className='text-white' icon={faChevronRight} />
          </Button>
          <Button
            type="button"
            className="btn-sm"
            variant={canNextPage ? 'info' : 'secondary'}
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            <FontAwesomeIcon className='text-white' icon={faAnglesRight} />
          </Button>
        </div>
        <span>
          Página{' '}
          <strong>
            {pageIndex + 1} de {pageCount}
          </strong>
        </span>{' '}
        <span className="flex justify-between items-center space-x-2">
          Ir a la página:{' '}
          <input
            className="block
                      w-8
                      text-sm
                      font-normal
                      text-gray-700
                      bg-white bg-clip-padding
                      border border-solid border-gray-300
                      rounded
                      transition
                      ease-in-out
                      pl-2
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            type="number"
            max={pageCount}
            min={1}
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const value = e.target.value
              const newPage = Number(value)

              if (newPage >= 1 && newPage <= pageCount) {
                gotoPage(newPage - 1)
              }
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <div className="flex justify-center items-center">
          <div className="w-32 space-x-2">
            <select
              className="form-select form-select-sm
                          appearance-none
                          block
                          px-2
                          py-1
                          text-sm
                          font-normal
                          text-gray-700
                          bg-white bg-clip-padding bg-no-repeat
                          border border-solid border-gray-300
                          rounded
                          transition
                          ease-in-out
                          m-0
                          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {blockSize.map((perPage) => (
                <option key={perPage} value={perPage}>
                  Mostrar {perPage}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pagination
