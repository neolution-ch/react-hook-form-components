import { faker } from "@faker-js/faker";
import { yupResolver } from "@hookform/resolvers/yup";
import { LabelValueOption, Form, Input } from "react-hook-form-components";
import * as yup from "yup";

it("select only works", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.string(),
  });

  const options = faker.helpers.uniqueArray<LabelValueOption>(() => ({ value: faker.random.alpha(10), label: faker.random.alpha(10) }), 3);
  const randomOption = faker.helpers.arrayElement(options);

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
      <Input type="select" name={name} label={name} options={options} inputOnly />

      <input type={"submit"} />
    </Form>,
  );

  cy.get(".mb-3").should("have.length", 0);
  cy.get(`select[id=${name}]`).select(randomOption.label);
  cy.get("input[type=submit]").click({ force: true });

  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomOption.value });
});

it("basic text input only works", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.string(),
  });

  const randomWord = faker.random.word();

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
      <Input name={name} inputOnly />

      <input type={"submit"} />
    </Form>,
  );

  cy.get(".mb-3").should("have.length", 1);
  cy.get("input[type=text]").click().type(randomWord.toString());
  cy.get("input[type=submit]").click({ force: true });

  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomWord });
});

it("text area only works", () => {
  const name = faker.random.alpha(10);
  const textAreaRows = faker.datatype.number({ min: 6, max: 10 });
  const schema = yup.object().shape({
    [name]: yup.string(),
    [textAreaRows]: yup.number(),
  });

  const randomWords = faker.random.words(25);

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
      <Input type="textarea" name={name} label={name} textAreaRows={textAreaRows} inputOnly />

      <input type={"submit"} />
    </Form>,
  );

  cy.get(".mb-3").should("have.length", 0);
  cy.get("textarea").click().type(randomWords.toString());
  cy.get("textarea").should("have.attr", "rows", textAreaRows);
  cy.get("input[type=submit]").click({ force: true });

  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomWords });
});
