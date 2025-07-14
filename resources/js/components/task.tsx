import { useTaskBoard } from '@/hooks/useTaskBoard';
import type { TaskType } from '@/types';
import CheckIcon from './icons/check-icon';
import CloseIcon from './icons/close-icon';

export default function Task({ task }: { task: TaskType }) {
    const { toggleComplete, processing, deleteTask } = useTaskBoard();

    return (
        <li className="group flex items-center justify-between gap-2 rounded bg-gray-100 p-2 dark:bg-neutral-700">
            <div className="flex items-center gap-2 lg:gap-3">
                <button
                    disabled={processing}
                    onClick={() => {
                        toggleComplete(task);
                    }}
                    className={`h-fit min-h-[21px] w-fit min-w-[21px] rounded-full border border-gray-400 p-0.5 ${task.complete ? 'bg-green-500 text-white dark:bg-green-700' : 'bg-gray-200 text-transparent dark:bg-neutral-800'} ${processing ? 'cursor-progress opacity-50' : 'cursor-pointer'}`}
                >
                    {task.complete && <CheckIcon />}
                </button>
                <p className={task.complete ? 'text-gray-400 line-through dark:text-neutral-400' : ''}>{task.title}</p>
            </div>
            <div className="flex min-h-5 min-w-5 items-center justify-center">
                <button
                    onClick={() => deleteTask(task)}
                    disabled={processing}
                    className={`hidden rounded-full group-hover:block ${processing ? 'cursor-progress opacity-50' : 'cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-600'}`}
                >
                    <CloseIcon />
                </button>
            </div>
        </li>
    );
}
