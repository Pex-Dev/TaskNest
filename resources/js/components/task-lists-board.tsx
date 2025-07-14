import { useTaskBoard } from '@/hooks/useTaskBoard';
import type { TaskListType } from '@/types';
import TaskList from './task-list';

export default function TaskListsBoard() {
    const { currentBoard } = useTaskBoard();
    if (!currentBoard || currentBoard.task_lists === null) return;
    const taskLists = currentBoard.task_lists;

    if (taskLists.length === 0) return;

    return (
        <ul className="mt-2 flex w-full flex-col gap-2 md:mt-4 md:w-fit md:flex-row lg:gap-4">
            {taskLists.map((taskList: TaskListType, index) => (
                <TaskList key={index} taskList={taskList} />
            ))}
        </ul>
    );
}
