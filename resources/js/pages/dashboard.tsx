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
        href: '/',
    },
];

export default function Dashboard({ board, boards }: { boards: BoardType[]; board: BoardType }) {
    const title: string = board ? board.name : 'Selecciona un tablero';

    return (
        <TaskBoardProvider initialBoards={boards} initialBoard={board}>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={title} />
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 z-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        <div className="relative z-10 h-full overflow-auto p-2 md:p-4">
                            {board && <FormTaskList />}
                            <TaskListsBoard />
                        </div>
                    </div>
                </div>
            </AppLayout>
        </TaskBoardProvider>
    );
}
