/* eslint-disable max-lines */
import { Form, Input } from "react-hook-form-components";
import { faker } from "@faker-js/faker";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputGroupText } from "reactstrap";
import { useRef } from "react";

describe("Input.cy.tsx", () => {
  it("basic text input works", () => {
    const name = faker.random.alpha(10);
    const schema = yup.object().shape({
      [name]: yup.string(),
    });

    const randomWord = faker.random.word();

    cy.mount(
      <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
        <Input name={name} label={name} />

        <input type={"submit"} />
      </Form>,
    );

    cy.contains("label", name).click();
    cy.focused().type(randomWord.toString());
    cy.get("input[type=submit]").click({ force: true });

    cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomWord });
  });

  it("passing the ref works", () => {
    const name = faker.random.alpha(10);
    const schema = yup.object().shape({
      [name]: yup.string(),
    });

    const randomNumber = faker.datatype.number();

    const InputWithRef = () => {
      const ref = useRef<HTMLInputElement>(null);

      const handleClick = () => {
        if (ref.current) {
          const value = Number(ref.current.value);
          ref.current.value = String(value + 1);
        }
      };

      return (
        <Form
          defaultValues={{ [name]: randomNumber }}
          onSubmit={() => {
            // nothing to do
          }}
          resolver={yupResolver(schema)}
        >
          <Input type="number" innerRef={ref} name={name} label={name} />
          <button onClick={handleClick}>Increment</button>
        </Form>
      );
    };

    cy.mount(<InputWithRef />);

    cy.get("input[type=number]").should("have.value", randomNumber);
    cy.get("button").click({ force: true });
    cy.get("input[type=number]").should("have.value", randomNumber + 1);
  });

  it("number gets passed as number and not string", () => {
    const name = faker.random.alpha(10);
    const schema = yup.object().shape({
      [name]: yup.number(),
    });

    const randomNumber = faker.datatype.number();

    cy.mount(
      <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
        <Input type="number" name={name} label={name} />

        <input type={"submit"} />
      </Form>,
    );

    cy.contains("label", name).click();
    cy.focused().type(randomNumber.toString());
    cy.get("input[type=submit]").click({ force: true });

    cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomNumber });
  });

  it("number input correctly increase value according to step", () => {
    const name = faker.random.alpha(10);
    const schema = yup.object().shape({
      [name]: yup.number(),
    });

    const step = faker.datatype.number({ min: 1 });
    const randomNumber = faker.datatype.number();
    const expectedResult = randomNumber + step - (randomNumber % step);

    cy.mount(
      <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
        <Input type="number" name={name} label={name} step={step} />

        <input type={"submit"} />
      </Form>,
    );

    cy.contains("label", name).click();
    cy.focused().type(randomNumber.toString());
    cy.get(`input[id=${name}]`).should("have.attr", "step", step.toString());
    cy.get(`input[id=${name}]`).click({ force: true });
    cy.get(`input[id=${name}]`).type("{uparrow}");
    cy.get("input[type=submit]").click({ force: true });

    cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: expectedResult });
  });

  it("help text gets displayed", () => {
    const name = faker.random.alpha(10);
    const schema = yup.object().shape({
      [name]: yup.string(),
    });

    const helpText = faker.random.words();

    cy.mount(
      <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
        <Input name={name} label={name} helpText={helpText} />

        <input type={"submit"} />
      </Form>,
    );

    cy.contains(helpText);
  });

  it("validation works", () => {
    const name = faker.random.alpha(10);
    const errorMessage = faker.random.words();
    const schema = yup.object().shape({
      [name]: yup.string().required(errorMessage),
    });

    const randomWord = faker.random.word();

    cy.mount(
      <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
        <Input name={name} label={name} />

        <input type={"submit"} />
      </Form>,
    );

    cy.get(`input[id=${name}]`).type(randomWord);
    cy.get(`input[id=${name}]`).clear();
    cy.get("input[type=submit]").click({ force: true });
    cy.get(`input[id="${name}"]`).should("have.attr", "class").and("contain", "is-invalid");
    cy.get(`input[id="${name}"]`).parents("div").find(".invalid-feedback").should("be.visible").should("have.text", errorMessage);

    cy.contains("label", name).click();
    cy.focused().type(randomWord.toString());
    cy.get("input[type=submit]").click({ force: true });

    cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomWord });
  });

  it("validation works for nested fields", () => {
    const objectName = faker.random.alpha(10);
    const propertyName = faker.random.alpha(10);
    const errorMessage = faker.random.words();
    const schema = yup.object().shape({
      [objectName]: yup.object().shape({
        [propertyName]: yup.string().required(errorMessage),
      }),
    });

    const name = `${objectName}.${propertyName}`;
    const randomWord = faker.random.word();

    cy.mount(
      <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
        <Input name={name} label={name} />

        <input type={"submit"} />
      </Form>,
    );

    cy.get(`input[id="${name}"]`).type(randomWord);
    cy.get(`input[id="${name}"]`).clear();
    cy.get("input[type=submit]").click({ force: true });
    cy.get(`input[id="${name}"]`).parents("div").find(".invalid-feedback").should("be.visible").should("have.text", errorMessage);
    cy.get(`input[id="${name}"]`).should("have.attr", "class").and("contain", "is-invalid");

    cy.contains("label", name).click();
    cy.focused().type(randomWord.toString());
    cy.get("input[type=submit]").click({ force: true });

    cy.get("@onSubmitSpy").should("be.calledOnceWith", { [objectName]: { [propertyName]: randomWord } });
  });

  it("on change handler gets called", () => {
    const name = faker.random.alpha(10);
    const schema = yup.object().shape({
      [name]: yup.string(),
    });

    const randomWord = faker.random.word();

    cy.mount(
      <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
        <Input name={name} label={name} onChange={cy.spy().as("onChangeSpy")} />

        <input type={"submit"} />
      </Form>,
    );

    cy.contains("label", name).click();
    cy.focused().type(randomWord.toString());
    cy.get("@onChangeSpy").should("be.calledWithMatch", { target: { value: randomWord } });
    cy.get("@onChangeSpy").should("have.callCount", randomWord.length);
  });

  it("on blur handler gets called", () => {
    const name = faker.random.alpha(10);
    const schema = yup.object().shape({
      [name]: yup.string(),
    });

    const randomWord = faker.random.word();

    cy.mount(
      <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
        <Input name={name} label={name} onBlur={cy.spy().as("onBlurSpy")} />

        <input type={"submit"} />
      </Form>,
    );

    cy.contains("label", name).click();
    cy.focused().type(randomWord.toString());
    cy.get("input[type=submit]").click({ force: true });
    cy.get("@onBlurSpy").should("be.calledWithMatch", { target: { value: randomWord } });
  });

  it("on key down handler gets called", () => {
    const name = faker.random.alpha(10);
    const schema = yup.object().shape({
      [name]: yup.string(),
    });

    const randomWord = faker.random.word();

    cy.mount(
      <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
        {/* <Input name={name} label={name} onKeyDown={(e) => console.log("key down", e)} /> */}
        <Input name={name} label={name} onKeyDown={cy.spy().as("onKeyDownSpy")} />

        <input type={"submit"} />
      </Form>,
    );

    cy.contains("label", name).click();
    cy.focused().type(randomWord.toString());
    for (const char of randomWord) {
      cy.get("@onKeyDownSpy").should("be.calledWithMatch", { key: char });
    }
    cy.get("@onKeyDownSpy").should("have.callCount", randomWord.length);
  });

  it("text area works", () => {
    const name = faker.random.alpha(10);
    const textAreaRows = faker.datatype.number({ min: 6, max: 10 });
    const schema = yup.object().shape({
      [name]: yup.string(),
      [textAreaRows]: yup.number(),
    });

    const randomWords = faker.random.words(25);

    cy.mount(
      <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
        <Input type="textarea" name={name} label={name} textAreaRows={textAreaRows} />

        <input type={"submit"} />
      </Form>,
    );

    cy.contains("label", name).click();
    cy.focused().type(randomWords.toString());
    cy.get("textarea").should("have.attr", "rows", textAreaRows);
    cy.get("input[type=submit]").click({ force: true });

    cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomWords });
  });

  it("email input works", () => {
    const name = faker.random.alpha(10);
    const schema = yup.object().shape({
      [name]: yup.string(),
    });

    const invalidEmail = faker.random.word();
    const validEmail = faker.internet.email();

    cy.mount(
      <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
        <Input type="email" name={name} label={name} />

        <input type={"submit"} />
      </Form>,
    );

    cy.contains("label", name).click();
    cy.focused().type(invalidEmail.toString());
    cy.get("input[type=submit]").click({ force: true });
    cy.get("@onSubmitSpy").should("have.callCount", 0);

    cy.get(`input[id=${name}]`).clear();
    cy.get(`input[id=${name}]`).type(validEmail.toString());
    cy.get("input[type=submit]").click({ force: true });
    cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: validEmail });
  });

  it("password input works", () => {
    const name = faker.random.alpha(10);
    const schema = yup.object().shape({
      [name]: yup.string(),
    });

    const randomWord = faker.random.word();

    cy.mount(
      <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
        <Input type="password" name={name} label={name} />

        <input type={"submit"} />
      </Form>,
    );

    cy.contains("label", name).click();
    cy.focused().type(randomWord.toString());
    cy.get("input[type=submit]").click({ force: true });

    cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomWord });
  });

  it("range input works", () => {
    const name = faker.random.alpha(10);
    const schema = yup.object().shape({
      [name]: yup.number(),
    });

    const [min, selectedValue, max] = faker.helpers.uniqueArray(faker.datatype.number, 3).sort((a, b) => a - b);

    cy.mount(
      <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
        <Input type="range" name={name} label={name} rangeMin={min} rangeMax={max} />

        <input type={"submit"} />
      </Form>,
    );

    cy.get(`input[id=${name}]`).setSliderValue(selectedValue);
    cy.get("input[type=submit]").click({ force: true });
    cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: selectedValue });
  });

  it("is disabled", () => {
    const name = faker.random.word();

    cy.mount(
      <Form
        onSubmit={() => {
          // Do nothing
        }}
      >
        <Input name={name} label={name} disabled />
      </Form>,
    );

    cy.get(`input[name=${name}]`).should("be.disabled");
  });

  it("placeholder", () => {
    const name = faker.random.word();
    const placeholder = faker.random.word();

    cy.mount(
      <Form
        onSubmit={() => {
          // Do nothing
        }}
      >
        <Input name={name} label={name} placeholder={placeholder} />
      </Form>,
    );

    cy.get(`input[name=${name}]`).invoke("attr", "placeholder").should("eq", placeholder);
  });

  it("auto mark on focus", () => {
    const name = faker.random.word();
    const value = faker.random.word();

    cy.mount(
      <Form
        defaultValues={{ [name]: value }}
        onSubmit={() => {
          // Do nothing
        }}
      >
        <Input name={name} label={name} markAllOnFocus />
      </Form>,
    );

    cy.contains("label", name).click();
    cy.get(`input[id=${name}]`).getSelectedText().should("eq", value);
  });

  it("contains pencil icon if provided for Input with no type", () => {
    const name = faker.random.alpha(10);
    const schema = yup.object().shape({
      [name]: yup.date(),
    });

    cy.mount(
      <Form
        onSubmit={() => {
          // Nothing to do
        }}
        resolver={yupResolver(schema)}
      >
        <Input
          name={name}
          label={name}
          addonRight={
            <InputGroupText>
              <FontAwesomeIcon icon={faPencil} />
            </InputGroupText>
          }
        />
      </Form>,
    );

    cy.get(`label[for=${name}]`).parent().find("svg[data-icon=pencil]");
  });
});

it("minlenght and maxlenght work", () => {
  const name = faker.random.word();
  const minLength = 3;
  const maxLength = 10;
  const validInput = faker.random.alpha({ count: minLength });
  const invalidInput = faker.random.alpha({ count: maxLength + 1 });

  cy.mount(
    <Form
      onSubmit={() => {
        // Do nothing
      }}
    >
      <Input type="text" name={name} label={name} minLength={minLength} maxLength={maxLength} />
      <input type={"submit"} />
    </Form>,
  );

  cy.get(`input[name=${name}]`).type(validInput);
  cy.get(`input[name=${name}]`).should("have.value", validInput);
  cy.get(`input[name=${name}]`).clear();
  cy.get(`input[name=${name}]`).type(invalidInput);
  cy.get(`input[name=${name}]`).should("have.value", invalidInput.slice(0, maxLength));
});
