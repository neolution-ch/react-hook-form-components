import { Form, StaticTypeaheadInput } from "react-hook-form-components";
import { faker, Sex } from "@faker-js/faker";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { generateOptions } from "../../helpers/typeahead";
import { useEffect, useRef } from "react";
import TypeheadRef from "react-bootstrap-typeahead/types/core/Typeahead";

it("works with single simple options", () => {
  const { simpleOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const randomOptions = faker.helpers.arrayElements(simpleOptions, 2);

  const [defaultSelectedOption, changedOption] = randomOptions;

  cy.mount(
    <Form
      onSubmit={cy.spy().as("onSubmitSpy")}
      defaultValues={{
        [name]: defaultSelectedOption,
      }}
    >
      <StaticTypeaheadInput name={name} label={name} options={simpleOptions} defaultSelected={[defaultSelectedOption]} />
      <input type="submit" />
    </Form>,
  );

  cy.get(`#${name}`).should("have.value", defaultSelectedOption);
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: defaultSelectedOption });

  cy.get(`#${name}`).clear().click();
  cy.get(`a[aria-label='${changedOption}']`).click();
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledWith", { [name]: changedOption });
});

it("select automatically a single simple options - single", () => {
  const { simpleOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const randomOptions = faker.helpers.arrayElements(simpleOptions, 2);
  const [firstOption] = randomOptions;

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")}>
      <StaticTypeaheadInput name={name} label={name} options={simpleOptions} />
      <input type="submit" />
    </Form>,
  );

  cy.get(`#${name}`).type(firstOption);
  cy.get(`#${name}`).blur({ force: true });
  cy.wait(100);
  cy.get("div[class=invalid-feedback]").should("not.be.visible");
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: firstOption });
});

it("display an error if more than one options are found and not selected - single", () => {
  const { simpleOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const randomOptions = faker.helpers.arrayElements(simpleOptions, 2);
  const [firstOption] = randomOptions;
  const errorMessage = faker.random.words(3);

  const additionalOption = firstOption.concat("xyz");

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")}>
      <StaticTypeaheadInput name={name} label={name} options={simpleOptions.concat(additionalOption)} invalidErrorMessage={errorMessage} />
      <input type="submit" />
    </Form>,
  );

  cy.get(`#${name}`).type(firstOption);
  cy.get(`#${name}`).blur({ force: true });
  cy.wait(100);
  cy.get("div[class=invalid-feedback]").should("be.visible").should("have.text", errorMessage);
  cy.get("input[type=submit]")
    .click({ force: true })
    .then(() => {
      cy.get("@onSubmitSpy").should("not.have.been.called");
    });
  cy.get("div[class=invalid-feedback]").should("be.visible").should("have.text", errorMessage);
});

it("select automatically a single simple options - multiple", () => {
  const { simpleOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const randomOptions = faker.helpers.arrayElements(simpleOptions, 2);
  const [firstOption, secondOption] = randomOptions;

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")}>
      <StaticTypeaheadInput name={name} label={name} options={simpleOptions} multiple />
      <input type="submit" />
    </Form>,
  );

  cy.get(`#${name}`).type(firstOption);
  cy.get(`#${name}`).blur({ force: true });
  cy.wait(100);
  cy.get(`#${name}`).type(secondOption);
  cy.get(`#${name}`).blur({ force: true });
  cy.wait(100);
  cy.get("div[class=invalid-feedback]").should("not.be.visible");
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: [firstOption, secondOption] });
});

it("display an error if more than one options are found and not selected - multiple", () => {
  const { simpleOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const randomOptions = faker.helpers.arrayElements(simpleOptions, 2);
  const [firstOption, secondOption] = randomOptions;
  const errorMessage = faker.random.words(3);

  const additionalOption = secondOption.concat("xyz");

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")}>
      <StaticTypeaheadInput
        name={name}
        label={name}
        options={simpleOptions.concat(additionalOption)}
        multiple
        invalidErrorMessage={errorMessage}
      />
      <input type="submit" />
    </Form>,
  );

  cy.get(`#${name}`).type(firstOption);
  cy.get(`#${name}`).blur({ force: true });
  cy.wait(100);
  cy.get(`#${name}`).type(secondOption);
  cy.get(`#${name}`).blur({ force: true });
  cy.wait(100);
  cy.get("div[class=invalid-feedback]").should("exist");
  cy.get("input[type=submit]")
    .click({ force: true })
    .then(() => {
      cy.get("@onSubmitSpy").should("not.have.been.called");
    });
  cy.get("div[class=invalid-feedback]").should("be.visible").should("have.text", errorMessage);
});

