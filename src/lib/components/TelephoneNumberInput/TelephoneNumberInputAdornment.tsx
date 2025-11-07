import { bindTrigger } from "material-ui-popup-state";
import { PopupState } from "material-ui-popup-state/hooks";
import { useMemo } from "react";
import { Country } from "../../helpers/telephoneNumber";
import InputAdornment from "@mui/material/InputAdornment";

interface TelephoneNumberInputAdornmentProps {
  popupState: PopupState;
  country: Country;
  disabled?: boolean;
}

const TelephoneNumberInputAdornment = (props: TelephoneNumberInputAdornmentProps) => {
  const { popupState, disabled, country } = props;

  const popoverMethods = useMemo(() => bindTrigger(popupState), [popupState]);
  return (
    <InputAdornment
      position="start"
      {...popoverMethods}
      style={{
        transition: "none",
        width: "40px",
        height: "50px",
        paddingRight: "65px",
        minWidth: 0,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
        } else {
          popoverMethods.onClick(e);
        }
      }}
    >
      <div className="d-flex align-items-center">
        <span style={{ fontSize: "22px", marginRight: "5px" }} className={`fi fi-${country.region.toLowerCase()}`}></span>+{country.code}
      </div>
    </InputAdornment>
  );
};

export { TelephoneNumberInputAdornment };
