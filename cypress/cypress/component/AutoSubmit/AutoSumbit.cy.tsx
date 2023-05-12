import { faker } from "@faker-js/faker";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, Input, LabelValueOption } from "react-hook-form-components";
import * as yup from "yup";

it("radio button multiple autosave works", () => {
  const name1 = faker.random.alpha(10);
  const name2 = faker.random.alpha(10);
  const schema1 = yup.object().shape({
    [name1]: yup.string(),
  });
  const schema2 = yup.object().shape({
    [name2]: yup.string(),
  });

  const options1 = faker.helpers.uniqueArray<LabelValueOption>(() => ({ value: faker.random.alpha(10), label: faker.random.alpha(10) }), 3);
  const options2 = faker.helpers.uniqueArray<LabelValueOption>(() => ({ value: faker.random.alpha(10), label: faker.random.alpha(10) }), 3);

  cy.mount(
    <>
      <Form onSubmit={cy.spy().as("onSubmitSpy1")} resolver={yupResolver(schema1)} autoSubmitConfig={{ wait: 500 }}>
        <Input type="radio" label="hello" name={name1} helpText="help" options={options1} />
      </Form>
      <Form onSubmit={cy.spy().as("onSubmitSpy2")} resolver={yupResolver(schema2)} autoSubmitConfig={{ wait: 500 }}>
        <Input type="radio" label="hello" name={name2} helpText="help" options={options2} />
      </Form>
    </>,
  );

  cy.get("@onSubmitSpy1").should("have.callCount", 0);
  options1.forEach(({ value, label }) => {
    cy.contains("label", label).click();
    cy.get("@onSubmitSpy1").should("be.calledOnceWith", { [name1]: value });
  });

  cy.get("@onSubmitSpy2").should("have.callCount", 0);
  options2.forEach(({ value, label }) => {
    cy.contains("label", label).click();
    cy.get("@onSubmitSpy2").should("be.calledOnceWith", { [name2]: value });
  });
});

it("radio button autosave only once", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.string(),
  });

  const options = faker.helpers.uniqueArray<LabelValueOption>(() => ({ value: faker.random.alpha(10), label: faker.random.alpha(10) }), 3);

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)} autoSubmitConfig={{ wait: 500 }}>
      <Input type="radio" label="hello" name={name} helpText="help" options={options} />
    </Form>,
  );

  cy.get("@onSubmitSpy").should("have.callCount", 0);
  options.forEach(({ label }) => {
    cy.contains("label", label).click();
  });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: options[2].value });
});
