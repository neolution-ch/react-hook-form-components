import React from "react";
import { StoryFn, Meta } from "@storybook/react-webpack5";
import { Form, StaticTypeaheadInput, StaticTypeaheadInputProps } from "../../src";
import { Button } from "reactstrap";

export default {
  title: "Components",
  component: StaticTypeaheadInput,
} as Meta;

interface FormInterface {
  name: string;
}

const Template: StoryFn<StaticTypeaheadInputProps<FormInterface>> = (args) => (
  // eslint-disable-next-line react/jsx-no-useless-fragment
  <React.Fragment>
    <Form onSubmit={(data) => alert(JSON.stringify(data, null, 2))}>
      <StaticTypeaheadInput {...args} />

      <Button type="submit">Submit</Button>
    </Form>
  </React.Fragment>
);

export const StaticTypeaheadInputExample = Template.bind({});
StaticTypeaheadInputExample.args = {
  name: "name",
  label: "StaticTypeaheadInput Label",
  options: ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"],
  disabled: false,
} as StaticTypeaheadInputProps<FormInterface>;
StaticTypeaheadInputExample.decorators = [
  (StoryComponent) => (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <React.Fragment>
      <StoryComponent />
    </React.Fragment>
  ),
];
