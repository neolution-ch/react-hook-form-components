import { ReactNode, CSSProperties } from "react";
import { InputGroupText } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {IconDefinition} from "@fortawesome/fontawesome-common-types";
export interface AddonInputFormProps {
  icon?: IconDefinition;
  iconSize?: string;
  inputGroupStyle?: CSSProperties;
  iconOnClick?: () => void;
  customElement?: ReactNode;
  inputGroupClassName?: React.HTMLAttributes<never>["className"];
}

const AddonInputForm = (props: AddonInputFormProps) => {
  const { icon, iconSize = "lg", iconOnClick, customElement, inputGroupStyle, inputGroupClassName = "rounded-end" } = props;
  if (!icon && !customElement) {
    throw new Error("Icon or CustomElement must be defined");
  }
  return (
    <InputGroupText className={inputGroupClassName} style={inputGroupStyle}>
      {!customElement
        ? <FontAwesomeIcon
          size={iconSize}
          icon={icon as IconDefinition}
          role={iconOnClick ? "button" : ""}
          onClick={() => {
            if (iconOnClick) {
              iconOnClick();
            }
          }}
        />
        : customElement
      }
    </InputGroupText>
  )
}

export default AddonInputForm;
