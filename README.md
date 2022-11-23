# react-hook-form-components

The idea of this package is to have a collection of components that can be used with react-hook-form without having to write a lot of boilerplate code.
And also to make the life of the developer easier so they don't have to figure out how to integrate external libraries with react-hook-form.

Supported input types:

- all standard html input types (text, email, number, etc.)
- date picker (react-datepicker)
- typeahead (react-bootstrap-typeahead)
- numeric / pattern formats (react-number-format)

:warning: **Basic usage is also possible without yup but you will have to handle validation and type conversions yourself. So we highly recommend using yup. [See the example below](#usage-with-yup).**

## Documentation

- [Installation](#installation)
- [Getting started](#getting-started)
- [Yup](#usage-with-yup)
- [Typeahead](#typeahead)
- [DatePicker](#datepicker)
- [Numeric and Pattern Format](#numeric-and-pattern-format)
- [Storybook](#storybook)

## Installation

```bash
npm install react-hook-form-components
yarn add react-hook-form-components
```

## Getting started

### Basic usage

```jsx
import { Form, Input } from 'react-hook-form-components';

interface FormInputs {
    testInput: string;
}

....

<Form<FormInputs> onSubmit={(data) => console.log(data)}>
    <Input<FormInputs> name={"testInput"} label={"Test Input"} />
    <input type="submit" />
</Form>
```

## Yup

To use it with yup please install [@hookform/resolvers](https://www.npmjs.com/package/@hookform/resolvers) and [yup](https://www.npmjs.com/package/yup).

To make your life easier you can use the method described in this blog article to get strongly typed validation schema from yup: [Strongly typed validation schema with yup](https://justin.poehnelt.com/posts/strongly-typed-yup-schema-typescript/).

```jsx
import { Form, Input } from 'react-hook-form-components';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface FormInputs {
    numberInput: number;
}

const schema = yup.object({
  // this will trigger validation and show error message if the input is empty
  // it will also convert the input value to a number
  numberInput: yup.number().required(),
});

...

<Form<FormInputs> onSubmit={(data) => console.log(data)} resolver={yupResolver(schema)}>
    <Input<FormInputs> name={"numberInput"} label={"Number Input"} inputType="number" />
    <input type="submit" />
</Form>
```

## Typeahead

To use typeahead you have to include their CSS file in your project:

```jsx
import "react-bootstrap-typeahead/css/Typeahead.css";
```

### Static Typeahead

Use the `StaticTypeaheadInput` component for a static list of options.

```jsx
<StaticTypeaheadInput name="inputName" options={["one", "two"]} label="Static Typeahead" />
```

Options can also be an array of `LabelValueOption` objects. In this case you can have a different label and value.

```jsx
<StaticTypeaheadInput
  name="inputName"
  options={[
    {
      label: "one",
      value: "one",
    },
    {
      label: "two",
      value: "two",
    },
  ]}
  label="Static Typeahead"
/>
```

### Async Typeahead

To use an async typeahead you have to provide a function that returns a promise. The function will be called with the current input value.

```jsx
<AsyncTypeaheadInput
  name="inputName"
  queryFn={async (query) => {
    return ["one", "two"];
  }}
  label="Async Typeahead"
/>
```

And also here you can have an array of `LabelValueOption` objects.

```jsx
<AsyncTypeaheadInput
  name="inputName"
  queryFn={async (query) => {
    return [
      { value: "one", label: "one" },
      { value: "two", label: "two" },
    ];
  }}
  label="Async Typeahead"
/>
```

## Datepicker

To use the `DatepickerInput` component you have to include their CSS file in your project:

```jsx
import "react-datepicker/dist/react-datepicker.css";
```

Basic example:

```jsx
<DatePickerInput name="datepickerInput" label="Date Picker" />
```

You get full access to the [react-datepicker](https://reactdatepicker.com/) component. So you can pass all props to the `datePickerProps` prop of the `DatePickerInput` component.

So for example if you don't like the default date format of dd.MM.yyyy you can change it to yyyy-MM-dd like this:

```jsx
<DatePickerInput
  name="datepickerInput"
  label="Date Picker"
  datePickerProps={{
    dateFormat: "yyyy-MM-dd",
  }}
/>
```

:warning: **The date will always be set with a time so it matches midnight of the selected date when converted to UTC (which JSON.stringify does). So you will always get a**

## Numeric and Pattern Format

### Numeric format

To use a numeric format (for example with a thousand seperator) you can use the `Input` component and supply `numericFormat`.

Refer to the [react-number-format](https://s-yadav.github.io/react-number-format/docs/numeric_format) documentation for more information. If you use the `numericFormat` prop and declare the variable as a number with yup, you will get the unformatted value in your onSubmit function.

```jsx
<FormattedInput
  name={"name"}
  label={"Numeric Format"}
  numericFormat={{
    thousandSeparator: "'",
  }}
/>
```

### Pattern format

To use a pattern format (for example for a phone nr) you can use the `Input` component and supply `patternFormat`.

Refer to the [react-number-format](https://s-yadav.github.io/react-number-format/docs/pattern_format) documentation for more information.

```jsx
<FormattedInput
  name={"name"}
  label={"Pattern fomrat"}
  patternFormat={{
    format: "###-###-####",
    allowEmptyFormatting: true,
    mask: "_",
  }}
/>
```

## Storybook

The storybook is a visual testing tool that makes it easy to test and tinker with the components.

It can be found at https://neolution-ch.github.io/react-hook-form-components
