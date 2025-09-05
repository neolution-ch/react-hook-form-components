import { Form, Input } from "react-hook-form-components";
import { faker } from "@faker-js/faker";
import { mount } from "cypress/react18";

it("it has form-control-plaintext class", () => {
  const name = faker.random.alpha(10);
  const value = faker.random.alpha(10);

  mount(
    <Form
      onSubmit={() => {
        // Do nothing
      }}
    >
      <Input type="text" name={name} label={name} plainText value={value} />
    </Form>,
  );
  cy.get(`[name=${name}]`).should("have.class", "form-control-plaintext");
});

it("it has the correct style", () => {
  const name = faker.random.alpha(10);
  const value = faker.random.alpha(10);

  mount(
    <Form
      onSubmit={() => {
        // Do nothing
      }}
    >
      <Input type="text" name={name} label={name} plainText value={value} />
    </Form>,
  );
  cy.get(`[name=${name}]`).should("have.attr", "style", "color: black; margin-left: 10px;");
});
