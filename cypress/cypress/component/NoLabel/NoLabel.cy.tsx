import { faker } from "@faker-js/faker";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, Input } from "react-hook-form-components";
import * as yup from "yup";
import { generateOptions } from "../../helpers/typeahead";

it("text input label does not get rendered when undefined", () => {
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

  cy.get(`input[name=${name}]`).click();
  cy.get(`input[name=${name}]`).type(randomText);

  cy.get("label").should("not.exist");

  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomText });
  cy.get("@onSubmitSpy").should("have.callCount", 1);
});

it("radio input label does not get rendered when undefined", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.string(),
  });
  const { objectOptions } = generateOptions(5);
  const [firstOption] = objectOptions;

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)} autoSubmitConfig={{ wait: 500 }}>
      <Input type="radio" name={name} options={objectOptions} />
    </Form>,
  );

  cy.get(`label[for=${name}]`).should("not.exist");
  cy.contains(firstOption.label).click();

  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: firstOption.value });
  cy.get("@onSubmitSpy").should("have.callCount", 1);
});