it("works with multiple simple options", () => {
  const { simpleOptions } = generateOptions();
  const name = faker.random.alpha(10);

  const randomOptions = faker.helpers.arrayElements(simpleOptions, faker.datatype.number({ min: 2, max: 5 }));
  const half = Math.ceil(randomOptions.length / 2);

  const defaultSelectedOptions = randomOptions.slice(0, half);
  const changedOptions = randomOptions.slice(half);

  cy.mount(
    <Form
      onSubmit={cy.spy().as("onSubmitSpy")}
      defaultValues={{
        [name]: defaultSelectedOptions,
      }}
    >
      <StaticTypeaheadInput multiple name={name} label={name} options={simpleOptions} defaultSelected={defaultSelectedOptions} />
      <input type="submit" />
    </Form>,
  );

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: defaultSelectedOptions });

  cy.get(`#${name}`).click().type("{backspace}".repeat(20));

  for (const option of changedOptions) {
    cy.get(`#${name}`).click();
    cy.get(`a[aria-label='${option}']`).click();
  }

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledWith", { [name]: changedOptions });
});

it("works with single object options", () => {
  const { objectOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const [defaultSelectedOption, changedOption] = faker.helpers.arrayElements(objectOptions, 2);

  cy.mount(
    <Form
      onSubmit={cy.spy().as("onSubmitSpy")}
      defaultValues={{
        [name]: defaultSelectedOption.value,
      }}
    >
      <StaticTypeaheadInput name={name} label={name} options={objectOptions} defaultSelected={[defaultSelectedOption.label]} />
      <input type="submit" />
    </Form>,
  );

  cy.get(`#${name}`).should("have.value", defaultSelectedOption.label);
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: defaultSelectedOption.value });

  cy.get(`#${name}`).clear().click();
  cy.get(`a[aria-label='${changedOption.label}']`).click();
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledWith", { [name]: changedOption.value });
});

it("works with multiple object options", () => {
  const options = generateOptions(100);
  const name = faker.random.alpha(10);
  const randomOptions = faker.helpers.arrayElements(options.objectOptions, faker.datatype.number({ min: 2, max: 5 }));
  const half = Math.ceil(randomOptions.length / 2);

  const defaultSelectedOptions = randomOptions.slice(0, half);
  const changedOptions = randomOptions.slice(half);

  cy.mount(
    <Form
      onSubmit={cy.spy().as("onSubmitSpy")}
      defaultValues={{
        [name]: defaultSelectedOptions.map((o) => o.value),
      }}
    >
      <StaticTypeaheadInput multiple defaultSelected={defaultSelectedOptions} name={name} label={name} options={options.objectOptions} />
      <input type="submit" />
    </Form>,
  );

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: defaultSelectedOptions.map((o) => o.value) });

  cy.get(`#${name}`).click().type("{backspace}".repeat(20));

  for (const changedOption of changedOptions) {
    cy.get(`#${name}`).click().type(changedOption.label);
    cy.get(`a[aria-label='${changedOption.label}']`).click();
  }

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledWith", { [name]: changedOptions.map((o) => o.value) });
});

it("Validation works", () => {
  const { simpleOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const randomOption = faker.helpers.arrayElement(simpleOptions);
  const errorMessage = faker.lorem.sentence();

  const schema = yup.object({
    [name]: yup.string().required(errorMessage),
  });

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
      <StaticTypeaheadInput name={name} label={name} options={simpleOptions} />
      <input type="submit" />
    </Form>,
  );

  cy.get("input[type=submit]").click({ force: true });
  cy.contains(errorMessage).should("exist");

  cy.get(`#${name}`).click();
  cy.contains("a", randomOption).click();
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomOption });
});

