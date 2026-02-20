import { faker } from "@faker-js/faker";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, FormattedInput } from "react-hook-form-components";
import { PatternFormatProps, patternFormatter } from "react-number-format";
import * as yup from "yup";
import { mount } from "cypress/react";

const patternFormat: PatternFormatProps = {
  format: "###-###-####",
  allowEmptyFormatting: true,
  mask: "_",
};

it("pattern format works", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.string(),
  });

  const randomDigits = faker.random.numeric(10).toString();

  mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
      <FormattedInput name={name} label={name} patternFormat={patternFormat} />

      <input type={"submit"} />
    </Form>,
  );

  cy.contains("label", name).click();
  cy.focused().type(randomDigits.toString());
  cy.get(`input[id=${name}]`).should("have.value", patternFormatter(randomDigits, patternFormat));
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: patternFormatter(randomDigits, patternFormat) });
});

it("is disabled", () => {
  const name = faker.random.word();

  mount(
    <Form
      onSubmit={() => {
        // Do nothing
      }}
    >
      <FormattedInput name={name} label={name} patternFormat={patternFormat} disabled />
    </Form>,
  );

  cy.get(`input[name=${name}]`).should("be.disabled");
});

it("auto mark on focus", () => {
  const name = faker.random.word();
  const randomDigits = faker.random.numeric(10).toString();

  mount(
    <Form
      defaultValues={{ [name]: randomDigits }}
      onSubmit={() => {
        // Do nothing
      }}
    >
      <FormattedInput name={name} label={name} patternFormat={patternFormat} markAllOnFocus />
    </Form>,
  );

  cy.contains("label", name).click();
  cy.get(`input[id=${name}]`)
    .getSelectedText()
    .then((selectedText) => {
      const randomNumberFormatted: string = randomDigits?.toString().replace(/(\d{3})(\d{3})(\d{4})/, `$1-$2-$3`);
      expect(selectedText).to.equal(randomNumberFormatted);
    });
});
