import { Form, ColorPickerInput } from "react-hook-form-components";
import { faker } from "@faker-js/faker";
import { mount } from "cypress/react18";

it("select correct color by specific format", () => {
  const hexName = faker.random.alpha(10);
  const rgbName = faker.random.alpha(10);
  const whiteHex = "#ffffff";
  const whiteRgb = "rgb(255, 255, 255)";
  mount(
    <div className="p-4">
      <Form onSubmit={cy.spy().as("onSubmitSpy")}>
        <ColorPickerInput name={hexName} useBootstrapStyle label="hex" format="hex" convertColorToFormatOrUndefinedOnBlur={false} />
        <ColorPickerInput name={rgbName} useBootstrapStyle label="rgb" format="rgb" convertColorToFormatOrUndefinedOnBlur={false} />

        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  cy.get(`#${hexName}`).type(whiteHex);
  // MUI converts colors to rgb
  cy.get(`#${hexName}`).parent().children().find(".MuiButtonBase-root").should("have.css", "background-color", whiteRgb);
  cy.get(`#${rgbName}`).type(whiteRgb);
  cy.get(`#${rgbName}`).parent().children().find(".MuiButtonBase-root").should("have.css", "background-color", whiteRgb);

  cy.get("input[type=submit]").click();
  cy.get("@onSubmitSpy").should("be.calledWith", { [hexName]: whiteHex, [rgbName]: whiteRgb });
});

it("converts color specified in another format to provided format", () => {
  const hexName = faker.random.alpha(10);
  const rgbName = faker.random.alpha(10);
  const blackHex = "#000000";
  const blackRgb = "rgb(0, 0, 0)";
  mount(
    <div className="p-4">
      <Form onSubmit={cy.spy().as("onSubmitSpy")}>
        <ColorPickerInput name={hexName} useBootstrapStyle label="hex" format="hex" />
        <ColorPickerInput name={rgbName} useBootstrapStyle label="rgb" format="rgb" />

        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  cy.get(`#${hexName}`).type("black");
  // MUI converts colors to rgb
  cy.get(`#${hexName}`).parent().children().find(".MuiButtonBase-root").should("have.css", "background-color", blackRgb);
  cy.get(`#${rgbName}`).type("black");
  cy.get(`#${rgbName}`).parent().children().find(".MuiButtonBase-root").should("have.css", "background-color", blackRgb);

  cy.get("input[type=submit]").click();
  cy.get("@onSubmitSpy").should("be.calledWith", { [hexName]: blackHex, [rgbName]: blackRgb });
});

it("recognize color coming from default values (even if specified in different format)", () => {
  const hexName = faker.random.alpha(10);
  const rgbName = faker.random.alpha(10);
  const blackHex = "#000000";
  const blackRgb = "rgb(0, 0, 0)";
  mount(
    <div className="p-4">
      <Form
        onSubmit={cy.spy().as("onSubmitSpy")}
        defaultValues={{
          [hexName]: "black",
          [rgbName]: blackHex,
        }}
      >
        <ColorPickerInput name={hexName} useBootstrapStyle label="hex" format="hex" />
        <ColorPickerInput name={rgbName} useBootstrapStyle label="rgb" format="rgb" />
      </Form>
    </div>,
  );

  // MUI converts colors to rgb
  cy.get(`#${hexName}`).parent().children().find(".MuiButtonBase-root").should("have.css", "background-color", blackRgb);
  cy.get(`#${rgbName}`).parent().children().find(".MuiButtonBase-root").should("have.css", "background-color", blackRgb);
});
