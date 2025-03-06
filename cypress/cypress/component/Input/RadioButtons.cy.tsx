import { faker } from "@faker-js/faker";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, Input, LabelValueOption } from "react-hook-form-components";
import * as yup from "yup";

it("radio button works", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.string(),
  });

  const options = faker.helpers.uniqueArray<LabelValueOption>(() => ({ value: faker.random.alpha(10), label: faker.random.alpha(10) }), 3);
  const selectedOption = faker.helpers.arrayElement(options);

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
      <Input type="radio" label="hello" name={name} helpText="help" options={options} />
      <input type={"submit"} />
    </Form>,
  );

  cy.contains("label", selectedOption.label).click();
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: selectedOption.value });
});

it("renders disabled radio buttons", () => {
  const name = faker.random.word();
  const options = Array.from({ length: 5 }).map<LabelValueOption>(() => {
    const randomVal = faker.science.chemicalElement().name;
    return { label: randomVal, value: randomVal };
  });

  cy.mount(
    <Form
      onSubmit={() => {
        // Do nothing
      }}
    >
      <Input type="radio" name={name} label={name} options={options} disabled />
    </Form>,
  );

  for (const { value } of options) {
    cy.get(`input[value=${value}]`).should("be.disabled");
  }
});
