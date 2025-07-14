import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { BoardType, type BreadcrumbItem } from '@/types';

import { TaskBoardProvider } from '@/hooks/useTaskBoard';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: '/settings/appearance',
    },
];

export default function Appearance({ board, boards }: { boards: BoardType[]; board: BoardType }) {
    return (
        <TaskBoardProvider initialBoards={boards} initialBoard={board}>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Configuración de apariencia" />

                <SettingsLayout>
                    <div className="space-y-6">
                        <HeadingSmall title="Configuración de apariencia" description="Actualiza la configuración de apariencia de tu cuenta" />
                        <AppearanceTabs />
                    </div>
                </SettingsLayout>
            </AppLayout>
        </TaskBoardProvider>
    );
}
