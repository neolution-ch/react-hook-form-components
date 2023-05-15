import { faker } from "@faker-js/faker";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, Input } from "react-hook-form-components";
import * as yup from "yup";

it("inputs work without label", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.string(),
  });

  const randomText = faker.random.alphaNumeric(10);

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)} autoSubmitConfig={{ wait: 500 }}>
      <Input type="text" name={name} />
    </Form>,
  );

  cy.get(`input[name=${name}]`).click().type(randomText);
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomText });
  cy.get("@onSubmitSpy").should("have.callCount", 1);
});
