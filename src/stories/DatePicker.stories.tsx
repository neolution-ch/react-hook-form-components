import React from "react";
import { StoryFn, Meta } from "@storybook/react-webpack5";
import { Form, DatePickerInput, DatePickerInputProps } from "../../src";
import { Button } from "reactstrap";

export default {
  title: "Components",
  component: DatePickerInput,
} as Meta;

interface FormInterface {
  name: string;
}

const Template: StoryFn<DatePickerInputProps<FormInterface>> = (args) => (
  // eslint-disable-next-line react/jsx-no-useless-fragment
  <React.Fragment>
    <Form onSubmit={(data) => alert(JSON.stringify(data, null, 2))}>
      <DatePickerInput {...args} />

      <Button type="submit">Submit</Button>
    </Form>
  </React.Fragment>
);

export const DatePickerExample = Template.bind({});
DatePickerExample.args = {
  name: "name",
  label: "DatePickerInput Label",
  disabled: false,
} as DatePickerInputProps<FormInterface>;
DatePickerExample.decorators = [
  (StoryComponent) => (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <React.Fragment>
      <StoryComponent />
    </React.Fragment>
  ),
];
