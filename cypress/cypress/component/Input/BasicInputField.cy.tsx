/* eslint-disable max-lines */
import { Form, Input } from "react-hook-form-components";
import { faker } from "@faker-js/faker";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

describe("Input.cy.tsx", () => {
  it("basic text input works", () => {
    const name = faker.random.alpha(10);
    const schema = yup.object().shape({
      [name]: yup.string(),
    });

    const randomWord = faker.random.word();

    cy.mount(
      <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
        <Input name={name} label={name} />

        <input type={"submit"} />
      </Form>,
    );

    cy.contains("label", name).click().type(randomWord.toString());
    cy.get("input[type=submit]").click({ force: true });

    cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomWord });
  });

  it("number gets passed as number and not string", () => {
    const name = faker.random.alpha(10);
    const schema = yup.object().shape({
      [name]: yup.number(),
    });

    const randomNumber = faker.datatype.number();

    cy.mount(
      <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
        <Input type="number" name={name} label={name} />

        <input type={"submit"} />
      </Form>,
    );

    cy.contains("label", name).click().type(randomNumber.toString());
    cy.get("input[type=submit]").click({ force: true });

    cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomNumber });
  });

  it("help text gets displayed", () => {
    const name = faker.random.alpha(10);
    const schema = yup.object().shape({
      [name]: yup.string(),
    });

    const helpText = faker.random.words();

    cy.mount(
      <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
        <Input name={name} label={name} helpText={helpText} />

        <input type={"submit"} />
      </Form>,
    );

    cy.contains(helpText);
  });

  it("validation works", () => {
    const name = faker.random.alpha(10);
    const errorMessage = faker.random.words();
    const schema = yup.object().shape({
      [name]: yup.string().required(errorMessage),
    });

    const randomWord = faker.random.word();

    cy.mount(
      <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
        <Input name={name} label={name} />

        <input type={"submit"} />
      </Form>,
    );

    cy.get(`input[id=${name}]`).type(randomWord).clear();
    cy.get("input[type=submit]").click({ force: true });
    cy.contains(errorMessage);

    cy.contains("label", name).click().type(randomWord.toString());
    cy.get("input[type=submit]").click({ force: true });

    cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomWord });
  });

  it("on change handler gets called", () => {
    const name = faker.random.alpha(10);
    const schema = yup.object().shape({
      [name]: yup.string(),
    });

    const randomWord = faker.random.word();

    cy.mount(
      <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
        <Input name={name} label={name} onChange={cy.spy().as("onChangeSpy")} />

        <input type={"submit"} />
      </Form>,
    );

    cy.contains("label", name).click().type(randomWord.toString());
    cy.get("@onChangeSpy").should("be.calledWithMatch", { target: { value: randomWord } });
    cy.get("@onChangeSpy").should("have.callCount", randomWord.length);
  });

  it("on blur handler gets called", () => {
    const name = faker.random.alpha(10);
    const schema = yup.object().shape({
      [name]: yup.string(),
    });

    const randomWord = faker.random.word();

    cy.mount(
      <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
        <Input name={name} label={name} onBlur={cy.spy().as("onBlurSpy")} />

        <input type={"submit"} />
      </Form>,
    );

    cy.contains("label", name).click().type(randomWord.toString());
    cy.get("input[type=submit]").click({ force: true });
    cy.get("@onBlurSpy").should("be.calledWithMatch", { target: { value: randomWord } });
  });

  it.only("text area works", () => {
    const name = faker.random.alpha(10);
    const textAreaRows = faker.datatype.number({ min: 6, max: 10 });
    const schema = yup.object().shape({
      [name]: yup.string(),
      [textAreaRows]: yup.number(),
    });

    const randomWords = faker.random.words(25);

    cy.mount(
      <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
        <Input type="textarea" name={name} label={name} textAreaRows={textAreaRows} />

        <input type={"submit"} />
      </Form>,
    );

    cy.contains("label", name).click().type(randomWords.toString());
    cy.get("textarea").should("have.attr", "rows", textAreaRows);
    cy.get("input[type=submit]").click({ force: true });

    cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomWords });
  });

  it("email input works", () => {
    const name = faker.random.alpha(10);
    const schema = yup.object().shape({
      [name]: yup.string(),
    });

    const invalidEmail = faker.random.word();
    const validEmail = faker.internet.email();

    cy.mount(
      <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
        <Input type="email" name={name} label={name} />

        <input type={"submit"} />
      </Form>,
    );

    cy.contains("label", name).click().type(invalidEmail.toString());
    cy.get("input[type=submit]").click({ force: true });
    cy.get("@onSubmitSpy").should("have.callCount", 0);

    cy.get(`input[id=${name}]`).clear().type(validEmail.toString());
    cy.get("input[type=submit]").click({ force: true });
    cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: validEmail });
  });

  it("password input works", () => {
    const name = faker.random.alpha(10);
    const schema = yup.object().shape({
      [name]: yup.string(),
    });

    const randomWord = faker.random.word();

    cy.mount(
      <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
        <Input type="password" name={name} label={name} />

        <input type={"submit"} />
      </Form>,
    );

    cy.contains("label", name).click().type(randomWord.toString());
    cy.get("input[type=submit]").click({ force: true });

    cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomWord });
  });

  it("range input works", () => {
    const name = faker.random.alpha(10);
    const schema = yup.object().shape({
      [name]: yup.number(),
    });

    const [min, selectedValue, max] = faker.helpers.uniqueArray(faker.datatype.number, 3).sort((a, b) => a - b);

    cy.mount(
      <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
        <Input type="range" name={name} label={name} rangeMin={min} rangeMax={max} />

        <input type={"submit"} />
      </Form>,
    );

    cy.get(`input[id=${name}]`).setSliderValue(selectedValue);
    cy.get("input[type=submit]").click({ force: true });
    cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: selectedValue });
  });

  it("is disabled", () => {
    const name = faker.random.word();

    cy.mount(
      <Form
        onSubmit={() => {
          // Do nothing
        }}
      >
        <Input name={name} label={name} disabled />
      </Form>,
    );

    cy.get(`input[name=${name}]`).should("be.disabled");
  });
});
