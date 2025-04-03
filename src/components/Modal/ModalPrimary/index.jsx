import { Fragment } from 'react'
import { Transition, Dialog, TransitionChild, DialogPanel, DialogTitle } from '@headlessui/react'

const ModalPrimary = ({ title, isOpen, onCancel, onOK, content }) => {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog static as="div" className="relative z-10" onClose={() => null}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="flex justify-start items-center text-2xl font-bold leading-6 text-gray-900 pb-4"
                  >
                    {title}
                  </DialogTitle>
                  {/* Body */}
                  <div className="flex justify-center items-center flex-col p-2">
                    {content}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end items-center pt-4 space-x-4">
                    <button
                      type="button"
                      className="inline-block px-6 py-2.5 bg-emerald-600 text-white font-semibold text-base leading-tight rounded shadow-md hover:bg-emerald-700 hover:shadow-lg focus:bg-emerald-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-emerald-800 active:shadow-lg transition duration-150 ease-in-out"
                      onClick={onOK}
                    >
                      Aceptar
                    </button>
                    <button
                      type="button"
                      className="inline-block px-6 py-2.5 bg-gray-200 text-gray-700 font-semibold text-base leading-tight rounded shadow-md hover:bg-gray-300 hover:shadow-lg focus:bg-gray-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-400 active:shadow-lg transition duration-150 ease-in-out"
                      onClick={onCancel}
                    >
                      Cancelar
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default ModalPrimary
