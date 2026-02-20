import React from "react";
import { StoryFn, Meta } from "@storybook/react-webpack5";
import { Form, Input, InputProps } from "../../src";
import { Button } from "reactstrap";

export default {
  title: "Components",
  component: Input,
} as Meta;

interface FormInterface {
  name: string;
}

const Template: StoryFn<InputProps<FormInterface>> = (args) => (
  // eslint-disable-next-line react/jsx-no-useless-fragment
  <React.Fragment>
    <Form onSubmit={(data) => alert(JSON.stringify(data, null, 2))}>
      <Input {...args} />

      <Button type="submit">Submit</Button>
    </Form>
  </React.Fragment>
);

export const InputExample = Template.bind({});
InputExample.args = {
  name: "name",
  label: "Input Label",
  disabled: false,
} as InputProps<FormInterface>;
InputExample.decorators = [
  (StoryComponent) => (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <React.Fragment>
      <StoryComponent />
    </React.Fragment>
  ),
];
