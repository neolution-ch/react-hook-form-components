import React from "react";
import { Story, Meta } from "@storybook/react";
import { Form, Input, InputProps } from "../../src";
import { Button } from "reactstrap";

export default {
  title: "Components",
  component: Input,
} as Meta;

interface FormInterface {
  name: string;
}

const Template: Story<InputProps<FormInterface>> = (args) => (
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
} as InputProps<FormInterface>;
InputExample.decorators = [
  (StoryComponent) => (
    <React.Fragment>
      <StoryComponent />
    </React.Fragment>
  ),
];
