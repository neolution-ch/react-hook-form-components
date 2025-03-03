import { Form, Input, AsyncTypeaheadInput, StaticTypeaheadInput } from "react-hook-form-components";
import { faker } from "@faker-js/faker";
import { fetchMock, generateOptions } from "../../helpers/typeahead";

it("input has correct style", () => {
  const name = faker.random.alpha(10);
  const value = faker.random.alpha(10);

  cy.mount(
    <Form
      onSubmit={() => {
        // Do nothing
      }}
    >
      <Input type="text" name={name} label={name} value={value} style={{ backgroundColor: "black", marginTop: "10px" }} />
    </Form>,
  );

  cy.get(`[name=${name}]`).should("have.attr", "style", "background-color: black; margin-top: 10px;");
});

it("async typeahead input has correct style", () => {
  const name = faker.random.word();
  const options = generateOptions(100);
  const customStyle = "background-color: black; margin-top: 10px;";

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
        style={{ backgroundColor: "black", marginTop: "10px" }}
      />
    </Form>,
  );

  cy.get("div.MuiFormControl-root").should("have.attr", "style", customStyle);
});

it("static typeahead input has correct style", () => {
  const name = faker.random.word();
  const { simpleOptions } = generateOptions(100);
  const customStyle = "background-color: black; margin-top: 10px;";

  cy.mount(
    <Form
      onSubmit={() => {
        // Do nothing
      }}
    >
      <StaticTypeaheadInput name={name} label={name} options={simpleOptions} style={{ backgroundColor: "black", marginTop: "10px" }} />
    </Form>,
  );

  cy.get("div.MuiFormControl-root").should("have.attr", "style", customStyle);
});
