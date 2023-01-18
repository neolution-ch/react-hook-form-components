/* eslint-disable max-lines */
import { Form, Input } from "react-hook-form-components";
import { faker } from "@faker-js/faker";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

it("label tooltip gets rendered correctly", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.string(),
  });

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
      {/* todo: pass in a label tool tip here, ideally generated by faker like the name above. */}
      <Input name={name} label={name} />

      <input type={"submit"} />
    </Form>,
  );

  // todo: check if the label tooltip is displayed on hover.
});
