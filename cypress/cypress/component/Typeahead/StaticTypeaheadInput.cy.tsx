import { Form, StaticTypeaheadInput } from "react-hook-form-components";
import { faker } from "@faker-js/faker";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { generateOptions } from "../../helpers/typeahead";

it("works with single simple options", () => {
  const { simpleOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const randomOptions = faker.helpers.arrayElements(simpleOptions, 2);

  const [defaultSelectedOption, changedOption] = randomOptions;

  cy.mount(
    <Form
      onSubmit={cy.spy().as("onSubmitSpy")}
      defaultValues={{
        [name]: defaultSelectedOption,
      }}
    >
      <StaticTypeaheadInput name={name} label={name} options={simpleOptions} defaultSelected={[defaultSelectedOption]} />
      <input type="submit" />
    </Form>,
  );

  cy.get(`#${name}`).should("have.value", defaultSelectedOption);
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: defaultSelectedOption });

  cy.get(`#${name}`).clear().click();
  cy.get(`a[aria-label='${changedOption}']`).click();
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledWith", { [name]: changedOption });
});

it("works with multiple simple options", () => {
  const { simpleOptions } = generateOptions();
  const name = faker.random.alpha(10);

  const randomOptions = faker.helpers.arrayElements(simpleOptions, faker.datatype.number({ min: 2, max: 5 }));
  const half = Math.ceil(randomOptions.length / 2);

  const defaultSelectedOptions = randomOptions.slice(0, half);
  const changedOptions = randomOptions.slice(half);

  cy.mount(
    <Form
      onSubmit={cy.spy().as("onSubmitSpy")}
      defaultValues={{
        [name]: defaultSelectedOptions,
      }}
    >
      <StaticTypeaheadInput multiple name={name} label={name} options={simpleOptions} defaultSelected={defaultSelectedOptions} />
      <input type="submit" />
    </Form>,
  );

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: defaultSelectedOptions });

  cy.get(`#${name}`).click().type("{backspace}".repeat(20));

  for (const option of changedOptions) {
    cy.get(`#${name}`).click();
    cy.get(`a[aria-label='${option}']`).click();
  }

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledWith", { [name]: changedOptions });
});

it("works with single object options", () => {
  const { objectOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const [defaultSelectedOption, changedOption] = faker.helpers.arrayElements(objectOptions, 2);

  cy.mount(
    <Form
      onSubmit={cy.spy().as("onSubmitSpy")}
      defaultValues={{
        [name]: defaultSelectedOption.value,
      }}
    >
      <StaticTypeaheadInput name={name} label={name} options={objectOptions} defaultSelected={[defaultSelectedOption.label]} />
      <input type="submit" />
    </Form>,
  );

  cy.get(`#${name}`).should("have.value", defaultSelectedOption.label);
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: defaultSelectedOption.value });

  cy.get(`#${name}`).clear().click();
  cy.get(`a[aria-label='${changedOption.label}']`).click();
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledWith", { [name]: changedOption.value });
});

it("works with multiple object options", () => {
  const options = generateOptions(100);
  const name = faker.random.alpha(10);
  const randomOptions = faker.helpers.arrayElements(options.objectOptions, faker.datatype.number({ min: 2, max: 5 }));
  const half = Math.ceil(randomOptions.length / 2);

  const defaultSelectedOptions = randomOptions.slice(0, half);
  const changedOptions = randomOptions.slice(half);

  cy.mount(
    <Form
      onSubmit={cy.spy().as("onSubmitSpy")}
      defaultValues={{
        [name]: defaultSelectedOptions.map((o) => o.value),
      }}
    >
      <StaticTypeaheadInput multiple defaultSelected={defaultSelectedOptions} name={name} label={name} options={options.objectOptions} />
      <input type="submit" />
    </Form>,
  );

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: defaultSelectedOptions.map((o) => o.value) });

  cy.get(`#${name}`).click().type("{backspace}".repeat(20));

  for (const changedOption of changedOptions) {
    cy.get(`#${name}`).click().type(changedOption.label);
    cy.get(`a[aria-label='${changedOption.label}']`).click();
  }

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledWith", { [name]: changedOptions.map((o) => o.value) });
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

it("works with the correct value onChange", () => {
  const { simpleOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const randomOption = faker.helpers.arrayElement(simpleOptions);

  cy.mount(
    <Form
      onSubmit={() => {
        // Nothing to do
      }}
    >
      <StaticTypeaheadInput name={name} label={name} options={simpleOptions} onChange={cy.spy().as("OnChangeSpy")} />
      <input type="submit" />
    </Form>,
  );

  cy.get(`#${name}`).clear().click();
  cy.get(`a[aria-label='${randomOption}']`).click();
  cy.get("@OnChangeSpy").should("have.been.calledWith", randomOption);
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

it("auto mark on focus", () => {
  const { simpleOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const randomOption = faker.helpers.arrayElement(simpleOptions);

  cy.mount(
    <Form
      onSubmit={() => {
        // Do nothing
      }}
    >
      <StaticTypeaheadInput defaultSelected={[randomOption]} name={name} label={name} options={simpleOptions} markAllOnFocus />
    </Form>,
  );

  cy.contains("label", name).click();
  cy.get(`input[id=${name}]`).getSelectedText().should("eq", randomOption);
});
