/* eslint-disable max-lines */
import { Form, StaticTypeaheadInput } from "react-hook-form-components";
import { faker, Sex } from "@faker-js/faker";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { generateOptions } from "../../helpers/typeahead";
import { useState } from "react";

const selectOption = (name: string, text: string) => {
  cy.get(`#${name}`).clear().click().type(text);
  cy.get('li[role="option"]').contains(text).click();
};

const waitForChip = (text: string) => {
  cy.get(`span.MuiChip-label:contains(${text})`).should("be.visible");
};

it("works with single simple options", () => {
  const { simpleOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const randomOptions = faker.helpers.arrayElements(simpleOptions, 2);

  const [defaultSelectedOption, changedOption] = randomOptions;

  cy.mount(
    <div className="p-4">
      <Form
        onSubmit={cy.spy().as("onSubmitSpy")}
        defaultValues={{
          [name]: defaultSelectedOption,
        }}
      >
        <StaticTypeaheadInput name={name} label={name} options={simpleOptions} />
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  cy.get(`#${name}`).should("have.value", defaultSelectedOption);
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: defaultSelectedOption });

  selectOption(name, changedOption);
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledWith", { [name]: changedOption });
});

it("select automatically a single simple options - single (autoSelect/autoHighlight)", () => {
  const { simpleOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const randomOptions = faker.helpers.arrayElements(simpleOptions, 2);
  const [firstOption] = randomOptions;

  cy.mount(
    <div className="p-4">
      <Form onSubmit={cy.spy().as("onSubmitSpy")}>
        <StaticTypeaheadInput name={name} label={name} options={simpleOptions} autoSelect />
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  cy.get(`#${name}`).type(firstOption);
  cy.get(`#${name}`).blur();
  cy.get("ul.MuiAutocomplete-listbox").should("not.exist");
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: firstOption });
});

it("select automatically a single simple options - multiple (when autoSelect/autoHighlight)", () => {
  const { simpleOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const randomOptions = faker.helpers.arrayElements(simpleOptions, 2);

  cy.mount(
    <div className="p-4">
      <Form onSubmit={cy.spy().as("onSubmitSpy")}>
        <StaticTypeaheadInput name={name} label={name} options={simpleOptions} multiple autoSelect />
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  cy.get(`#${name}`).type(randomOptions[0]);
  cy.get(`#${name}`).blur();
  waitForChip(randomOptions[0]);

  cy.get(`#${name}`).type(randomOptions[1]);
  cy.get(`#${name}`).blur();
  waitForChip(randomOptions[1]);

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: [randomOptions[0], randomOptions[1]] });
});

it("select automatically single option when multiple options are available - single (autoSelect/autoHighlight)", () => {
  const prefix = faker.random.alpha(3);
  const options = [
    { label: prefix + faker.random.alpha(7), value: faker.datatype.uuid() },
    { label: prefix + faker.random.alpha(7), value: faker.datatype.uuid() },
  ];
  const name = faker.random.alpha(10);

  cy.mount(
    <div className="p-4">
      <Form onSubmit={cy.spy().as("onSubmitSpy")}>
        <StaticTypeaheadInput name={name} label={name} options={options} autoSelect />
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  cy.get(`#${name}`).type(prefix);
  cy.get(`#${name}`).type("{downarrow}");
  cy.get(`#${name}`).blur();
  cy.get("ul.MuiAutocomplete-listbox").should("not.exist");
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: options[1].value });
});

it("works with multiple simple options", () => {
  const options = generateOptions();
  const name = faker.random.alpha(10);
  const randomOptions = faker.helpers.arrayElements(options.objectOptions, faker.datatype.number({ min: 2, max: 5 }));
  const half = Math.ceil(randomOptions.length / 2);

  const defaultSelectedOptions = randomOptions.slice(0, half);
  const changedOptions = randomOptions.slice(half);

  cy.mount(
    <div className="p-4">
      <Form
        onSubmit={cy.spy().as("onSubmitSpy")}
        defaultValues={{
          [name]: defaultSelectedOptions.map((o) => o.value),
        }}
      >
        <StaticTypeaheadInput multiple name={name} label={name} options={options.objectOptions} />
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: defaultSelectedOptions.map((o) => o.value) });

  cy.get(`#${name}`).click().type("{backspace}".repeat(20));

  for (const changedOption of changedOptions) {
    selectOption(name, changedOption.label);
    waitForChip(changedOption.label);
  }

  cy.get(`#${name}`).blur();
  cy.get("ul.MuiAutocomplete-listbox").should("not.exist");
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledWith", { [name]: changedOptions.map((o) => o.value) });
});

it("works with single object options", () => {
  const { objectOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const [defaultSelectedOption, changedOption] = faker.helpers.arrayElements(objectOptions, 2);

  cy.mount(
    <div className="p-4">
      <Form
        onSubmit={cy.spy().as("onSubmitSpy")}
        defaultValues={{
          [name]: defaultSelectedOption.value,
        }}
      >
        <StaticTypeaheadInput name={name} label={name} options={objectOptions} />
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  cy.get(`#${name}`).should("have.value", defaultSelectedOption.label);
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: defaultSelectedOption.value });

  cy.get(`#${name}`).clear().click();
  selectOption(name, changedOption.label);
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
    <div className="p-4">
      <Form
        onSubmit={cy.spy().as("onSubmitSpy")}
        defaultValues={{
          [name]: defaultSelectedOptions.map((o) => o.value),
        }}
      >
        <StaticTypeaheadInput multiple name={name} label={name} options={options.objectOptions} />
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: defaultSelectedOptions.map((o) => o.value) });

  cy.get(`#${name}`).click().type("{backspace}".repeat(20));

  for (const changedOption of changedOptions) {
    selectOption(name, changedOption.label);
    waitForChip(changedOption.label);
  }

  cy.get(`#${name}`).blur();
  cy.get("ul.MuiAutocomplete-listbox").should("not.exist");
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
    <div className="p-4">
      <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
        <StaticTypeaheadInput name={name} label={name} options={simpleOptions} />
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  cy.get("input[type=submit]").click({ force: true });
  cy.contains(errorMessage).should("exist");

  selectOption(name, randomOption);
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomOption });
});

