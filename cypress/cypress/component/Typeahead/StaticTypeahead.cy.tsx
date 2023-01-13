import { Form, StaticTypeaheadInput } from "react-hook-form-components";
import { faker } from "@faker-js/faker";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { generateOptions } from "../../helpers/typeahead";

it("works with single simple options", () => {
  const { simpleOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const randomOption = faker.helpers.arrayElement(simpleOptions);

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")}>
      <StaticTypeaheadInput name={name} label={name} options={simpleOptions} />
      <input type="submit" />
    </Form>,
  );
  cy.get(`#${name}`).click();
  cy.get(`a[aria-label='${randomOption}']`).click();
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomOption });
});

it("works with multiple simple options", () => {
  const { simpleOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const randomOptions = faker.helpers.arrayElements(simpleOptions);

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")}>
      <StaticTypeaheadInput multiple name={name} label={name} options={simpleOptions} />
      <input type="submit" />
    </Form>,
  );

  for (const option of randomOptions) {
    cy.get(`#${name}`).click();
    cy.get(`a[aria-label='${option}']`).click();
  }

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomOptions });
});

it("works with single object options", () => {
  const { objectOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const randomOption = faker.helpers.arrayElement(objectOptions);

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")}>
      <StaticTypeaheadInput name={name} label={name} options={objectOptions} />
      <input type="submit" />
    </Form>,
  );

  cy.get(`#${name}`).click();
  cy.get(`a[aria-label='${randomOption.label}']`).click();
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomOption.value });
});

it("works with multiple object options", () => {
  const { objectOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const randomOptions = faker.helpers.arrayElements(objectOptions);

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")}>
      <StaticTypeaheadInput multiple name={name} label={name} options={objectOptions} />
      <input type="submit" />
    </Form>,
  );

  for (const option of randomOptions) {
    cy.get(`#${name}`).click();
    cy.get(`a[aria-label='${option.label}']`).click();
  }

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomOptions.map((o) => o.value) });
});

it("Validation works", () => {
  const { simpleOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const randomOption = faker.helpers.arrayElement(simpleOptions);
  const errorMessage = faker.lorem.sentence();

  const schema = yup.object({
    [name]: yup.string().required(errorMessage),
  });

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
      <StaticTypeaheadInput name={name} label={name} options={simpleOptions} />
      <input type="submit" />
    </Form>,
  );

  cy.get("input[type=submit]").click({ force: true });
  cy.contains(errorMessage).should("exist");

  cy.get(`#${name}`).click();
  cy.contains("a", randomOption).click();
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomOption });
});

it("is disabled", () => {
  const name = faker.random.word();
  const { simpleOptions } = generateOptions(100);

  cy.mount(
    <Form
      onSubmit={() => {
        // Do nothing
      }}
    >
      <StaticTypeaheadInput name={name} label={name} options={simpleOptions} disabled />
    </Form>,
  );

  cy.get("input.rbt-input-main").should("be.disabled");
});
