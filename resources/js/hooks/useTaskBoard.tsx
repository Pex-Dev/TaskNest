import type { ApiErrorResponse, BoardType, ResponseResult, TaskListType, TaskType } from '@/types';
import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

interface TaskBoardContextType {
    processing: boolean;
    boards: BoardType[];
    currentBoard: BoardType;
    addBoard: (name: string) => Promise<ResponseResult>;
    editBoard: (id: number, name: string) => Promise<ResponseResult>;
    deleteBoard: (id: number) => Promise<ResponseResult>;
    addTaskList: (name: string) => Promise<ResponseResult>;
    updateTaskList: (taskList: TaskListType) => Promise<ResponseResult>;
    deleteTaskList: (taskList: TaskListType) => void;
    addTask: (task_list_id: number, title: string) => Promise<ResponseResult>;
    deleteTask: (task: TaskType) => void;
    toggleComplete: (task: TaskType) => void;
    isLocal: boolean;
}

interface Props {
    children: React.ReactNode;
    initialBoards: BoardType[];
    initialBoard: BoardType;
    local?: boolean;
}

const TaskBoardContext = createContext<TaskBoardContextType | undefined>(undefined);

export const useTaskBoard = () => {
    const context = useContext(TaskBoardContext);
    if (!context) {
        throw new Error('No se puede usar fuera del provider');
    }
    return context;
};

