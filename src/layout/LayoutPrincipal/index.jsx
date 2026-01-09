import { useState, useEffect, Fragment } from 'react';
import {
    getRazonSocial,
    getTokenApi,
    isExpiredToken,
    logoutApi,
    setRazonSocial
} from "../../api/auth";
import {
    useNavigate
} from "react-router-dom";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItems, Transition, MenuItem } from "@headlessui/react"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import LogoCajadeAhorro from "../../assets/png/caja-de-ahorro.png"
import ImagenPerfil from "../../assets/png/user-avatar.png"
import { Row, Container, Form } from "react-bootstrap";
import "./LayoutPrincipal.scss"

function LayoutPrincipal(props) {
    const { setRefreshCheckLogin, children } = props;

    const redirecciona = useNavigate();

    //Para cerrar la sesion
    const cerrarSesion = () => {
        Swal.fire({
            title: "Sesión cerrada",
            icon: "success",
            showConfirmButton: false,
            timer: 1600,
        });
        redirecciona("")
        logoutApi();
        setRefreshCheckLogin(true);
    }

    const [razonSocialElegida, setRazonSocialElegida] = useState(getRazonSocial() || "");

    // Almacenar razón social
    const almacenaRazonSocial = (razonSocial) => {
        if (
            razonSocial === "Asociación de Empleados Sector Cables A.C." ||
            razonSocial === "Asociación de Trabajadores Sindicalizados en Telecomunicaciones A.C."
        ) {
            setRazonSocial(razonSocial);
            setRazonSocialElegida(razonSocial); // ✅ actualiza el estado también
            window.location.reload(); // si realmente necesitas recargar
        }
    };

    // useEffect actualizado
    useEffect(() => {
        const razon = getRazonSocial();
        if (razon) setRazonSocialElegida(razon);
    }, []);

    // Cerrado de sesión automatico
    useEffect(() => {
        if (getTokenApi()) {
            if (isExpiredToken(getTokenApi())) {
                Swal.fire({
                    title: "Sesión expirada",
                    icon: "warning",
                    showConfirmButton: false,
                    timer: 1600,
                });
                Swal.fire({
                    title: "Sesión cerrrada por seguridad",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1600,
                });
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
    }, []);
    // Termina cerrado de sesión automatico

    // Para ir hacia el inicio
    const enrutaInicio = () => {
        redirecciona("/")
    }

    return (
        <>
            <Disclosure
                as="nav"
                className={
                    razonSocialElegida === "Asociación de Empleados Sector Cables A.C."
                        ? "bg-black"
                        : razonSocialElegida ===
                            "Asociación de Trabajadores Sindicalizados en Telecomunicaciones A.C."
                            ? "bg-red-700"
                            : "bg-black"
                }
            >
                {({ open }) => (
                    <>
                        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                            <div className="relative flex items-center justify-between h-16">
                                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                    {/* Mobile menu button*/}
                                    <DisclosureButton className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </DisclosureButton>
                                </div>
                                <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                                    <div className="flex-shrink-0 flex items-center">
                                        <div className="tooltip-container">
                                            <img
                                                className="block h-8 w-auto logoPrincipalMenu"
                                                src={LogoCajadeAhorro}
                                                alt="Workflow"
                                                onClick={() => {
                                                    enrutaInicio()
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="hidden sm:block sm:ml-6">
                                        {/* Informacion en el menu principal */}
                                        {/* Seleccionable con razones sociales */}
                                        <Form.Control
                                            as="select"
                                            aria-label="indicadorRazonSocial"
                                            name="razonSocial"
                                            defaultValue={razonSocialElegida}
                                            onChange={(e) => {
                                                almacenaRazonSocial(e.target.value)
                                            }}
                                        >
                                            <option value="" selected>Selecciona la razón social</option>
                                            <option value="Asociación de Empleados Sector Cables A.C." selected={razonSocialElegida === "Asociación de Empleados Sector Cables A.C."}>Asociación de Empleados Sector Cables A.C.</option>
                                            <option value="Asociación de Trabajadores Sindicalizados en Telecomunicaciones A.C." selected={razonSocialElegida === "Asociación de Trabajadores Sindicalizados en Telecomunicaciones A.C."}>Asociación de Trabajadores Sindicalizados en Telecomunicaciones A.C.</option>
                                        </Form.Control>
                                    </div>
                                </div>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                    {/* Profile dropdown */}
                                    <Menu as="div" className="ml-3 relative">
                                        <div>
                                            <MenuButton className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                                <span className="sr-only">Open user menu</span>
                                                <img
                                                    className="h-8 w-8 rounded-full"
                                                    src={ImagenPerfil}
                                                    alt=""
                                                />
                                            </MenuButton>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <MenuItems className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <MenuItem>
                                                    {({ active }) => (
                                                        <button
                                                            onClick={() => {
                                                                cerrarSesion()
                                                            }}
                                                            className="cerrarSesion"
                                                        >
                                                            Cerrar sesión
                                                        </button>
                                                    )}
                                                </MenuItem>
                                            </MenuItems>
                                        </Transition>
                                    </Menu>
                                </div>
                            </div>
                        </div>

                        <DisclosurePanel className="sm:hidden">
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                {/* Informacion en el menu principal */}
                                {/* Seleccionable con razones sociales */}
                                <Form.Control
                                    as="select"
                                    aria-label="indicadorRazonSocial"
                                    name="razonSocial"
                                    defaultValue={razonSocialElegida}
                                    onChange={(e) => {
                                        almacenaRazonSocial(e.target.value)
                                    }}
                                >
                                    <option value="" selected>Selecciona la razón social</option>
                                    <option value="Asociación de Empleados Sector Cables A.C." selected={razonSocialElegida === "Asociación de Empleados Sector Cables A.C."}>Asociación de Empleados Sector Cables A.C.</option>
                                    <option value="Asociación de Trabajadores Sindicalizados en Telecomunicaciones A.C." selected={razonSocialElegida === "Asociación de Trabajadores Sindicalizados en Telecomunicaciones A.C."}>Asociación de Trabajadores Sindicalizados en Telecomunicaciones A.C.</option>
                                </Form.Control>
                            </div>
                        </DisclosurePanel>
                    </>
                )}
            </Disclosure>
            <Container fluid>
                <Row>
                    {children}
                </Row>
            </Container>
        </>
    );
}

export default LayoutPrincipal;
