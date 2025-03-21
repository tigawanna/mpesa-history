import { useState } from 'react';

interface MutationState<TData> {
    data: TData | null;
    isPending: boolean;
    error: Error | null;
}

interface MutationOptions<TVariables, TData> {
    mutationFn: (variables: TVariables) => Promise<TData>;
    onSuccess?: (data: TData) => void;
    onError?: (error: Error) => void;  // Added onError callback
}

interface MutationResult<TVariables, TData> extends MutationState<TData> {
    mutate: (variables: TVariables) => Promise<void>;
    reset: () => void;
}

export function useMutation<TVariables = unknown, TData = unknown>(
    options: MutationOptions<TVariables, TData>
): MutationResult<TVariables, TData> {
    const [state, setState] = useState<MutationState<TData>>({
        data: null,
        isPending: false,
        error: null,
    });

    const reset = () => {
        setState({
            data: null,
            isPending: false,
            error: null,
        });
    };

    const mutate = async (variables: TVariables) => {
        try {
            setState(prev => ({ ...prev, isPending: true, error: null }));
            const result = await options.mutationFn(variables);
            setState(prev => ({ ...prev, data: result, isPending: false }));
            options.onSuccess?.(result);
        } catch (error) {
            const normalizedError = error instanceof Error ? error : new Error('Unknown error');
            setState(prev => ({
                ...prev,
                error: normalizedError,
                isPending: false,
            }));
            options.onError?.(normalizedError);  // Added error callback
        }
    };

    return {
        ...state,
        mutate,
        reset,
    };
}