it("works with the correct value onChange", () => {
  const { simpleOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const randomOption = faker.helpers.arrayElement(simpleOptions);

  cy.mount(
    <Form
      onSubmit={() => {
        // Nothing to do
      }}
    >
      <StaticTypeaheadInput name={name} label={name} options={simpleOptions} onChange={cy.spy().as("OnChangeSpy")} />
      <input type="submit" />
    </Form>,
  );

  cy.get(`#${name}`).clear().click();
  cy.get(`a[aria-label='${randomOption}']`).click();
  cy.get("@OnChangeSpy").should("have.been.calledWith", randomOption);
});

it("is disabled", () => {
  const name = faker.random.word();
  const { simpleOptions } = generateOptions(100);

  cy.mount(
    <Form
      onSubmit={() => {
        // Do nothing
      }}
    >
      <StaticTypeaheadInput name={name} label={name} options={simpleOptions} disabled />
    </Form>,
  );

  cy.get("input.rbt-input-main").should("be.disabled");
});

it("auto mark on focus", () => {
  const { simpleOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const randomOption = faker.helpers.arrayElement(simpleOptions);

  cy.mount(
    <Form
      onSubmit={() => {
        // Do nothing
      }}
    >
      <StaticTypeaheadInput defaultSelected={[randomOption]} name={name} label={name} options={simpleOptions} markAllOnFocus />
    </Form>,
  );

  cy.contains("label", name).click();
  cy.get(`input[id=${name}]`).getSelectedText().should("eq", randomOption);
});

it("disabled options", () => {
  const { disabledOptions } = generateOptions();
  const name = faker.random.alpha(10);

  const randomOptions = faker.helpers.arrayElements(disabledOptions, faker.datatype.number({ min: 2, max: 5 }));
  const half = Math.ceil(randomOptions.length / 2);

  const defaultSelectedOptions = randomOptions.slice(0, half);
  const changedOptions = randomOptions.slice(half);

  cy.mount(
    <Form
      onSubmit={cy.spy().as("onSubmitSpy")}
      defaultValues={{
        [name]: defaultSelectedOptions,
      }}
    >
      <StaticTypeaheadInput multiple name={name} label={name} options={disabledOptions} defaultSelected={defaultSelectedOptions} />
      <input type="submit" />
    </Form>,
  );

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: defaultSelectedOptions });

  cy.get(`#${name}`).click().type("{backspace}".repeat(20));

  for (const option of changedOptions) {
    cy.get(`#${name}`).click();
    cy.get(`a[aria-label='${option.label}']`).should("have.class", "disabled");
  }
});

it("empty label", () => {
  const { simpleOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const emptyLabel = faker.random.words(5);

  cy.mount(
    <Form
      onSubmit={cy.spy().as("onSubmitSpy")}
      defaultValues={{
        [name]: simpleOptions,
      }}
    >
      <StaticTypeaheadInput
        multiple
        name={name}
        label={name}
        options={simpleOptions}
        defaultSelected={simpleOptions}
        emptyLabel={emptyLabel}
      />
      <input type="submit" />
    </Form>,
  );

  cy.get(`#${name}`).click();
  cy.get(".dropdown-menu > .dropdown-item").should("have.text", emptyLabel);
});

it("placeholder", () => {
  const { simpleOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const placeholder = faker.random.words(5);

  cy.mount(
    <Form
      onSubmit={cy.spy().as("onSubmitSpy")}
      defaultValues={{
        [name]: simpleOptions,
      }}
    >
      <StaticTypeaheadInput multiple name={name} label={name} options={simpleOptions} placeholder={placeholder} />
      <input type="submit" />
    </Form>,
  );
  cy.get(`#${name}`).should("have.attr", "placeholder", placeholder);
});

it("use input-ref", () => {
  const { simpleOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const placeholder = faker.random.words(5);

  const TestForm = () => {
    const ref = useRef<TypeheadRef | null>(null);

    useEffect(() => {
      if (ref.current) {
        ref.current.toggleMenu();
      }
    }, [ref]);

    return (
      <Form
        onSubmit={cy.spy().as("onSubmitSpy")}
        defaultValues={{
          [name]: simpleOptions,
        }}
      >
        <StaticTypeaheadInput inputRef={ref} name={name} label={name} options={simpleOptions} placeholder={placeholder} />
      </Form>
    );
  };

  cy.mount(<TestForm />);
  cy.get(".rbt-menu.dropdown-menu.show").should("be.visible");
});

it("grouping options", () => {
  const COUNT = 10;
  const { groupedOptions } = generateOptions(COUNT);
  const name = faker.random.alpha(10);

  cy.mount(
    <Form
      onSubmit={() => {
        // Nothing to do
      }}
    >
      <StaticTypeaheadInput useGroupBy name={name} label={name} options={groupedOptions} />
      <input type="submit" />
    </Form>,
  );

  cy.get(`#${name}`).click();
  cy.get(".dropdown-menu.show")
    .find("a")
    .should("have.length", COUNT + 1);
  cy.get(".dropdown-header").first().should("be.visible").and("have.text", Sex.Male);
  cy.get(".dropdown-header").eq(1).should("be.visible").and("have.text", Sex.Female);
  cy.contains("a", groupedOptions[0].label).should("have.class", "disabled");
  cy.contains("a", groupedOptions[COUNT].label).should("exist");
});
