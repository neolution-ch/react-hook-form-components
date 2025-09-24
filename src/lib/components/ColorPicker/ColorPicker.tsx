import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import PopupState, { bindPopover } from "material-ui-popup-state";
import { ColorPickerButton } from "./ColorPickerButton";
import { FieldError, FieldValues, get, useController } from "react-hook-form";
import { ColorPickerInputProps } from "../../ColorPickerInput";
import { useMarkOnFocusHandler } from "../../hooks/useMarkOnFocusHandler";
import { textFieldBootstrapStyle } from "../../helpers/mui";
import { useFormContext } from "../../context/FormContext";
import { useMemo } from "react";
import { TinyColor } from "@ctrl/tinycolor";
import Popover from "@mui/material/Popover";
import Colorful from "@uiw/react-color-colorful"; // must be imported as default, otherwise it will provide a runtime error in nextjs

const getColorByFormat = <T extends FieldValues>(color: TinyColor, format: ColorPickerInputProps<T>["format"]) => {
  switch (format) {
    case "hex":
      return color.toHexString();
    case "rgb":
      return color.toRgbString();
    default:
      throw new Error(`Unsupported color format: ${String(format)}`);
  }
};

const ColorPicker = <T extends FieldValues>(props: ColorPickerInputProps<T>) => {
  const {
    convertColorToFormatOrUndefinedOnBlur = true,
    name,
    id,
    label,
    disabled,
    helpText,
    onChange: propsOnChange,
    onBlur: propsOnBlur,
    style,
    markAllOnFocus,
    className = "",
    useBootstrapStyle = false,
    hideValidationMessage,
    placeholder,
    format,
  } = props;
  const {
    control,
    disabled: formDisabled,
    getFieldState,
    setValue,
    requiredFields,
    formState: { errors },
    hideValidationMessages,
  } = useFormContext();
  const focusHandler = useMarkOnFocusHandler(markAllOnFocus);
  const {
    field: { ref, ...field },
  } = useController({
    name,
    control,
    rules: {
      validate: {
        required: () => getFieldState(name)?.error?.message,
      },
    },
  });

  const isDisabled = formDisabled || disabled;
  const color = useMemo(() => new TinyColor(field.value), [field.value]);
  const fieldError = get(errors, name) as FieldError | undefined;
  const hideErrorMessage = useMemo(() => hideValidationMessages || hideValidationMessage, [hideValidationMessages, hideValidationMessage]);
  const hasError = useMemo(() => !!fieldError, [fieldError]);
  const errorMessage = useMemo(() => String(fieldError?.message), [fieldError]);
  const fieldIsRequired = label && typeof label === "string" && requiredFields.includes(name);
  const finalLabel = useMemo(() => (fieldIsRequired ? `${String(label)} *` : label), [fieldIsRequired, label]);

  return (
    <PopupState variant="popover" popupId={`popover-${name}`}>
      {(popupState) => (
        <>
          <TextField
            {...field}
            id={id}
            fullWidth
            className={`MuiColorInput-TextField ${className}`}
            sx={{ ...(useBootstrapStyle && textFieldBootstrapStyle) }}
            style={style}
            error={hasError}
            label={useBootstrapStyle ? undefined : finalLabel}
            helperText={hasError && !hideErrorMessage ? errorMessage : helpText}
            placeholder={placeholder}
            disabled={isDisabled}
            onFocus={focusHandler}
            onChange={(e) => {
              if (propsOnChange) {
                propsOnChange(e.target.value);
              }

              field.onChange(e);
            }}
            onBlur={(e) => {
              if (convertColorToFormatOrUndefinedOnBlur) {
                setValue(name, (color.isValid ? getColorByFormat(color, format) : undefined) as never); // Need to cast as never as type is too complex
              }

              if (propsOnBlur) {
                propsOnBlur(e);
              }

              field.onBlur();
            }}
            value={field.value}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <ColorPickerButton color={color} disabled={isDisabled} popupState={popupState} />
                  </InputAdornment>
                ),
              },
            }}
            inputRef={ref}
          />
          <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <Colorful
              disableAlpha
              color={color.isValid ? color.toHexString() : undefined}
              onChange={(value) => {
                const tinyColor = new TinyColor(value.hex);
                let color: string;
                switch (format) {
                  case "hex":
                    color = tinyColor.toHexString();
                    break;
                  case "rgb":
                    color = tinyColor.toRgbString();
                    break;
                  default:
                    throw new Error(`Unsupported color format: ${String(format)}`);
                }

                if (propsOnChange) {
                  propsOnChange(color);
                }

                // we cannot use field.onChange here because the color picker doesn't return an event
                setValue(name, color as never); // Need to cast as never as type is too complex
              }}
            />
          </Popover>
        </>
      )}
    </PopupState>
  );
};

export { ColorPicker };
