/* eslint-disable max-lines */
import { DatePickerInput, Form, setUtcTimeToZero } from "react-hook-form-components";
import "react-datepicker/dist/react-datepicker.css";
import { faker } from "@faker-js/faker";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

it("selecting today works", () => {
  const name = faker.random.alpha(10);
  const todayMidnight = new Date();
  setUtcTimeToZero(todayMidnight);

  const schema = yup.object().shape({
    [name]: yup.date().required(),
  });

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
      <DatePickerInput name={name} label={name} />

      <input type={"submit"} />
    </Form>,
  );

  cy.contains("label", name).click();
  cy.get(".react-datepicker__day--today").click();
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy")
    .its("lastCall.args.0")
    .should("deep.equal", { [name]: todayMidnight });
});

it("setting intial value as iso string works", () => {
  const name = faker.random.alpha(10);
  const randomDate = faker.date.future();
  setUtcTimeToZero(randomDate);

  const schema = yup.object().shape({
    [name]: yup.date().required(),
  });

  cy.mount(
    <Form
      onSubmit={cy.spy().as("onSubmitSpy")}
      resolver={yupResolver(schema)}
      defaultValues={{
        [name]: randomDate.toISOString(),
      }}
    >
      <DatePickerInput name={name} label={name} />

      <input type={"submit"} />
    </Form>,
  );

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy")
    .its("lastCall.args.0")
    .should("deep.equal", { [name]: randomDate });
});

it("setting intial value as date object works", () => {
  const name = faker.random.alpha(10);
  const randomDate = faker.date.future();
  setUtcTimeToZero(randomDate);

  const schema = yup.object().shape({
    [name]: yup.date().required(),
  });

  cy.mount(
    <Form
      onSubmit={cy.spy().as("onSubmitSpy")}
      resolver={yupResolver(schema)}
      defaultValues={{
        [name]: randomDate,
      }}
    >
      <DatePickerInput name={name} label={name} />

      <input type={"submit"} />
    </Form>,
  );

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy")
    .its("lastCall.args.0")
    .should("deep.equal", { [name]: randomDate });
});

it("is disabled", () => {
  const name = faker.random.word();

  cy.mount(
    <Form
      onSubmit={() => {
        // Do nothing
      }}
    >
      <DatePickerInput label={name} name={name} disabled />
    </Form>,
  );

  cy.get(`input[name=${name}]`).should("be.disabled");
});
