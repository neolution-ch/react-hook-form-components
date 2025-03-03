import { faker } from "@faker-js/faker";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, Input, StaticTypeaheadInput, AsyncTypeaheadInput, DatePickerInput, FormattedInput } from "react-hook-form-components";
import * as yup from "yup";

it("adding * character if string label works", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.number(),
  });

  cy.mount(
    <Form
      onSubmit={() => {
        // Nothing to do
      }}
      resolver={yupResolver(schema)}
      requiredFields={[name]}
    >
      <Input name={name} label={name} />
    </Form>,
  );

  cy.get(`label[for=${name}]`).should("have.text", `${name} *`);
});

it("ignore * character if label is not of string type works", () => {
  const name = faker.random.alpha(10);

  const schema = yup.object().shape({
    [name]: yup.number(),
  });

  cy.mount(
    <Form
      onSubmit={() => {
        // Nothing to do
      }}
      resolver={yupResolver(schema)}
      requiredFields={[name]}
    >
      <Input name={name} label={<strong>{name}</strong>} />
    </Form>,
  );

  cy.get(`label[for=${name}]`).should("have.text", name);
});

it("testing existing * on nested object", () => {
  const fakePerson = {
    name: faker.random.alpha(10),
    city: {
      address: {
        street: faker.random.alpha(10),
      },
    },
  };

  const schema = yup.object().shape({
    [fakePerson.name]: yup.string(),
    [fakePerson.city.address.street]: yup.string(),
  });

  cy.mount(
    <Form
      onSubmit={() => {
        // Nothing to do
      }}
      resolver={yupResolver(schema)}
      requiredFields={[fakePerson.city.address.street]}
    >
      <Input name={fakePerson.city.address.street} label={fakePerson.city.address.street} />
    </Form>,
  );

  cy.get(`label[for=${fakePerson.city.address.street}]`).should("have.text", `${fakePerson.city.address.street} *`);
});

const ValidationForm = (props: { hideValidationMessage?: boolean; hideValidationMessages?: boolean }) => {
  const { hideValidationMessage, hideValidationMessages } = props;
  const schema = yup.object().shape({
    name: yup.string().required(),
    surname: yup.string().nullable(false).required(),
    place: yup.string().required(),
    age: yup.number().required(),
    dateOfBirth: yup.date().required(),
  });

  return (
    <Form
      hideValidationMessages={hideValidationMessages}
      onSubmit={() => {
        // Nothing to do
      }}
      resolver={yupResolver(schema)}
    >
      <Input name="name" label="name" hideValidationMessage={hideValidationMessage} />
      <StaticTypeaheadInput name="surname" label="surname" options={[]} hideValidationMessage={hideValidationMessage} />
      <AsyncTypeaheadInput name="place" label="place" queryFn={() => Promise.resolve([""])} hideValidationMessage={hideValidationMessage} />
      <DatePickerInput name="dateOfBirth" label="dateOfBirth" hideValidationMessage={hideValidationMessage} />
      <FormattedInput name="age" label="age" numericFormat={{ thousandSeparator: "'" }} hideValidationMessage={hideValidationMessage} />
      <button type="submit">click me</button>
    </Form>
  );
};

it("show validation messages", () => {
  cy.mount(<ValidationForm />);
  cy.get(`button[type=submit]`).click();
  cy.get(`label[for=name`).parent().find(".invalid-feedback").should("exist");
  cy.get(`label[for=surname`).parent().find("#surname-helper-text").should("exist");
  cy.get(`label[for=place`).parent().find("#place-helper-text").should("exist");
  cy.get(`label[for=age`).parent().find(".invalid-feedback").should("exist");
  cy.get(`label[for=dateOfBirth`).parent().find(".invalid-feedback").should("exist");
});

it("hide validation messages when hideValidationMessages is provided through the form", () => {
  cy.mount(<ValidationForm hideValidationMessages />);

  cy.get(`button[type=submit]`).click();
  cy.get(`label[for=name`).parent().find(".invalid-feedback").should("not.exist");
  cy.get(`label[for=surname`).parent().find(".invalid-feedback").should("not.exist");
  cy.get(`label[for=place`).parent().find(".invalid-feedback").should("not.exist");
  cy.get(`label[for=age`).parent().find(".invalid-feedback").should("not.exist");
  cy.get(`label[for=dateOfBirth`).parent().find(".invalid-feedback").should("not.exist");
});

it("hide validation message when hideValidationMessage is provided on the single input", () => {
  cy.mount(<ValidationForm hideValidationMessage />);

  cy.get(`button[type=submit]`).click();
  cy.get(`label[for=name`).parent().find(".invalid-feedback").should("not.exist");
  cy.get(`label[for=surname`).parent().find(".invalid-feedback").should("not.exist");
  cy.get(`label[for=place`).parent().find(".invalid-feedback").should("not.exist");
  cy.get(`label[for=age`).parent().find(".invalid-feedback").should("not.exist");
  cy.get(`label[for=dateOfBirth`).parent().find(".invalid-feedback").should("not.exist");
});
