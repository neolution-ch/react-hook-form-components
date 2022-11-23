/* eslint-disable max-lines */
import { DatePickerInput, Form } from "react-hook-form-components";
import "react-datepicker/dist/react-datepicker.css";
import { faker } from "@faker-js/faker";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

it("basic example works", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.string().required(),
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
  todayMidnight.setHours(0, 0, 0, 0);
  todayMidnight.setMinutes(todayMidnight.getMinutes() - todayMidnight.getTimezoneOffset());

  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: todayMidnight.toString() });
});
