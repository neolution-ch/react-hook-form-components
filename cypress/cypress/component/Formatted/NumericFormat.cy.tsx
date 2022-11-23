import { faker } from "@faker-js/faker";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, FormattedInput } from "react-hook-form-components";
import { NumericFormatProps, numericFormatter } from "react-number-format";
import * as yup from "yup";

it("numeric format works", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.number(),
  });

  const randomNumber = faker.datatype.number({
    min: 10000,
  });

  const numericFormat: NumericFormatProps = {
    thousandSeparator: faker.random.alpha(),
  };

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
