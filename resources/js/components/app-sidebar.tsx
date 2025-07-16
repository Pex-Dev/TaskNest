import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useTaskBoard } from '@/hooks/useTaskBoard';
import { ApiErrorResponse, ResponseResult, SharedData, type NavItem } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { BookOpen, Folder } from 'lucide-react';
import Swal from 'sweetalert2';

import withReactContent from 'sweetalert2-react-content';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const { url } = usePage();

    const splitedUrl = url.split('/').pop();

    let boardId = 0;

    if (splitedUrl && !isNaN(parseInt(splitedUrl))) {
        boardId = parseInt(splitedUrl);
    }

    const { boards, currentBoard, addBoard, isLocal } = useTaskBoard();

    const { setOpenMobile } = useSidebar();

    const showAlert = () => {
        setOpenMobile(false);
        withReactContent(Swal)
            .fire({
                title: 'Ingresa el nombre de tu tablero',
                input: 'text',
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

                    const response: ResponseResult = await addBoard(value);
                    if (!response.ok) {
                        if (response.errors != null) {
                            const errors: ApiErrorResponse = response.errors;
                            const message = errors.message;
                            Swal.showValidationMessage(message);
                            return false;
                        }
                    }
                    router.visit(`/boards/${response.id}`);
                },
                allowOutsideClick: () => !Swal.isLoading(),
            })
            .then((result) => {
                if (result.isConfirmed) {
                    console.log('Tablero creado:', result.value);
                }
            });
    };

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <AppLogo />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {auth.user && (
                    <button
                        type="button"
                        onClick={() => showAlert()}
                        className={
                            'mx-2 mb-4 cursor-pointer rounded border border-neutral-300 bg-white px-2 py-1 text-gray-700 transition-colors hover:bg-gray-100 lg:mx-0 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-200 dark:hover:bg-neutral-700'
                        }
                    >
                        Crear tablero
                    </button>
                )}

                <span className="pl-2 text-sm text-neutral-700 lg:pl-0 dark:text-neutral-400">Tableros</span>
                <ul className="flex flex-col gap-2 overflow-y-auto">
                    {isLocal ? (
                        <>
                            {boards.map((board, index) => (
                                <li key={index}>
                                    <Link
                                        href={`/boards/${board.id}`}
                                        className={`block w-full px-2 py-1 ${board.id === currentBoard.id ? 'border-r-3 border-r-cyan-500 bg-gray-100 text-neutral-800 dark:border-gray-500 dark:bg-neutral-800 dark:text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800'}`}
                                    >
                                        {board.name}
                                    </Link>
                                </li>
                            ))}
                        </>
                    ) : (
                        <>
                            {boards.map((board, index) => (
                                <li key={index}>
                                    <Link
                                        href={`/boards/${board.id}`}
                                        className={`block w-full px-2 py-1 ${board.id === boardId ? 'border-r-3 border-r-cyan-500 bg-gray-100 text-neutral-800 dark:border-gray-500 dark:bg-neutral-800 dark:text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800'}`}
                                    >
                                        {board.name}
                                    </Link>
                                </li>
                            ))}
                        </>
                    )}
                </ul>
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
