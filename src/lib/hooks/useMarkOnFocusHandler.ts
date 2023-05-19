const useMarkOnFocusHandler = (
  markOnFocus?: boolean,
  defaultHandler?: React.FocusEventHandler<HTMLInputElement>,
): React.FocusEventHandler<HTMLInputElement> | undefined => {
  if (markOnFocus !== true) {
    return defaultHandler;
  }

  return (event: React.FocusEvent<HTMLInputElement, Element>) => {
    event.target.select();
    if (defaultHandler) {
      defaultHandler(event);
    }
  };
};

export { useMarkOnFocusHandler };
