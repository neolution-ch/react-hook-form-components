import { faker } from "@faker-js/faker";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, Input } from "react-hook-form-components";
import * as yup from "yup";
import { generateOptions } from "../../helpers/typeahead";

it("radio button multiple autosave works", () => {
  const name1 = faker.random.alpha(10);
  const name2 = faker.random.alpha(10);
  const schema1 = yup.object().shape({
    [name1]: yup.string(),
  });
  const schema2 = yup.object().shape({
    [name2]: yup.string(),
  });

  const { objectOptions: options1 } = generateOptions(faker.datatype.number({ min: 1, max: 10 }));
  const { objectOptions: options2 } = generateOptions(faker.datatype.number({ min: 1, max: 10 }));

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
  options1.forEach(({ value, label }, i) => {
    cy.contains("label", label).click();

    cy.get("@onSubmitSpy1").should("have.callCount", i + 1);
    cy.get("@onSubmitSpy1")
      .its("lastCall.args.0")
      .should("deep.equal", { [name1]: value });
  });
  cy.get("@onSubmitSpy1").should("callCount", options1.length);

  cy.get("@onSubmitSpy2").should("have.callCount", 0);
  options2.forEach(({ value, label }, i) => {
    cy.contains("label", label).click();

    cy.get("@onSubmitSpy2").should("have.callCount", i + 1);
    cy.get("@onSubmitSpy2")
      .its("lastCall.args.0")
      .should("deep.equal", { [name2]: value });
  });
  cy.get("@onSubmitSpy2").should("callCount", options2.length);
});

it("radio button autosave only once", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.string(),
  });

  const { objectOptions: options } = generateOptions(faker.datatype.number({ min: 1, max: 10 }));

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)} autoSubmitConfig={{ wait: 500 }}>
      <Input type="radio" label="hello" name={name} helpText="help" options={options} />
    </Form>,
  );

  cy.get("@onSubmitSpy").should("have.callCount", 0);

  options.forEach(({ label }) => {
    cy.contains("label", label).click();
  });

  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: options[options.length - 1].value });
  cy.get("@onSubmitSpy").should("have.callCount", 1);
});

it("text input autosave only once", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.string(),
  });

  const randomText = faker.random.alphaNumeric(10);

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)} autoSubmitConfig={{ wait: 500 }}>
      <Input type="text" label={name} name={name} />
    </Form>,
  );

  cy.contains("label", name).click().type(randomText);
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomText });
  cy.get("@onSubmitSpy").should("have.callCount", 1);
});
