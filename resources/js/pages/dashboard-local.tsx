import FormTaskList from '@/components/form-task-list';
import TaskListsBoard from '@/components/task-lists-board';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { TaskBoardProvider } from '@/hooks/useTaskBoard';
import AppLayout from '@/layouts/app-layout';
import { type BoardType, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/local',
    },
];

export default function DashboardLocal() {
    const storedBoard = localStorage.getItem('board');

    const board: BoardType | null = storedBoard ? (JSON.parse(storedBoard) as BoardType) : null;

    const boards: BoardType[] = [
        board
            ? board
            : {
                  id: 1,
                  user_id: 1,
                  name: 'Tablero Local',
                  task_lists: [],
              },
    ];

    return (
        <TaskBoardProvider initialBoards={boards} initialBoard={boards[0]} local={true}>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Tablero Local" />
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 z-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        <div className="relative z-10 h-full overflow-auto p-2 md:p-4">
                            {boards[0] && <FormTaskList />}
                            <TaskListsBoard />
                        </div>
                    </div>
                </div>
            </AppLayout>
        </TaskBoardProvider>
    );
}
