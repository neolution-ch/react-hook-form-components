import { faker } from "@faker-js/faker";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, Input, StaticTypeaheadInput, AsyncTypeaheadInput, DatePickerInput, FormattedInput } from "react-hook-form-components";
import * as yup from "yup";
import { mount } from "cypress/react18";

it("adding * character if string label works", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.number(),
  });

  mount(
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

  mount(
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

  mount(
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

it("testing existing * on array object", () => {
  const fakePerson = {
    city: {
      address: {
        streetsAsString: [faker.random.alpha(10), faker.random.alpha(10), faker.random.alpha(10)],
        streetsAsObject: [{ name: faker.random.alpha(10) }, { name: faker.random.alpha(10) }, { name: faker.random.alpha(10) }],
      },
    },
  };

  const schema = yup.object().shape({
    city: yup.object().shape({
      address: yup.object().shape({
        streetsAsString: yup.array().of(yup.string().required()),
        streetsAsObject: yup.array().of(
          yup.object().shape({
            name: yup.string().required(),
          }),
        ),
      }),
    }),
  });

  mount(
    <Form<typeof fakePerson>
      onSubmit={() => {
        // Nothing to do
      }}
      defaultValues={fakePerson}
      resolver={yupResolver(schema)}
      requiredFields={["city.address.streetsAsString.0", "city.address.streetsAsObject.0.name"]}
    >
      <Input<typeof fakePerson> name="city.address.streetsAsObject.0.name" label="Street as object" />
      <Input<typeof fakePerson> name="city.address.streetsAsString.0" label="Street as string" />
    </Form>,
  );

  cy.get(`label[for="city.address.streetsAsObject.0.name"`).should("have.text", "Street as object *");
  cy.get(`label[for="city.address.streetsAsString.0"`).should("have.text", "Street as string *");
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
  mount(<ValidationForm />);
  cy.get(`button[type=submit]`).click();
  cy.get(`label[for=name`).parent().find(".invalid-feedback").should("exist");
  cy.get(`label[for=surname`).parent().find("#surname-helper-text").should("exist");
  cy.get(`label[for=place`).parent().find("#place-helper-text").should("exist");
  cy.get(`label[for=age`).parent().find(".invalid-feedback").should("exist");
  cy.get(`label[for=dateOfBirth`).parent().find(".invalid-feedback").should("exist");
});

it("hide validation messages when hideValidationMessages is provided through the form", () => {
  mount(<ValidationForm hideValidationMessages />);

  cy.get(`button[type=submit]`).click();
  cy.get(`label[for=name`).parent().find(".invalid-feedback").should("not.exist");
  cy.get(`label[for=surname`).parent().find(".invalid-feedback").should("not.exist");
  cy.get(`label[for=place`).parent().find(".invalid-feedback").should("not.exist");
  cy.get(`label[for=age`).parent().find(".invalid-feedback").should("not.exist");
  cy.get(`label[for=dateOfBirth`).parent().find(".invalid-feedback").should("not.exist");
});

it("hide validation message when hideValidationMessage is provided on the single input", () => {
  mount(<ValidationForm hideValidationMessage />);

  cy.get(`button[type=submit]`).click();
  cy.get(`label[for=name`).parent().find(".invalid-feedback").should("not.exist");
  cy.get(`label[for=surname`).parent().find(".invalid-feedback").should("not.exist");
  cy.get(`label[for=place`).parent().find(".invalid-feedback").should("not.exist");
  cy.get(`label[for=age`).parent().find(".invalid-feedback").should("not.exist");
  cy.get(`label[for=dateOfBirth`).parent().find(".invalid-feedback").should("not.exist");
});
