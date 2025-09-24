import { faker } from "@faker-js/faker";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, FormattedInput } from "react-hook-form-components";
import { NumericFormatProps, numericFormatter } from "react-number-format";
import { useRef } from "react";
import * as yup from "yup";
import { mount } from "cypress/react";

const numericFormat: NumericFormatProps = {
  thousandSeparator: faker.random.alpha(),
};

it("submitting through the ref works", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.number(),
  });

  const randomNumber = faker.datatype.number({
    min: 10_000,
  });

  const FormWithRef = () => {
    const ref = useRef<HTMLFormElement | null>(null);
    return (
      <Form formRef={ref} onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
        <FormattedInput name={name} label={name} numericFormat={numericFormat} />
        <span id="testButton" onClick={() => ref.current?.requestSubmit()}>
          Submit
        </span>
      </Form>
    );
  };
  mount(<FormWithRef />);

  cy.contains("label", name).click();
  cy.focused().type(randomNumber.toString());
  cy.get(`input[id=${name}]`).should("have.value", numericFormatter(randomNumber.toString(), numericFormat));
  cy.get("span[id=testButton]").click();
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomNumber });
});

it("submitting through the ref checks for yup errors", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.number().max(1),
  });

  const randomNumber = faker.datatype.number({
    min: 10_000,
  });

  const FormWithRef = () => {
    const ref = useRef<HTMLFormElement | null>(null);
    return (
      <Form formRef={ref} onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
        <FormattedInput name={name} label={name} numericFormat={numericFormat} />
        <span id="testButton" onClick={() => ref.current?.requestSubmit()}>
          Submit
        </span>
      </Form>
    );
  };
  mount(<FormWithRef />);

  cy.contains("label", name).click();
  cy.focused().type(randomNumber.toString());
  cy.get(`input[id=${name}]`).should("have.value", numericFormatter(randomNumber.toString(), numericFormat));
  cy.get("span[id=testButton]").click();
  cy.get("@onSubmitSpy").should("not.be.calledOnceWith", { [name]: randomNumber });
});
