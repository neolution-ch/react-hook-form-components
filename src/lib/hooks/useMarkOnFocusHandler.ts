import { FocusEvent, FocusEventHandler } from "react";

const useMarkOnFocusHandler = (
  markOnFocus?: boolean,
  defaultHandler?: (e: FocusEvent<HTMLInputElement, Element>) => void,
): FocusEventHandler<HTMLInputElement> | undefined => {
  if (markOnFocus !== true) {
    return defaultHandler;
  }

  return (event: FocusEvent<HTMLInputElement, Element>) => {
    (event.target ?? event.currentTarget).select();
    if (defaultHandler) {
      defaultHandler(event);
    }
  };
};

export { useMarkOnFocusHandler };
