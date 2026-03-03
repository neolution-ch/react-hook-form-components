import { useCallback, useEffect, useRef } from "react";
import { FieldValues, SubmitHandler, UseFormReturn } from "react-hook-form";
import { Options, useDebouncedCallback } from "use-debounce";

interface UseAutoSubmitProps<T extends FieldValues> {
  /**
   * will be executed when an submit action was triggered
   */
  onSubmit: SubmitHandler<T>;

  /**
   * the form methods of the form
   */
  formMethods: UseFormReturn<T, unknown, T>;

  /**
   * enables the form to do an autosubmit on values changed
   */
  autoSubmitConfig?: AutoSubmitConfig;
}

type AutoSubmitHandler = (e?: React.FormEvent<HTMLFormElement>) => void;

export interface AutoSubmitConfig extends Options {
  /**
   * the waiting time in MS after the last change till the auto submit gets triggered
   */
  wait: number;
}

const useAutoSubmit = <T extends FieldValues>({ onSubmit, formMethods, autoSubmitConfig }: UseAutoSubmitProps<T>): AutoSubmitHandler => {
  const { handleSubmit, watch } = formMethods;
  const isSubmitting = useRef(false);

  const submitHandler = useCallback(
    (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      void (async () => {
        await handleSubmit(onSubmit)(e);
      })();
    },
    [handleSubmit, onSubmit],
  );

  const debouncedSubmitHandler = useDebouncedCallback(
    (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault();

      if (isSubmitting.current) {
        // eslint-disable-next-line react-hooks/immutability
        debouncedSubmitHandler(e);
        return;
      }

      isSubmitting.current = true;
      submitHandler(e);
      isSubmitting.current = false;
    },
    autoSubmitConfig?.wait,
    autoSubmitConfig,
  );

  useEffect(() => {
    if (!autoSubmitConfig) {
      return;
    }

    const subscription = watch(() => {
      debouncedSubmitHandler();
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [watch, submitHandler, debouncedSubmitHandler, autoSubmitConfig]);

  return autoSubmitConfig ? debouncedSubmitHandler : submitHandler;
};

export { useAutoSubmit };
