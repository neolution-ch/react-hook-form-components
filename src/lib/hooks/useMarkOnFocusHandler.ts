interface MarkOnFocusEvent {
  currentTarget: HTMLInputElement;
  target?: HTMLInputElement;
}

interface MarkOnFocusSyntheticEvent {
  currentTarget: HTMLInputElement;
}

type MarkOnFocusEventHandler = (event: MarkOnFocusEvent | MarkOnFocusSyntheticEvent) => void;

const useMarkOnFocusHandler = (
  markOnFocus?: boolean,
  defaultHandler?: (e: MarkOnFocusEvent) => void,
): MarkOnFocusEventHandler | undefined => {
  if (markOnFocus !== true) {
    return defaultHandler;
  }

  return (event: MarkOnFocusEvent) => {
    (event.target ?? event.currentTarget).select();
    if (defaultHandler) {
      defaultHandler(event);
    }
  };
};

export { useMarkOnFocusHandler };
