import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function ActivityDetailsModal({ activity, isOpen, onClose }) {
  if (!activity) return null;

  return (
    <Transition show={isOpen} as="div">
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex justify-between items-start">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  {activity.title}
                </Dialog.Title>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={onClose}
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Descripción</h4>
                  <p className="mt-1 text-sm text-gray-900">{activity.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Fecha</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {format(new Date(activity.date), "PPPp", { locale: es })}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Lugar</h4>
                    <p className="mt-1 text-sm text-gray-900">{activity.place}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Estado</h4>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{activity.status}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Promoción</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {activity.isPromoted ? 'Sí' : 'No'}
                    </p>
                  </div>
                </div>
                
                {activity.rejectionReason && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Motivo de rechazo</h4>
                    <p className="mt-1 text-sm text-gray-900">{activity.rejectionReason}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Creador</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {activity.user?.username || 'Desconocido'} ({activity.user?.email || 'No email'})
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}