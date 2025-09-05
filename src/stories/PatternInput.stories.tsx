import React from "react";
import { StoryFn, Meta } from "@storybook/react-webpack5";
import { Form, FormattedInput, FormattedInputProps } from "../../src";
import { Button } from "reactstrap";

export default {
  title: "Components",
  component: FormattedInput,
} as Meta;

interface FormInterface {
  name: string;
}

const Template: StoryFn<FormattedInputProps<FormInterface>> = (args) => (
  // eslint-disable-next-line react/jsx-no-useless-fragment
  <React.Fragment>
    <Form onSubmit={(data) => alert(JSON.stringify(data, null, 2))}>
      <FormattedInput {...args} />

      <Button type="submit">Submit</Button>
    </Form>
  </React.Fragment>
);

export const PatternInputExample = Template.bind({});
PatternInputExample.args = {
  name: "name",
  label: "FormattedInput Label",
  numericFormat: {
    thousandSeparator: "'",
  },
  disabled: false,
} as FormattedInputProps<FormInterface>;
PatternInputExample.decorators = [
  (StoryComponent) => (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <React.Fragment>
      <StoryComponent />
    </React.Fragment>
  ),
];
