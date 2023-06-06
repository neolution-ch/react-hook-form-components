/* eslint-disable max-lines */
import { DatePickerInput, Form, setUtcTimeToZero } from "react-hook-form-components";
import "react-datepicker/dist/react-datepicker.css";
import { faker } from "@faker-js/faker";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputGroupText } from "reactstrap";

it("selecting today works", () => {
  const name = faker.random.alpha(10);

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

  const todayMidnight = new Date();
  setUtcTimeToZero(todayMidnight);
  cy.get("@onSubmitSpy")
    .its("lastCall.args.0")
    .should("deep.equal", { [name]: todayMidnight });
});

it("setting intial value as iso string works", () => {
  const name = faker.random.alpha(10);
  const randomDate = faker.date.future();

  const schema = yup.object().shape({
    [name]: yup.date().required(),
  });

  const x = (values: unknown) => {
    console.log(values);
    console.log(JSON.stringify(values));
  };

  cy.mount(
    <Form
      onSubmit={cy.spy(x).as("onSubmitSpy")}
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

  setUtcTimeToZero(randomDate);
  cy.get("@onSubmitSpy")
    .its("lastCall.args.0")
    .should("deep.equal", { [name]: randomDate });
});

it("setting intial value as date object works", () => {
  const name = faker.random.alpha(10);
  const randomDate = faker.date.future();

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

  setUtcTimeToZero(randomDate);
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

it("contains calendar icon if provided in DateInput", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.date(),
  });

  cy.mount(
    <Form
      onSubmit={() => {
        // Nothing to do
      }}
      resolver={yupResolver(schema)}
    >
      <DatePickerInput
        name={name}
        label={name}
        addonLeft={
          <InputGroupText>
            <FontAwesomeIcon icon={faCalendar} />
          </InputGroupText>
        }
        addonRight={
          <InputGroupText>
            <FontAwesomeIcon icon={faCalendar} />
          </InputGroupText>
        }
      />
    </Form>,
  );

  cy.get(`label[for=${name}]`).parent().find("svg[data-icon=calendar]");
});

it("not contains calendar icon if not provided in DateInput", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.date(),
  });

  cy.mount(
    <Form
      onSubmit={() => {
        // Nothing to do
      }}
      resolver={yupResolver(schema)}
    >
      <DatePickerInput name={name} label={name} />
    </Form>,
  );

  cy.get(`label[for=${name}]`).parent().find("svg").should("not.exist");
});
