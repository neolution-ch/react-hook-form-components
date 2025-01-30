import React from "react";
import { Story, Meta } from "@storybook/react";
import { Form, FormattedInput, FormattedInputProps } from "../../src";
import { Button } from "reactstrap";

export default {
  title: "Components",
  component: FormattedInput,
} as Meta;

interface FormInterface {
  name: string;
}

const Template: Story<FormattedInputProps<FormInterface>> = (args) => (
  <React.Fragment>
    <Form onSubmit={(data) => alert(JSON.stringify(data, undefined, 2))}>
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
    <React.Fragment>
      <StoryComponent />
    </React.Fragment>
  ),
];
