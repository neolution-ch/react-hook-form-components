const getSelectedTextFromInputField = (input: JQuery<HTMLElement>): string => {
  var inputField = input[0] as HTMLInputElement;

  return inputField.selectionStart !== undefined && inputField.selectionEnd !== null
    ? inputField.value.substring(inputField.selectionStart ?? 0, inputField.selectionEnd ?? 0)
    : "";
};

export { getSelectedTextFromInputField };
