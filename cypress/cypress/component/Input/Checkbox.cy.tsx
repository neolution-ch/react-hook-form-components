import { faker } from "@faker-js/faker";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, Input } from "react-hook-form-components";
import * as yup from "yup";
import { generateOptions } from "../../helpers/typeahead";
import { mount } from "cypress/react18";

it("checkbox works", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.boolean(),
  });

  mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
      <Input type="checkbox" name={name} label={name} />

      <input type={"submit"} />
    </Form>,
  );

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: false });

  cy.contains("label", name).click();
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("have.been.calledWith", { [name]: true });
  cy.get("@onSubmitSpy").should("have.callCount", 2);
});

it("multiple checkboxes pass their value", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.array().of(yup.string()).required(),
  });

  const { objectOptions, randomSubset } = generateOptions();

  mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
      {objectOptions.map((option, i) => (
        <Input type="checkbox" key={option.value} name={name} label={option.label} value={option.value} id={`${name}-${i}`} />
      ))}

      <input type={"submit"} />
    </Form>,
  );

  for (const option of randomSubset) {
    cy.contains("label", option.label).click();
  }

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomSubset.map((option) => option.value) });
});

it("switch works", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.boolean(),
  });

  mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
      <Input type="switch" name={name} label={name} />

      <input type={"submit"} />
    </Form>,
  );

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy")
    .should("be.calledOnceWith", { [name]: false })
    .invoke("resetHistory");

  cy.contains("label", name).click();
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: true });
});

it("has disabled checkbox variants", () => {
  const switchName = faker.random.word();
  const checkboxName = faker.random.word();

  mount(
    <Form
      onSubmit={() => {
        // Do nothing
      }}
    >
      <Input type="switch" name={switchName} label={switchName} disabled />
      <Input type="checkbox" name={checkboxName} label={checkboxName} disabled />
    </Form>,
  );

  cy.get(`input[name=${switchName}]`).should("be.disabled");
  cy.get(`input[name=${checkboxName}]`).should("be.disabled");
});
