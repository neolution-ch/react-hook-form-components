import { faker } from "@faker-js/faker";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, FormattedInput } from "react-hook-form-components";
import { NumericFormatProps, numericFormatter } from "react-number-format";
import * as yup from "yup";
import { getSelectedTextFromInputField } from "../../helpers/getSelectedText";

const numericFormat: NumericFormatProps = {
  thousandSeparator: faker.random.alpha(),
};

it("numeric format works", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.number(),
  });

  const randomNumber = faker.datatype.number({
    min: 10000,
  });

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
      <FormattedInput name={name} label={name} numericFormat={numericFormat} />

      <input type={"submit"} />
    </Form>,
  );

  cy.contains("label", name).click().type(randomNumber.toString());
  cy.get(`input[id=${name}]`).should("have.value", numericFormatter(randomNumber.toString(), numericFormat));
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomNumber });
});

it("is disabled", () => {
  const name = faker.random.word();

  cy.mount(
    <Form
      onSubmit={() => {
        // Do nothing
      }}
    >
      <FormattedInput name={name} label={name} numericFormat={numericFormat} disabled />
    </Form>,
  );

  cy.get(`input[name=${name}]`).should("be.disabled");
});

it("auto mark on focus", () => {
  const name = faker.random.word();
  const randomNumber = faker.datatype.number({
    min: 10000000,
  });

  cy.mount(
    <Form
      defaultValues={{ [name]: randomNumber }}
      onSubmit={() => {
        // Do nothing
      }}
    >
      <FormattedInput name={name} label={name} numericFormat={numericFormat} markAllOnFocus />
    </Form>,
  );

  cy.contains("label", name).click();
  let selectedText: string | undefined;
  cy.get(`input[id=${name}]`)
    .then((input) => {
      selectedText = getSelectedTextFromInputField(input);
    })
    .then(() => {
      // replace thousand separator
      const thousandSeparator = /(\d+)(\d{3})/;
      let randomNumberFormatted: string = randomNumber?.toString();
      while (thousandSeparator.test(randomNumberFormatted))
        randomNumberFormatted = randomNumberFormatted.replace(thousandSeparator, `$1${numericFormat.thousandSeparator}$2`);
      expect(selectedText).to.equal(randomNumberFormatted);
    });
});

it("validation works", () => {
  const name = faker.random.alpha(10);
  const errorMessage = faker.random.words();
  const schema = yup.object().shape({
    [name]: yup
      .number()
      .nullable()
      .required(errorMessage)
      .transform((_, val) => (isNaN(parseFloat(val)) ? null : Number(val))),
  });

  const randomNumber = faker.datatype.number({
    min: 10000,
  });

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
      <FormattedInput name={name} label={name} numericFormat={numericFormat} />

      <input type={"submit"} />
    </Form>,
  );

  cy.get(`input[id=${name}]`).type(randomNumber.toString()).clear();
  cy.get("input[type=submit]").click({ force: true });
  cy.contains(errorMessage);

  cy.get(`input[id=${name}]`).type(randomNumber.toString());
  cy.get("input[type=submit]").click({ force: true });

  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomNumber });
});

it("validation works for nested fields", () => {
  const objectName = faker.random.alpha(10);
  const propertyName = faker.random.alpha(10);
  const errorMessage = faker.random.words();
  const schema = yup.object().shape({
    [objectName]: yup.object().shape({
      [propertyName]: yup
        .number()
        .nullable()
        .required(errorMessage)
        .transform((_, val) => (isNaN(parseFloat(val)) ? null : Number(val))),
    }),
  });

  const name = `${objectName}.${propertyName}`;
  const randomNumber = faker.datatype.number({
    min: 10000,
  });

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
      <FormattedInput name={name} label={name} numericFormat={numericFormat} />

      <input type={"submit"} />
    </Form>,
  );

  cy.get(`input[id="${name}"]`).type(randomNumber.toString()).clear();
  cy.get("input[type=submit]").click({ force: true });
  cy.contains(errorMessage);

  cy.contains("label", name).click().type(randomNumber.toString());
  cy.get("input[type=submit]").click({ force: true });

  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [objectName]: { [propertyName]: randomNumber } });
});
