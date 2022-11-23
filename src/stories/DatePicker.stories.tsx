import React from "react";
import { Story, Meta } from "@storybook/react";
import { Form, DatePickerInput, DatePickerInputProps } from "../../src";
import { Button } from "reactstrap";

export default {
  title: "Components",
  component: DatePickerInput,
} as Meta;

interface FormInterface {
  name: string;
}

const Template: Story<DatePickerInputProps<FormInterface>> = (args) => (
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
} as DatePickerInputProps<FormInterface>;
DatePickerExample.decorators = [
  (StoryComponent) => (
    <React.Fragment>
      <StoryComponent />
    </React.Fragment>
  ),
];
