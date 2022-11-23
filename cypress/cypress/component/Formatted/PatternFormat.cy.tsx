import { faker } from "@faker-js/faker";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, FormattedInput } from "react-hook-form-components";
import { PatternFormatProps, patternFormatter } from "react-number-format";
import * as yup from "yup";

it("pattern format works", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.string(),
  });

  const randomDigits = faker.random.numeric(10).toString();

  const patternFormat: PatternFormatProps = {
    format: "###-###-####",
    allowEmptyFormatting: true,
    mask: "_",
  };

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
      <FormattedInput name={name} label={name} patternFormat={patternFormat} />

      <input type={"submit"} />
    </Form>,
  );

  cy.contains("label", name).click().type(randomDigits.toString());
  cy.get(`input[id=${name}]`).should("have.value", patternFormatter(randomDigits, patternFormat));
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: patternFormatter(randomDigits, patternFormat) });
});
