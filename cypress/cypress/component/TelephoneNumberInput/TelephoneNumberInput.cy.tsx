import { Form, TelephoneNumberInput } from "react-hook-form-components";
import { faker } from "@faker-js/faker";
import { mount } from "cypress/react";

it("correctly set telephone number", () => {
  const name = faker.random.alpha(10);

  mount(
    <div className="p-4">
      <Form onSubmit={cy.spy().as("onSubmitSpy")}>
        <TelephoneNumberInput name={name} useBootstrapStyle label="Phone Number" defaultCountry="CH" />
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  cy.get("input[type=submit]").click();
  cy.get("@onSubmitSpy").should("be.calledWith", { [name]: undefined });

  cy.get(`#${name}`).type("123456789");
  cy.get("input[type=submit]").click();
  cy.get("@onSubmitSpy").should("be.calledWith", { [name]: "+41123456789" });
});

it("correctly change country telephone number (searching for country or country prefix)", () => {
  const name = faker.random.alpha(10);

  mount(
    <div className="p-4">
      <Form onSubmit={cy.spy().as("onSubmitSpy")}>
        <TelephoneNumberInput name={name} useBootstrapStyle label="Phone Number" defaultCountry="CH" />
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  cy.get(`.MuiInputAdornment-root`).click();
  cy.get(`.MuiInputBase-input:not(#${name})`).clear();
  cy.get(`.MuiInputBase-input:not(#${name})`).type("IT");
  cy.get(`.MuiAutocomplete-option`).click();
  cy.get(`#${name}`).type("1234567890");

  cy.get("input[type=submit]").click();
  cy.get("@onSubmitSpy").should("be.calledWith", { [name]: "+391234567890" });

  cy.get(`.MuiInputAdornment-root`).click();
  cy.get(`.MuiInputBase-input:not(#${name})`).clear();
  cy.get(`.MuiInputBase-input:not(#${name})`).type("+234");
  cy.get(`.MuiAutocomplete-option`).click();
  cy.get(`#${name}`).clear();
  cy.get(`#${name}`).type("678901234");

  cy.get("input[type=submit]").click();
  cy.get("@onSubmitSpy").should("be.calledWith", { [name]: "+234678901234" });
});

it("recognize telephone number coming from default values (even if specified in different format)", () => {
  const name = faker.random.alpha(10);

  mount(
    <div className="p-4">
      <Form defaultValues={{ [name]: "+4 4  123456789" }} onSubmit={cy.spy().as("onSubmitSpy")}>
        <TelephoneNumberInput name={name} useBootstrapStyle label="Phone Number" defaultCountry="CH" />
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  cy.get(`.MuiInputAdornment-root`).contains("+44");
  cy.get(`#${name}`).should("have.value", "123456789");
});

it("pinning contries works", () => {
  const name = faker.random.alpha(10);

  mount(
    <div className="p-4">
      <Form defaultValues={{ [name]: "+4 4  123456789" }} onSubmit={cy.spy().as("onSubmitSpy")}>
        <TelephoneNumberInput name={name} useBootstrapStyle label="Phone Number" defaultCountry="CH" pinnedCountries={["GB", "IT"]} />
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  cy.get(`.MuiInputAdornment-root`).click();
  cy.get(`.MuiInputBase-input:not(#${name})`).clear();
  cy.get(`.MuiAutocomplete-listbox`).children().eq(0).should("contain", "+44");
  cy.get(`.MuiAutocomplete-listbox`).children().eq(1).should("contain", "+39");
  cy.get(`.MuiAutocomplete-listbox`).children().eq(2).should("contain", "──");
});
