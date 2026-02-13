import { faker } from "@faker-js/faker";
import {
  AsyncTypeaheadInput,
  DatePickerInput,
  Form,
  FormattedInput,
  Input,
  StaticTypeaheadInput,
  useFormContext,
} from "react-hook-form-components";
import { Input as ReactstrapInput, Label } from "reactstrap";
import { mount } from "cypress/react";

it("disable all fields when readonly attribute is set", () => {
  const inputName = faker.random.alpha(10);
  const dateInputName = faker.random.alpha(10);
  const formattedInputName = faker.random.alpha(10);
  const asyncTypeAheadInputName = faker.random.alpha(10);
  const staticTypeAheadInputName = faker.random.alpha(10);

  mount(
    <Form
      onSubmit={() => {
        // Nothing to do
      }}
      disabled
    >
      <Input type="text" label={inputName} name={inputName} />
      <FormattedInput numericFormat={{ thousandSeparator: "'" }} label={formattedInputName} name={formattedInputName} />
      <AsyncTypeaheadInput label={asyncTypeAheadInputName} name={asyncTypeAheadInputName} queryFn={() => Promise.resolve([])} />
      <DatePickerInput label={dateInputName} name={dateInputName} />
      <StaticTypeaheadInput label={staticTypeAheadInputName} name={staticTypeAheadInputName} options={[]} />
    </Form>,
  );

  cy.get(`input[id=${inputName}]`).should("have.attr", "disabled");
  cy.get(`input[id=${formattedInputName}]`).should("have.attr", "disabled");
  cy.get(`input[id=${asyncTypeAheadInputName}]`).should("have.attr", "disabled");
  cy.get(`input[id=${dateInputName}]`).should("have.attr", "disabled");
  cy.get(`input[id=${staticTypeAheadInputName}]`).should("have.attr", "disabled");
});

it("exposing readonly through children function works", () => {
  const name = faker.random.alpha(10);

  mount(
    <Form
      onSubmit={() => {
        // Nothing to do
      }}
      disabled
    >
      {({ disabled }) => (
        <>
          <Label>{name}</Label>
          <ReactstrapInput id={name} type="text" disabled={disabled} name={name} />
        </>
      )}
    </Form>,
  );

  cy.get(`input[id=${name}]`).should("have.attr", "disabled");
});

it("exposing readonly through context works", () => {
  const name = faker.random.alpha(10);

  const CustomInput = () => {
    const { disabled } = useFormContext();
    return (
      <>
        <Label>{name}</Label>
        <ReactstrapInput id={name} type="text" disabled={disabled} name={name} />
      </>
    );
  };
  mount(
    <Form
      onSubmit={() => {
        // Nothing to do
      }}
      disabled
    >
      <CustomInput />
    </Form>,
  );

  cy.get(`input[id=${name}]`).should("have.attr", "disabled");
});
