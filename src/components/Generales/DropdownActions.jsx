import { useState, useRef, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
// NOTA: En v2 importamos cada componente por separado
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'

/**
 * DropdownActions
 *
 * Componente reutilizable con soporte de Portal para "escapar" de tablas con overflow.
 */
const DropdownActions = ({
  label = 'Acciones',
  icon = 'fas fa-ellipsis-v',
  actions = [],
  children,
  align = 'right',
  buttonColor = 'secondary'
}) => {
  const [menuStyles, setMenuStyles] = useState({})
  const buttonRef = useRef(null)

  // Función para calcular posición
  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      // w-48 de Tailwind es aprox 192px (12rem)
      const MENU_WIDTH = 192

      let left = align === 'right'
        ? rect.right - MENU_WIDTH
        : rect.left

      // Corrección de límites de pantalla básicos
      if (left < 0) left = 10
      if (left + MENU_WIDTH > window.innerWidth) left = window.innerWidth - MENU_WIDTH - 10

      setMenuStyles({
        position: 'fixed',
        top: `${rect.bottom + 5}px`,
        left: `${left}px`,
        zIndex: 9999, // Superposición máxima
        width: '12rem' // w-48
      })
    }
  }

  const triggerStyles = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
    secondary: 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 shadow-sm',
    minimal: 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-transparent hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center transition-colors'
  }

  const currentTriggerStyle = triggerStyles[buttonColor] || triggerStyles.secondary
  const isMinimal = buttonColor === 'minimal'

  return (
        <Menu as='div' className='relative inline-block text-left'>
            {({ open }) => {
              // Actualizar posición cuando se abre
              if (open && buttonRef.current) {
                setTimeout(updatePosition, 0)
              }

              // Detectar modo oscuro para pasarlo al Portal
              const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')

              return (
                    <>
                        <div ref={buttonRef}>
                            <MenuButton className={`inline-flex items-center justify-center rounded-md text-xs font-semibold uppercase tracking-widest transition ease-in-out duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${isMinimal ? '' : 'px-3 py-2'} ${currentTriggerStyle}`}>
                                {isMinimal
                                  ? (
                                        <i className={icon} />
                                    )
                                  : (
                                        <>
                                            {icon && <i className={`${icon} mr-2`} />}
                                            {label}
                                            <i className='fas fa-chevron-down ml-2 -mr-0.5 text-[10px]' />
                                        </>
                                    )}
                            </MenuButton>
                        </div>

                        {open && createPortal(
                            <div className='fixed inset-0 z-[9999]' style={{ pointerEvents: 'none' }}>
                                <Transition
                                  as={Fragment}
                                  show={open}
                                  enter='transition ease-out duration-100'
                                  enterFrom='transform opacity-0 scale-95'
                                  enterTo='transform opacity-100 scale-100'
                                  leave='transition ease-in duration-75'
                                  leaveFrom='transform opacity-100 scale-100'
                                  leaveTo='transform opacity-0 scale-95'
                                >
                                    <MenuItems
                                      static
                                      className={`absolute mt-2 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border pointer-events-auto
                                            ${isDark
                                                ? 'bg-slate-800 border-slate-700 divide-y divide-slate-700 text-gray-300'
                                                : 'bg-white border-gray-100 divide-y divide-gray-100 text-gray-700'
                                            }`}
                                      style={menuStyles}
                                    >
                                        <div className='py-1'>
                                            {/* Scroll handling para menús muy largos */}
                                            <div className='max-h-60 overflow-y-auto custom-scrollbar'>
                                                {actions.map((action, idx) => (
                                                    <MenuItem key={idx}>
                                                        {({ focus }) => {
                                                          // Ajustar estilos hover manualmente también para garantizar contraste
                                                          const activeClass = isDark ? 'bg-slate-700 text-white' : 'bg-gray-50 text-gray-900'
                                                          const inactiveClass = isDark ? 'text-gray-300' : 'text-gray-700'
                                                          const baseClasses = `${focus ? activeClass : inactiveClass} group flex w-full items-center px-4 py-2 text-sm transition-colors`

                                                          const content = (
                                                                <>
                                                                    {action.icon && (
                                                                        <i className={`${action.icon} mr-3 w-4 text-center ${action.color || (isDark ? 'text-gray-400' : 'text-gray-500')} ${focus ? (isDark ? 'text-indigo-400' : 'text-indigo-600') : ''} transition-colors`} />
                                                                    )}
                                                                    {action.label}
                                                                </>
                                                          )

                                                          if (action.href) {
                                                            return (
                                                                    <Link to={action.href} className={baseClasses}>
                                                                        {content}
                                                                    </Link>
                                                            )
                                                          } else {
                                                            // Wrapper para satisfacer la regla de eslint "handle..."
                                                            const handleActionClick = (e) => {
                                                              if (action.onClick) action.onClick(e)
                                                            }
                                                            return (
                                                                    <button onClick={handleActionClick} className={`${baseClasses} w-full text-left`} type='button'>
                                                                        {content}
                                                                    </button>
                                                            )
                                                          }
                                                        }}
                                                    </MenuItem>
                                                ))}
                                                {children}
                                            </div>
                                        </div>
                                    </MenuItems>
                                </Transition>
                            </div>,
                            document.body
                        )}
                    </>
              )
            }}
        </Menu>
  )
}

// Subcomponente Link Manual
const DropdownLink = ({ href, icon, children, color }) => (
    <MenuItem>
        {({ focus }) => (
            <Link
              to={href}
              className={`${focus ? 'bg-gray-50 dark:bg-slate-700' : ''} group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 transition-colors`}
            >
                {icon && (
                    <i className={`${icon} mr-3 w-4 text-center ${color || 'text-gray-400 dark:text-gray-500'} group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors`} />
                )}
                {children}
            </Link>
        )}
    </MenuItem>
)

// Subcomponente Button Manual
const DropdownButton = ({ onClick, icon, children, color }) => (
    <MenuItem>
        {({ focus }) => (
            <button
              onClick={onClick}
              className={`${focus ? 'bg-gray-50 dark:bg-slate-700' : ''} group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 transition-colors w-full text-left`}
            >
                {icon && (
                    <i className={`${icon} mr-3 w-4 text-center ${color || 'text-gray-400 dark:text-gray-500'} group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors`} />
                )}
                {children}
            </button>
        )}
    </MenuItem>
)

DropdownActions.Link = DropdownLink
DropdownActions.Button = DropdownButton

export default DropdownActions
