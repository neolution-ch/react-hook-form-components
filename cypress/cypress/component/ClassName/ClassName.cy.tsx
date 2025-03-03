import { Form, Input, DatePickerInput, AsyncTypeaheadInput, StaticTypeaheadInput, FormattedInput } from "react-hook-form-components";
import { faker } from "@faker-js/faker";
import { fetchMock, generateOptions } from "../../helpers/typeahead";

it("input has correct classname", () => {
  const name = faker.random.alpha(10);
  const value = faker.random.alpha(10);

  cy.mount(
    <Form
      onSubmit={() => {
        // Do nothing
      }}
    >
      <Input type="text" name={name} label={name} value={value} className="mt-0 text-white" />
    </Form>,
  );
  cy.get(`[name=${name}]`).should("have.class", "mt-0 text-white");
});

it("datepicker input has correct classname", () => {
  const name = faker.random.word();

  cy.mount(
    <Form
      onSubmit={() => {
        // Do nothing
      }}
    >
      <DatePickerInput label={name} name={name} className="mt-0 text-white" />
    </Form>,
  );

  cy.get(`input[name=${name}]`).should("have.class", "mt-0 text-white");
});

it("async typeahead input has correct classname", () => {
  const name = faker.random.word();
  const options = generateOptions(100);

  cy.mount(
    <Form
      onSubmit={() => {
        // Do nothing
      }}
    >
      <AsyncTypeaheadInput
        name={name}
        label={name}
        queryFn={async (query) => await fetchMock(options.objectOptions, query)}
        className="mt-0 text-white"
      />
    </Form>,
  );

  cy.get(".MuiAutocomplete-root").should("have.class", "mt-0 text-white");
});

it("static typeahead input has correct classname", () => {
  const name = faker.random.word();
  const { simpleOptions } = generateOptions(100);

  cy.mount(
    <Form
      onSubmit={() => {
        // Do nothing
      }}
    >
      <StaticTypeaheadInput name={name} label={name} options={simpleOptions} className="mt-0 text-white" />
    </Form>,
  );

  cy.get(".MuiAutocomplete-root").should("have.class", "mt-0 text-white");
});

it("formatted input has correct classname", () => {
  const name = faker.random.alpha(10);

  cy.mount(
    <Form
      onSubmit={() => {
        // Do nothing
      }}
    >
      <FormattedInput name={name} label={name} className="mt-0 text-white" numericFormat={{}} />
    </Form>,
  );
  cy.get(`[name=${name}]`).should("have.class", "mt-0 text-white");
});