export function TaskBoardProvider({ children, initialBoards, initialBoard, local = false }: Props) {
    const [boards, setBoards] = useState<BoardType[]>(initialBoards);
    const [currentBoard, setCurrentBoard] = useState<BoardType>(initialBoard);
    const [processing, setProcessing] = useState<boolean>(false);
    const [isLocal, setIsLocal] = useState<boolean>(local);

    useEffect(() => {
        //Guardar los cambios en el tablero si esta en modo Local
        if (isLocal && currentBoard) {
            localStorage.setItem('board', JSON.stringify(currentBoard));
        }
    }, [currentBoard]);

    function isApiErrorResponse(data: any): data is ApiErrorResponse {
        return (
            typeof data === 'object' && data !== null && typeof data.message === 'string' && typeof data.errors === 'object' && data.errors !== null
        );
    }

    const addBoard = (name: string): Promise<ResponseResult> => {
        setProcessing(true);
        return axios
            .post('/boards', { name })
            .then((response) => {
                setProcessing(false);
                return {
                    ok: false,
                    errors: null,
                    id: response.data.board.id,
                };
            })
            .catch((error) => {
                setProcessing(false);
                return {
                    ok: false,
                    errors: isApiErrorResponse(error.response.data) ? error.response.data : null,
                };
            });
    };

    const editBoard = (id: number, name: string): Promise<ResponseResult> => {
        setProcessing(true);
        return axios
            .post(`/boards/${id}`, { _method: 'put', name })
            .then((response) => {
                setProcessing(false);
                //Actualizar state
                setBoards((prev) =>
                    prev.map((board) => {
                        if (board.id != id) {
                            return board;
                        }
                        return {
                            ...board,
                            name,
                        };
                    }),
                );
                setCurrentBoard({ ...currentBoard, name });
                return {
                    ok: false,
                    errors: null,
                    id: response.data.board.id,
                };
            })
            .catch((error) => {
                setProcessing(false);
                return {
                    ok: false,
                    errors: isApiErrorResponse(error.response.data) ? error.response.data : null,
                };
            });
    };

    const deleteBoard = (id: number): Promise<ResponseResult> => {
        setProcessing(true);
        return axios
            .post(`/boards/${id}`, { _method: 'delete' })
            .then((response) => {
                //Actualizar el state
                setBoards((prev) => prev.filter((board) => board.id !== id));

                return {
                    ok: true,
                    errors: null,
                };
            })
            .catch((error) => {
                setProcessing(false);
                return {
                    ok: false,
                    errors: isApiErrorResponse(error.response.data) ? error.response.data : null,
                };
            });
    };

    const addTaskList = (name: string): Promise<ResponseResult> => {
        setProcessing(true);

        if (isLocal) {
            return new Promise<ResponseResult>((resolve) => {
                const fakeId = Date.now();
                const newTaskList: TaskListType = {
                    id: fakeId,
                    name,
                    tasks: [],
                    description: '',
                };

                setCurrentBoard((prevBoard) => ({
                    ...prevBoard,
                    task_lists: [...prevBoard.task_lists, newTaskList],
                }));

                setProcessing(false);

                resolve({
                    ok: true,
                    errors: null,
                });
            });
        }

        return axios
            .post('/task-list', { board_id: currentBoard.id, name })
            .then((response) => {
                const newTaskList: TaskListType = response.data.taskList;

                setCurrentBoard((prevBoard) => {
                    return {
                        ...prevBoard,
                        task_lists: [...prevBoard.task_lists, newTaskList],
                    };
                });

                setProcessing(false);
                return {
                    ok: true,
                    errors: null,
                };
            })
            .catch((error) => {
                console.log(error);
                setProcessing(false);
                return {
                    ok: false,
                    errors: isApiErrorResponse(error.response.data) ? error.response.data : null,
                };
            });
    };

    const updateTaskList = (updatedTaskList: TaskListType): Promise<ResponseResult> => {
        setProcessing(true);

        if (isLocal) {
            return new Promise<ResponseResult>((resolve) => {
                //Obtener lista de tareas
                let currentTaskLists: TaskListType[] = [...currentBoard.task_lists];

                //Actulizar la lista de tareas
                currentTaskLists = currentTaskLists.map((taskList) => {
                    if (taskList.id !== updatedTaskList.id) return taskList;

                    return updatedTaskList;
                });

                //Actualizar la lista de tareas al tablero
                setCurrentBoard((prevBoard) => {
                    return {
                        ...prevBoard,
                        task_lists: currentTaskLists,
                    };
                });

                setProcessing(false);
                resolve({
                    ok: true,
                    errors: null,
                });
            });
        }

        return axios
            .post(`/task-list/${updatedTaskList.id}`, {
                _method: 'put',
                name: updatedTaskList.name,
                description: updatedTaskList.description,
            })
            .then((response) => {
                //Obtener lista de tareas
                let currentTaskLists: TaskListType[] = [...currentBoard.task_lists];

                //Actulizar la lista de tareas
                currentTaskLists = currentTaskLists.map((taskList) => {
                    if (taskList.id !== updatedTaskList.id) return taskList;

                    return updatedTaskList;
                });

                //Actualizar la lista de tareas al tablero
                setCurrentBoard((prevBoard) => {
                    return {
                        ...prevBoard,
                        task_lists: currentTaskLists,
                    };
                });

                setProcessing(false);
                return {
                    ok: true,
                    errors: null,
                };
            })
            .catch((error) => {
                if (isApiErrorResponse(error.response.data)) {
                    const errors = error.response.data;
                } else {
                    console.log('Error respuesta desconocida');
                }
                setProcessing(false);
                return {
                    ok: false,
                    errors: isApiErrorResponse(error.response.data) ? error.response.data : null,
                };
            });
    };

    const deleteTaskList = (taskList: TaskListType) => {
        setProcessing(true);

        if (isLocal) {
            //Obtener lista de tareas
            let currentTaskLists: TaskListType[] = [...currentBoard.task_lists];

            //Eliminar la lista de tareas
            currentTaskLists = currentTaskLists.filter((prevTaskList) => prevTaskList.id !== taskList.id);

            //Actualizar la lista de tareas al tablero
            setCurrentBoard((prevBoard) => {
                return {
                    ...prevBoard,
                    task_lists: currentTaskLists,
                };
            });
            setProcessing(false);
            return;
        }

        axios
            .post(`/task-list/${taskList.id}`, { _method: 'delete' })
            .then((response) => {
                //Obtener lista de tareas
                let currentTaskLists: TaskListType[] = [...currentBoard.task_lists];

                //Eliminar la lista de tareas
                currentTaskLists = currentTaskLists.filter((prevTaskList) => prevTaskList.id !== taskList.id);

                //Actualizar la lista de tareas al tablero
                setCurrentBoard((prevBoard) => {
                    return {
                        ...prevBoard,
                        task_lists: currentTaskLists,
                    };
                });
                setProcessing(false);
            })
            .catch((error) => {
                setProcessing(false);
                console.log(error);
            });
    };

    const addTask = (task_list_id: number, title: string): Promise<ResponseResult> => {
        setProcessing(true);

        if (isLocal) {
            return new Promise<ResponseResult>((resolve) => {
                setProcessing(false);

                const fakeId = Date.now();
                const newTask: TaskType = {
                    id: fakeId,
                    task_list_id: task_list_id,
                    title: title,
                    complete: false,
                    description: '',
                };

                //Obtener lista de tareas
                let currentTaskLists: TaskListType[] = [...currentBoard.task_lists];

                //Añadir nueva tarea a la lista
                currentTaskLists = currentTaskLists.map((taskList) => {
                    if (taskList.id !== task_list_id) return taskList;

                    return {
                        ...taskList,
                        tasks: [...taskList.tasks, newTask],
                    };
                });

                //Actualizar la lista de tareas al tablero
                setCurrentBoard((prevBoard) => {
                    return {
                        ...prevBoard,
                        task_lists: currentTaskLists,
                    };
                });

                resolve({
                    ok: true,
                    errors: null,
                });
            });
        }

        return axios
            .post('/task', { task_list_id, title })
            .then((response) => {
                setProcessing(false);
                if (response.data.task) {
                    const newTask: TaskType = response.data.task;

                    //Obtener lista de tareas
                    let currentTaskLists: TaskListType[] = [...currentBoard.task_lists];

                    //Añadir nueva tarea a la lista
                    currentTaskLists = currentTaskLists.map((taskList) => {
                        if (taskList.id !== task_list_id) return taskList;

                        return {
                            ...taskList,
                            tasks: [...taskList.tasks, newTask],
                        };
                    });

                    //Actualizar la lista de tareas al tablero
                    setCurrentBoard((prevBoard) => {
                        return {
                            ...prevBoard,
                            task_lists: currentTaskLists,
                        };
                    });

                    return {
                        ok: true,
                        errors: null,
                    };
                }
                return {
                    ok: false,
                    errors: null,
                };
            })
            .catch((error) => {
                setProcessing(false);
                return {
                    ok: false,
                    errors: isApiErrorResponse(error.response.data) ? error.response.data : null,
                };
            });
    };

    const toggleComplete = (task: TaskType) => {
        if (processing) return;

        //Guardar task actual por si ocurre un error
        const previousTask = task;

        //Actualizar el estado de una
        const updatedTask: TaskType = { ...task, complete: !task.complete };

        //Actualizar task de una
        updateTask(updatedTask);

        //Si esta en modo local no es necesario hacer nada más
        if (isLocal) return;

        setProcessing(true);

        axios
            .post(`/task/${task.id}/toggle`, { _method: 'put' })
            .then(() => {
                setProcessing(false);
            })
            .catch((error) => {
                console.log(error);

                updateTask(previousTask);
                setProcessing(false);
            });
    };

    const deleteTask = (task: TaskType) => {
        if (processing) return;
        setProcessing(true);

        if (isLocal) {
            //Obtener lista de tareas
            let currentTaskLists: TaskListType[] = [...currentBoard.task_lists];

            //Eliminar tarea de la lista
            currentTaskLists = currentTaskLists.map((taskList) => {
                if (taskList.id !== task.task_list_id) return taskList;

                return {
                    ...taskList,
                    tasks: taskList.tasks.filter((prevTask) => prevTask.id !== task.id),
                };
            });

            //Actualizar la lista de tareas al tablero
            setCurrentBoard((prevBoard) => {
                return {
                    ...prevBoard,
                    task_lists: currentTaskLists,
                };
            });

            setProcessing(false);
            return;
        }

        axios
            .post(`/task/${task.id}`, { _method: 'put' })
            .then((response) => {
                //Obtener lista de tareas
                let currentTaskLists: TaskListType[] = [...currentBoard.task_lists];

                //Eliminar tarea de la lista
                currentTaskLists = currentTaskLists.map((taskList) => {
                    if (taskList.id !== task.task_list_id) return taskList;

                    return {
                        ...taskList,
                        tasks: taskList.tasks.filter((prevTask) => prevTask.id !== task.id),
                    };
                });

                //Actualizar la lista de tareas al tablero
                setCurrentBoard((prevBoard) => {
                    return {
                        ...prevBoard,
                        task_lists: currentTaskLists,
                    };
                });

                setProcessing(false);
            })
            .catch((error) => {
                console.log(error);
                setProcessing(false);
            });
    };

    const updateTask = (newTask: TaskType) => {
        //Obtener lista de tareas
        let currentTaskLists: TaskListType[] = [...currentBoard.task_lists];

        //Actualizar tarea en la lista
        currentTaskLists = currentTaskLists.map((taskList) => {
            if (taskList.id !== newTask.task_list_id) return taskList;

            return {
                ...taskList,
                tasks: taskList.tasks.map((prevTask) => {
                    if (prevTask.id !== newTask.id) return prevTask;

                    return newTask;
                }),
            };
        });

        //Actualizar la lista de tareas al tablero
        setCurrentBoard((prevBoard) => {
            return {
                ...prevBoard,
                task_lists: currentTaskLists,
            };
        });
    };

    return (
        <TaskBoardContext.Provider
            value={{
                isLocal,
                boards,
                currentBoard,
                processing,
                addBoard,
                editBoard,
                deleteBoard,
                addTask,
                deleteTask,
                addTaskList,
                updateTaskList,
                deleteTaskList,
                toggleComplete,
            }}
        >
            {children}
        </TaskBoardContext.Provider>
    );
}
