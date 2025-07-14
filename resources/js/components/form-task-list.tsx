import { useTaskBoard } from '@/hooks/useTaskBoard';
import { ApiErrorResponse } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import ButtonCancel from './ui/button-cancel';
import ButtonSubmit from './ui/button-submit';
import ErrorMessage from './ui/errorMessage';

export default function FormTaskList() {
    const [expanded, setExpanded] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [validationErrors, setValidationErrors] = useState<ApiErrorResponse | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { addTaskList, processing } = useTaskBoard();

    const handleInputNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };
    //Manejar el envio del formulario
    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { ok, errors } = await addTaskList(name);

        if (!ok) {
            setValidationErrors(errors);
            return;
        }

        setName('');
        setValidationErrors(null);
        setExpanded(false);
    };

    //Hacer focus en el input si se abre el formulario
    useEffect(() => {
        if (expanded) {
            inputRef.current?.focus();
        }
    }, [expanded]);

    return (
        <form
            onSubmit={handleSubmitForm}
            className={`flex w-fit flex-col overflow-hidden rounded-md border border-gray-300 bg-white transition-all duration-500 dark:border-gray-700 dark:bg-neutral-800 ${!expanded ? 'max-h-[36px] max-w-[140px]' : 'max-h-[200px] max-w-[800px]'}`}
        >
            {!expanded && (
                <Button
                    type="button"
                    onClick={() => {
                        setExpanded(true);
                    }}
                    className={
                        'cursor-pointer bg-white text-gray-700 shadow-md transition-colors hover:bg-gray-100 dark:bg-neutral-800 dark:text-gray-200 dark:hover:bg-neutral-700'
                    }
                >
                    Crear nueva lista
                </Button>
            )}
            {expanded && (
                <div className="p-2">
                    <input
                        ref={inputRef}
                        type="text"
                        name="name"
                        id="name"
                        value={name}
                        placeholder="Ingresa el nombre de tu lista"
                        onChange={(e) => handleInputNameChange(e)}
                        className="w-full rounded-xs bg-gray-200 px-2 py-0.5 text-black focus:outline focus:outline-cyan-500 dark:bg-neutral-600 dark:text-white focus:dark:outline-cyan-200"
                    />
                    {validationErrors?.errors.name && <ErrorMessage> {validationErrors?.errors.name} </ErrorMessage>}
                    <div className="mt-2 flex justify-between gap-2">
                        <ButtonSubmit value="Aceptar" disabled={processing} />
                        <ButtonCancel
                            value="Cancelar"
                            disabled={processing}
                            onClick={() => {
                                setName('');
                                setExpanded(false);
                            }}
                        />
                    </div>
                </div>
            )}
        </form>
    );
}
