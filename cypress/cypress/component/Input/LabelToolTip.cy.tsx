import { Form, Input } from "react-hook-form-components";
import { faker } from "@faker-js/faker";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { mount } from "cypress/react";

it("label tooltip gets rendered correctly", () => {
  const name = faker.random.alpha(10);
  const labelToolTip = faker.random.alpha(30);
  const schema = yup.object().shape({
    [name]: yup.string(),
  });

  mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
      <Input name={name} label={name} labelToolTip={labelToolTip} />

      <input type={"submit"} />
    </Form>,
  );

  cy.get(`#Tooltip-${name}`).trigger("mouseover");
  cy.get("div.tooltip").should("be.visible");
  cy.get("div.tooltip").should("have.text", labelToolTip);
});
