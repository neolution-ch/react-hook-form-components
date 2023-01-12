import { AsyncTypeaheadInput, Form } from "react-hook-form-components";
import { faker } from "@faker-js/faker";
import { fetchMock, generateOptions } from "../../helpers/typeahead";

it("works with single simple options", () => {
  const options = generateOptions(100);
  const name = faker.random.alpha(10);
  const randomOption = faker.helpers.arrayElement(options.objectOptions);

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")}>
      <AsyncTypeaheadInput name={name} label={name} queryFn={async (query) => await fetchMock(options.objectOptions, query)} />
      <input type="submit" />
    </Form>,
  );
  cy.get(`#${name}`).click().type(randomOption.label);
  cy.get(`a[aria-label='${randomOption.label}']`).click();
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomOption.label });
});

it("works with multiple simple options", () => {
  const options = generateOptions(100);
  const name = faker.random.alpha(10);
  const randomOptions = faker.helpers.arrayElements(options.objectOptions, faker.datatype.number({ min: 2, max: 5 }));

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")}>
      <AsyncTypeaheadInput multiple name={name} label={name} queryFn={async (query) => await fetchMock(options.objectOptions, query)} />
      <input type="submit" />
    </Form>,
  );

  for (const randomOption of randomOptions) {
    cy.get(`#${name}`).click().type(randomOption.label);
    cy.get(`a[aria-label='${randomOption.label}']`).click();
  }

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomOptions.map((o) => o.label) });
});

it("is disabled", () => {
  const name = faker.random.word();
  const options = generateOptions(100);

  cy.mount(
    <Form
      onSubmit={() => {
        // Do nothing
      }}
    >
      <AsyncTypeaheadInput name={name} label={name} queryFn={async (query) => await fetchMock(options.objectOptions, query)} disabled />
    </Form>,
  );

  cy.get("input.rbt-input-main").should("be.disabled");
});
