import { RatingInput, Form } from "react-hook-form-components";
import { faker } from "@faker-js/faker";

it("rating selection works", () => {
  const name = faker.random.alpha(10);
  const selectedRating = faker.datatype.number({ min: 1, max: 5 });

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")}>
      <RatingInput name={name} label={name} />
      <input type="submit" />
    </Form>,
  );

  // Click on a specific star
  cy.get(`input[value="${selectedRating}"]`).click({ force: true });

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: selectedRating });
});

it("default rating value works", () => {
  const name = faker.random.alpha(10);
  const defaultRating = faker.datatype.number({ min: 1, max: 5 });

  cy.mount(
    <Form defaultValues={{ [name]: defaultRating }} onSubmit={cy.spy().as("onSubmitSpy")}>
      <RatingInput name={name} label={name} />
      <input type="submit" />
    </Form>,
  );

  // Verify the default rating is selected
  cy.get(`input[value="${defaultRating}"]`).should("be.checked");

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: defaultRating });
});

it("disabled rating works", () => {
  const name = faker.random.alpha(10);

  cy.mount(
    <Form onSubmit={() => {}}>
      <RatingInput name={name} label={name} disabled />
    </Form>,
  );

  // All radio buttons should be disabled
  cy.get(`input`).each(($input) => {
    cy.wrap($input).should("be.disabled");
  });
});

it("precision works with half stars", () => {
  const name = faker.random.alpha(10);
  const halfStarRating = 3.5;

  cy.mount(
    <Form defaultValues={{ [name]: halfStarRating }} onSubmit={cy.spy().as("onSubmitSpy")}>
      <RatingInput name={name} label={name} precision={0.5} />
      <input type="submit" />
    </Form>,
  );

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: halfStarRating });
});

it("onBlur handler gets called", () => {
  const name = faker.random.alpha(10);

  cy.mount(
    <Form onSubmit={() => {}}>
      <RatingInput name={name} label={name} onBlur={cy.spy().as("onBlurSpy")} />
    </Form>,
  );

  cy.get(`input[value="3"]`).focus();
  cy.get(`input[value="3"]`).blur();
  cy.get("@onBlurSpy").should("be.called");
});

it("onChange handler gets called", () => {
  const name = faker.random.alpha(10);
  const newRating = 4;

  cy.mount(
    <Form onSubmit={() => {}}>
      <RatingInput name={name} label={name} onChange={cy.spy().as("onChangeSpy")} />
    </Form>,
  );

  cy.get(`input[value="${newRating}"]`).click({ force: true });
  cy.get("@onChangeSpy").should("be.calledWithMatch", Cypress.sinon.match.any, newRating);
});
