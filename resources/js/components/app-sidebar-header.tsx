import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { useTaskBoard } from '@/hooks/useTaskBoard';
import { type ApiErrorResponse, type BreadcrumbItem as BreadcrumbItemType, type ResponseResult } from '@/types';
import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const { isMobile } = useSidebar();
    const { currentBoard, editBoard, deleteBoard, isLocal } = useTaskBoard();
    const ref = useRef<HTMLDivElement>(null);

    const currentUrl = window.location.pathname;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const showEditAlert = () => {
        withReactContent(Swal)
            .fire({
                title: 'Ingresa el nuevo nombre de tu tablero',
                input: 'text',
                inputValue: currentBoard.name,
                inputPlaceholder: 'Ej: Proyecto Web',
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
                customClass: {
                    container: '!bg-black/70',
                    title: '!text-xl',
                    popup: 'dark:!bg-neutral-800 dark:!text-gray-200',
                    confirmButton: '!bg-green-600',
                    validationMessage: '!text-red-500 dark:!bg-red-500 dark:!text-white !text-sm !mt-2',
                },
                preConfirm: async (value) => {
                    if (!value) {
                        Swal.showValidationMessage('Por favor ingresa un nombre');
                        return false;
                    }

                    const response: ResponseResult = await editBoard(currentBoard.id, value);
                    if (!response.ok) {
                        if (response.errors != null) {
                            const errors: ApiErrorResponse = response.errors;
                            const message = errors.message;
                            Swal.showValidationMessage(message);
                            return false;
                        }
                    }
                    //router.visit(`/boards/${response.id}`);
                },
                allowOutsideClick: () => !Swal.isLoading(),
            })
            .then((result) => {
                if (result.isConfirmed) {
                    console.log('Tablero editado:', result.value);
                }
            });
    };

    const showDeleteAlert = () => {
        withReactContent(Swal)
            .fire({
                title: '¿Quieres eliminar el tablero?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
                customClass: {
                    container: '!bg-black/70',
                    title: '!text-xl',
                    popup: 'dark:!bg-neutral-800 dark:!text-gray-200',
                    confirmButton: '!bg-green-600',
                    validationMessage: '!text-red-500 dark:!bg-red-500 dark:!text-white !text-sm !mt-2',
                },
                preConfirm: async (value) => {
                    if (!value) {
                        Swal.showValidationMessage('Por favor ingresa un nombre');
                        return false;
                    }

                    const response: ResponseResult = await deleteBoard(currentBoard.id);
                    if (!response.ok) {
                        if (response.errors != null) {
                            const errors: ApiErrorResponse = response.errors;
                            const message = errors.message;
                            Swal.showValidationMessage(message);
                            return false;
                        }
                    }
                    router.visit('/');
                },
                allowOutsideClick: () => !Swal.isLoading(),
            })
            .then((result) => {
                if (result.isConfirmed) {
                    console.log('Tablero eliminado:', result.value);
                }
            });
    };

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex w-full items-center gap-2">
                {isMobile && <SidebarTrigger className="-ml-1" />}
                {currentBoard ? (
                    <div className="relative flex w-full items-center justify-between md:flex-row md:gap-2">
                        <h2 className="text-lg lg:text-xl">{currentBoard.name}</h2>
                        {!isLocal && (
                            <>
                                <button aria-label="Show action menu" onClick={() => setShowMenu((prev) => !prev)} className="block md:hidden">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                                        <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                                        <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                                    </svg>
                                </button>
                                <div
                                    ref={ref}
                                    className={`md:gap-2 lg:gap-5 ${showMenu ? 'absolute top-0 right-0 z-10 flex flex-col items-start gap-2 rounded bg-white p-2 shadow-md dark:bg-neutral-800' : 'hidden md:flex'}`}
                                >
                                    <button onClick={() => showEditAlert()} className="flex flex-row-reverse items-center lg:text-base">
                                        <span>Editar</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={isMobile ? 25 : 30}
                                            height={isMobile ? 25 : 30}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                                            <path d="M13.5 6.5l4 4" />
                                        </svg>
                                    </button>

                                    <button onClick={() => showDeleteAlert()} className="flex flex-row-reverse items-center lg:text-base">
                                        <span>Eliminar</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={isMobile ? 25 : 30}
                                            height={isMobile ? 25 : 30}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M4 7l16 0" />
                                            <path d="M10 11l0 6" />
                                            <path d="M14 11l0 6" />
                                            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                        </svg>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <h2 className="text-lg text-neutral-500 dark:text-neutral-600">{currentUrl === '/' ? 'Selecciona un tabero' : ''} </h2>
                )}
            </div>
        </header>
    );
}
