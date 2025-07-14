import { useTaskBoard } from '@/hooks/useTaskBoard';
import { ApiErrorResponse, type TaskListType, type TaskType } from '@/types';
import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import FormEditTasklist from './form-edit-tasklist';
import CloseIcon from './icons/close-icon';
import DotsIcon from './icons/dots-icon';
import PlusIcon from './icons/plus-icon';
import Task from './task';
import ButtonCancel from './ui/button-cancel';
import ButtonSubmit from './ui/button-submit';
import ErrorMessage from './ui/errorMessage';

export default function TaskList({ taskList }: { taskList: TaskListType }) {
    const [showCreateTask, setShowCreateTask] = useState(false);
    const [showDescription, setShowDescription] = useState(false);
    const [showEditTask, setShowEditTask] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const [title, setTitle] = useState('');
    const [validationErrors, setValidationErrors] = useState<ApiErrorResponse | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    const { addTask, deleteTaskList, processing } = useTaskBoard();

    const showConfirmation = (taskList: TaskListType) => {
        withReactContent(Swal)
            .fire({
                title: '¿Quieres eliminar la tarea?',
                showCancelButton: true,
                confirmButtonText: 'Eliminar',
                cancelButtonText: `Cancelar`,
                icon: 'warning',
                customClass: {
                    container: '!bg-black/70',
                    title: '!text-xl',
                    popup: 'dark:!bg-neutral-800  dark:!text-gray-200',
                    confirmButton: '!bg-green-600',
                },
            })
            .then((result) => {
                if (result.isConfirmed) {
                    setShowActions(false);
                    deleteTaskList(taskList);
                }
            });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    //Hacer focus en el input si se abre el formulario
    useEffect(() => {
        if (showCreateTask) {
            inputRef.current?.focus();
        }
    }, [showCreateTask]);

    //Manejar el envio del formulario
    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { ok, errors } = await addTask(taskList.id, title);
        if (!ok) {
            setValidationErrors(errors);
            return;
        }
        setShowCreateTask(false);
        setValidationErrors(null);
        setTitle('');
    };

    return (
        <li className="h-fit w-full min-w-[300px] rounded-md border border-gray-300 bg-white p-2 text-gray-700 shadow-md md:max-w-[600px] dark:border-gray-700 dark:bg-neutral-800 dark:text-gray-200">
            {!showEditTask ? (
                <header className="relative mb-2 flex justify-between">
                    <div title={taskList.description ? taskList.description : undefined} className="flex w-full items-center">
                        {/* Botón para mostrar la descripción */}
                        {taskList.description && (
                            <button onClick={() => setShowDescription((prev) => !prev)} aria-label="Mostrar descripción" className="dark:text-white">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="28"
                                    height="28"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M6 9l6 6l6 -6" />
                                </svg>
                            </button>
                        )}
                        {/* Nombre de la lista */}
                        <h3 className="text-black dark:text-white"> {taskList.name} </h3>
                    </div>
                    <button
                        onClick={() => setShowActions(true)}
                        aria-label="Mostrar menú acciones"
                        className="cursor-pointer p-1 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
                    >
                        <DotsIcon />
                    </button>
                    {/* Menu acciones */}
                    {showActions && (
                        <div className="absolute top-0 right-0 min-h-[100px] w-fit min-w-[200px] rounded border border-neutral-300 bg-white p-2 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
                            <header className="flex justify-between gap-3">
                                <h4 className="w-full text-center text-gray-800 dark:text-gray-200">Acciones</h4>

                                <button
                                    onClick={() => setShowActions(false)}
                                    aria-label="Cerrar menú acciones"
                                    className="cursor-pointer rounded-full text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-neutral-700"
                                >
                                    <CloseIcon />
                                </button>
                            </header>
                            <ul className="text-md flex flex-col gap-0.5">
                                <li>
                                    <button
                                        onClick={() => {
                                            setShowEditTask(true);
                                            setShowActions(false);
                                        }}
                                        disabled={processing}
                                        className={`w-full px-1 text-left ${processing ? 'cursor-progress opacity-50' : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700'}`}
                                    >
                                        Editar
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => {
                                            showConfirmation(taskList);
                                        }}
                                        disabled={processing}
                                        className={`w-full px-1 text-left ${processing ? 'cursor-progress opacity-50' : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700'}`}
                                    >
                                        Eliminar
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </header>
            ) : (
                //Form editar
                <FormEditTasklist taskList={taskList} onCancel={() => setShowEditTask(false)} />
            )}
            {showDescription && <p className="mb-2.5 bg-neutral-100 p-2 dark:bg-neutral-600">{taskList.description}</p>}

            <div className="flex flex-col gap-2">
                <ul className="flex flex-col gap-2">
                    {/* Tareas */}
                    {taskList.tasks.map((task: TaskType, index) => (
                        <Task key={index} task={task} />
                    ))}
                </ul>
                {/* Boton Crear tarea */}
                {!showCreateTask && (
                    <button
                        onClick={() => setShowCreateTask(true)}
                        className="flex cursor-pointer justify-between rounded-xs p-2 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-neutral-700"
                    >
                        <PlusIcon />
                        <span>Añadir tarea</span>
                    </button>
                )}
                {/* Form crear tarea */}
                {showCreateTask && (
                    <form onSubmit={handleSubmitForm}>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            ref={inputRef}
                            placeholder="Ingresa tu tarea"
                            onChange={(e) => handleInputChange(e)}
                            className="w-full rounded-xs bg-gray-200 px-2 py-0.5 text-black focus:outline focus:outline-cyan-500 dark:bg-neutral-600 dark:text-white focus:dark:outline-cyan-200"
                        />
                        {validationErrors?.errors.title && <ErrorMessage> {validationErrors?.errors.title} </ErrorMessage>}
                        <div className="mt-2 flex justify-between gap-2">
                            <ButtonSubmit value={'Enviar'} disabled={processing} />
                            <ButtonCancel
                                value={'Cancelar'}
                                disabled={processing}
                                onClick={() => {
                                    setShowCreateTask(false);
                                    setValidationErrors(null);
                                }}
                            />
                        </div>
                    </form>
                )}
            </div>
        </li>
    );
}
