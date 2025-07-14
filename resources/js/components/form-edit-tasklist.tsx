import { useTaskBoard } from '@/hooks/useTaskBoard';
import { ApiErrorResponse, TaskListType } from '@/types';
import React, { useState } from 'react';
import ButtonCancel from './ui/button-cancel';
import ButtonSubmit from './ui/button-submit';
import ErrorMessage from './ui/errorMessage';

export default function FormEditTasklist({ taskList, onCancel }: { taskList: TaskListType; onCancel: CallableFunction }) {
    const [taskListName, setTaskListName] = useState<string>(taskList.name);
    const [taskListDescription, setTaskListDescription] = useState<string | null>(taskList.description);
    const [validationErrors, setValidationErrors] = useState<ApiErrorResponse | null>(null);

    const { updateTaskList, processing } = useTaskBoard();

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTaskListName(e.target.value);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTaskListDescription(e.target.value);
    };

    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { ok, errors } = await updateTaskList({
            ...taskList,
            name: taskListName,
            description: taskListDescription,
        });

        if (!ok) {
            setValidationErrors(errors);
            return;
        }

        onCancel();
    };

    return (
        <form onSubmit={handleSubmitForm} className="mb-7 rounded border-2 border-dotted border-neutral-500 p-2">
            <div className="flex flex-col gap-2">
                <label htmlFor="name">Nombre</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={taskListName}
                    onChange={handleNameChange}
                    placeholder="Ingresa el nombre de tu lista"
                    className="w-full rounded-xs bg-gray-200 px-2 py-0.5 text-black focus:outline focus:outline-cyan-500 dark:bg-neutral-600 dark:text-white focus:dark:outline-cyan-200"
                />
                {validationErrors?.errors.name && <ErrorMessage> {validationErrors?.errors.name} </ErrorMessage>}
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="description">Descripción</label>
                <textarea
                    name="description"
                    id="description"
                    value={taskListDescription ?? ''}
                    onChange={handleDescriptionChange}
                    placeholder="Ingresa una descripcion para tu lista"
                    className="w-full rounded-xs bg-gray-200 px-2 py-0.5 text-black focus:outline focus:outline-cyan-500 dark:bg-neutral-600 dark:text-white focus:dark:outline-cyan-200"
                ></textarea>
                {validationErrors?.errors.description && <ErrorMessage> {validationErrors?.errors.description} </ErrorMessage>}
            </div>
            <div className="mt-2 flex justify-between">
                <ButtonSubmit value="Aceptar" disabled={processing} />
                <ButtonCancel
                    value="Cancelar"
                    disabled={processing}
                    onClick={() => {
                        onCancel();
                        setValidationErrors(null);
                    }}
                />
            </div>
        </form>
    );
}
