interface LabelValueOptionGroup {
  name: string;
  disabled?: boolean;
}

interface LabelValueOption {
  value?: string | number;
  label: string;
  disabled?: boolean;
  group?: LabelValueOptionGroup;
}

export { LabelValueOption, LabelValueOptionGroup };