it("works with the correct value onChange", () => {
  const { simpleOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const randomOption = faker.helpers.arrayElement(simpleOptions);

  cy.mount(
    <div className="p-4">
      <Form
        onSubmit={() => {
          // Nothing to do
        }}
      >
        <StaticTypeaheadInput name={name} label={name} options={simpleOptions} onChange={cy.spy().as("OnChangeSpy")} />
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  selectOption(name, randomOption);
  cy.get("@OnChangeSpy").should("have.been.calledWith", randomOption);
});

it("it is disabled", () => {
  const name = faker.random.word();
  const { simpleOptions } = generateOptions();

  cy.mount(
    <div className="p-4">
      <Form
        onSubmit={() => {
          // Do nothing
        }}
      >
        <StaticTypeaheadInput name={name} label={name} options={simpleOptions} disabled />
      </Form>
    </div>,
  );

  cy.get("input").should("be.disabled");
});

it("it is readonly", () => {
  const name = faker.random.word();
  const { simpleOptions } = generateOptions();

  cy.mount(
    <div className="p-4">
      <Form
        onSubmit={() => {
          // Do nothing
        }}
      >
        <StaticTypeaheadInput name={name} label={name} options={simpleOptions} readOnly />
      </Form>
    </div>,
  );

  cy.get("input").should("have.attr", "readonly");
  cy.get(`#${name}`).should("have.value", "");
});

it("auto mark on focus", () => {
  const { simpleOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const randomOption = faker.helpers.arrayElement(simpleOptions);

  cy.mount(
    <div className="p-4">
      <Form
        onSubmit={() => {
          // Do nothing
        }}
        defaultValues={{
          [name]: randomOption,
        }}
      >
        <StaticTypeaheadInput name={name} label={name} options={simpleOptions} markAllOnFocus />
      </Form>
    </div>,
  );

  cy.contains("label", name).click();
  cy.get(`input[id=${name}]`).getSelectedText().should("eq", randomOption);
});

it("try to select a disabled option", () => {
  const { disabledOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const randomOptions = faker.helpers.arrayElements(disabledOptions, 1);
  const [randomOption] = randomOptions;

  cy.mount(
    <div className="p-4">
      <Form
        onSubmit={() => {
          // Nothing to do
        }}
      >
        <StaticTypeaheadInput multiple name={name} label={name} options={randomOptions} />
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  cy.get(`#${name}`).clear().click().type(randomOption.label);
  cy.get('li[role="option"]').should("have.attr", "aria-disabled", "true");
});

it("test empty label", () => {
  const { simpleOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const emptyLabel = faker.random.words(5);

  cy.mount(
    <div className="p-4">
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
          autocompleteProps={{
            noOptionsText: emptyLabel,
          }}
        />
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  cy.get(`#${name}`).clear().click().type(name);
  cy.get("div.MuiAutocomplete-noOptions").should("have.text", emptyLabel);
});

it("placeholder", () => {
  const { simpleOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const placeholder = faker.random.words(5);

  cy.mount(
    <div className="p-4">
      <Form onSubmit={cy.spy().as("onSubmitSpy")}>
        <StaticTypeaheadInput multiple name={name} label={name} options={simpleOptions} placeholder={placeholder} />
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  cy.get(`#${name}`).should("have.attr", "placeholder", placeholder);
  simpleOptions.slice(0, 2).forEach((option) => selectOption(name, option));
  cy.get(`#${name}`).should("not.have.attr", "placeholder");
});

it("test on input change", () => {
  const { simpleOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const text = faker.random.words(5);

  const TestForm = () => {
    const [disabled, setDisabled] = useState<boolean>(false);
    return (
      <div className="p-4">
        <Form
          onSubmit={cy.spy().as("onSubmitSpy")}
          defaultValues={{
            [name]: simpleOptions,
          }}
        >
          <StaticTypeaheadInput
            name={name}
            label={name}
            options={simpleOptions}
            onInputChange={(text: string) => setDisabled(text.length === 0)}
          />
          <input type="submit" className="mt-4" disabled={disabled} />
        </Form>
      </div>
    );
  };

  cy.mount(<TestForm />);
  cy.get(`#${name}`).clear().click().type(text);
  cy.get('input[type="submit"]').should("be.enabled");
  cy.get(`#${name}`).clear();
  cy.get('input[type="submit"]').should("be.disabled");
});

it("test grouping options", () => {
  const COUNT = 10;
  const { groupedOptions } = generateOptions(COUNT);
  const name = faker.random.alpha(10);

  cy.mount(
    <div className="p-4">
      <Form
        onSubmit={() => {
          // Nothing to do
        }}
      >
        <StaticTypeaheadInput name={name} label={name} useGroupBy options={groupedOptions} />
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  cy.get(`#${name}`).type(groupedOptions[0].label);
  cy.get("div.MuiAutocomplete-groupLabel").first().should("be.visible").and("have.text", Sex.Male);
  cy.get(`#${name}`)
    .clear()
    .type(groupedOptions[COUNT / 2].label);
  cy.get("div.MuiAutocomplete-groupLabel").first().should("be.visible").and("have.text", Sex.Female);
  cy.get(`#${name}`).clear().type(groupedOptions[COUNT].label);
  cy.get('li[role="option"]').contains(groupedOptions[COUNT].label).should("exist");
});
