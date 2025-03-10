import { TinyColor } from "@ctrl/tinycolor";
import Button from "@mui/material/Button";
import { bindTrigger } from "material-ui-popup-state";
import { PopupState } from "material-ui-popup-state/hooks";

interface ColorPickerButtonProps {
  popupState: PopupState;
  color: TinyColor;
  disabled?: boolean;
}

const BG_IMAGE_FALLBACK =
  "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(135deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(135deg, transparent 75%, #ccc 75%) /*! @noflip */";

const ColorPickerButton = (props: ColorPickerButtonProps) => {
  const { popupState, color, disabled } = props;
  console.log(popupState);
  return (
    <Button
      {...bindTrigger(popupState)}
      variant="text"
      aria-describedby="color"
      style={{
        backgroundColor: color.isValid ? color.toHexString() : undefined,
        backgroundImage: color.isValid ? undefined : BG_IMAGE_FALLBACK,
        backgroundSize: "8px 8px",
        backgroundPosition: "0 0, 4px 0, 4px -4px, 0px 4px",
        transition: "none",
        boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
        border: 0,
        borderRadius: 4,
        width: "24px",
        aspectRatio: "1 / 1",
        height: "24px",
        minWidth: 0,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
        }
      }}
    />
  );
};

export { ColorPickerButton };
