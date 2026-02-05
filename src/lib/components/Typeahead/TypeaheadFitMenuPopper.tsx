import Popper, { PopperProps } from "@mui/material/Popper";

const TypeaheadFitMenuPopper = (props: PopperProps) => {
  const { anchorEl } = props;

  return (
    <Popper
      {...props}
      style={{
        // ensure popper is at least as wide as the input field
        minWidth: (anchorEl as HTMLElement)?.clientWidth,
        // ensure popper fits the longest option width
        width: "fit-content",
      }}
      placement="bottom-start"
    />
  );
};

export { TypeaheadFitMenuPopper };
