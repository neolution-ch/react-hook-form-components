import { faker } from "@faker-js/faker";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, Input } from "react-hook-form-components";
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
