import { AsyncTypeaheadInput, Form } from "react-hook-form-components";
import { faker, Sex } from "@faker-js/faker";
import { fetchMock, generateOptions } from "../../helpers/typeahead";
import { useRef, useState } from "react";
import TypeheadRef from "react-bootstrap-typeahead/types/core/Typeahead";

it("works with multiple simple options and default selected", () => {
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
        [name]: defaultSelectedOptions.map((o) => o.label),
      }}
    >
      <AsyncTypeaheadInput
        multiple
        defaultSelected={defaultSelectedOptions}
        name={name}
        label={name}
        queryFn={async (query) => await fetchMock(options.objectOptions, query)}
      />
      <input type="submit" />
    </Form>,
  );

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: defaultSelectedOptions.map((o) => o.label) });

  cy.get(`#${name}`).click().type("{backspace}".repeat(20));

  for (const changedOption of changedOptions) {
    cy.get(`#${name}`).click().type(changedOption.label);
    cy.get(`a[aria-label='${changedOption.label}']`).click();
  }

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledWith", { [name]: changedOptions.map((o) => o.label) });
});

it("works with multiple object options and default selected", () => {
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
      <AsyncTypeaheadInput
        multiple
        defaultSelected={defaultSelectedOptions}
        name={name}
        label={name}
        queryFn={async (query) => await fetchMock(options.objectOptions, query, false)}
      />
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

it("works with single object option and default selected", () => {
  const options = generateOptions(100);
  const name = faker.random.alpha(10);
  const [defaultSelectedOption, changedOption] = faker.helpers.arrayElements(options.objectOptions, 2);

  cy.mount(
    <Form
      onSubmit={cy.spy().as("onSubmitSpy")}
      defaultValues={{
        [name]: defaultSelectedOption.value,
      }}
    >
      <AsyncTypeaheadInput
        name={name}
        label={name}
        queryFn={async (query) => await fetchMock(options.objectOptions, query, false)}
        defaultSelected={[defaultSelectedOption]}
      />
      <input type="submit" />
    </Form>,
  );

  cy.get(`#${name}`).should("have.value", defaultSelectedOption.label);
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: defaultSelectedOption.value });

  cy.get(`#${name}`).clear().click().type(changedOption.label);
  cy.get(`a[aria-label='${changedOption.label}']`).click();
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("have.been.calledWith", { [name]: changedOption.value });
});

it("works with single simple option and default selected", () => {
  const options = generateOptions(100);
  const name = faker.random.alpha(10);
  const randomOptions = faker.helpers.arrayElements(options.objectOptions, 2);

  const [defaultSelectedOption, changedOption] = randomOptions;

  cy.mount(
    <Form
      onSubmit={cy.spy().as("onSubmitSpy")}
      defaultValues={{
        [name]: defaultSelectedOption.label,
      }}
    >
      <AsyncTypeaheadInput
        name={name}
        label={name}
        queryFn={async (query) => await fetchMock(options.objectOptions, query)}
        defaultSelected={[defaultSelectedOption.label]}
      />
      <input type="submit" />
    </Form>,
  );

  cy.get(`#${name}`).should("have.value", defaultSelectedOption.label);
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: defaultSelectedOption.label });

  cy.get(`#${name}`).clear().click().type(changedOption.label);
  cy.get(`a[aria-label='${changedOption.label}']`).click();
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("have.been.calledWith", { [name]: changedOption.label });
});

it("select automatically single option - single", () => {
  const options = generateOptions(10);
  const name = faker.random.alpha(10);

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")}>
      <AsyncTypeaheadInput name={name} label={name} queryFn={async (query) => await fetchMock(options.objectOptions, query, false)} />
      <input type="submit" />
    </Form>,
  );

  cy.get(`#${name}`).type(options.objectOptions[0].label, { delay: 100 });
  cy.wait(1000);
  cy.get(`#${name}`).blur();
  cy.wait(100);
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: options.objectOptions[0].value });
});

it("show error if multiple options are available - single", () => {
  const options = generateOptions(10);
  const name = faker.random.alpha(10);
  const [firstOption] = options.objectOptions;
  const errorMessage = faker.random.words(3);

  const additionalOption = { label: firstOption.label.concat("xyz"), value: faker.datatype.uuid() };

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")}>
      <AsyncTypeaheadInput
        name={name}
        label={name}
        queryFn={async (query) => await fetchMock(options.objectOptions.concat(additionalOption), query, false)}
        invalidErrorMessage={errorMessage}
      />
      <input type="submit" />
    </Form>,
  );

  cy.get(`#${name}`).type(options.objectOptions[0].label, { delay: 100 });
  cy.wait(1000);
  cy.get(`#${name}`).blur();
  cy.wait(100);
  cy.get("div[class=invalid-feedback]").should("be.visible").should("have.text", errorMessage);
  cy.get("input[type=submit]")
    .click({ force: true })
    .then(() => {
      cy.get("@onSubmitSpy").should("not.have.been.called");
    });
  cy.get("div[class=invalid-feedback]").should("be.visible").should("have.text", errorMessage);
});

it("select automatically single option - multiple", () => {
  const options = generateOptions(10);
  const name = faker.random.alpha(10);

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")}>
      <AsyncTypeaheadInput
        name={name}
        label={name}
        queryFn={async (query) => await fetchMock(options.objectOptions, query, false)}
        multiple
      />
      <input type="submit" />
    </Form>,
  );

  cy.get(`#${name}`).type(options.objectOptions[0].label, { delay: 100 });
  cy.wait(1000);
  cy.get(`#${name}`).blur();
  cy.wait(100);
  cy.get(`#${name}`).type(options.objectOptions[1].label, { delay: 100 });
  cy.wait(1000);
  cy.get(`#${name}`).blur();
  cy.wait(100);
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: [options.objectOptions[0].value, options.objectOptions[1].value] });
});

it("show error if multiple options are available - multiple", () => {
  const options = generateOptions(10);
  const name = faker.random.alpha(10);
  const [firstOption] = options.objectOptions;
  const errorMessage = faker.random.words(3);

  const additionalOption = { label: firstOption.label.concat("xyz"), value: faker.datatype.uuid() };

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")}>
      <AsyncTypeaheadInput
        name={name}
        label={name}
        queryFn={async (query) => await fetchMock(options.objectOptions.concat(additionalOption), query, false)}
        invalidErrorMessage={errorMessage}
        multiple
      />
      <input type="submit" />
    </Form>,
  );

  cy.get(`#${name}`).type(options.objectOptions[0].label);
  cy.wait(1000);
  cy.get(`#${name}`).blur();
  cy.wait(100);
  cy.get("div[class=invalid-feedback]").should("be.visible").should("have.text", errorMessage);
  cy.get("input[type=submit]")
    .click({ force: true })
    .then(() => {
      cy.get("@onSubmitSpy").should("not.have.been.called");
    });
  cy.get("div[class=invalid-feedback]").should("be.visible").should("have.text", errorMessage);
});

it("works with the correct value onChange", () => {
  const options = generateOptions(100);
  const name = faker.random.alpha(10);
  const randomOptions = faker.helpers.arrayElements(options.objectOptions, 1);

  const [changedOption] = randomOptions;

  cy.mount(
    <Form
      onSubmit={() => {
        // Nothing to do
      }}
    >
      <AsyncTypeaheadInput
        name={name}
        label={name}
        queryFn={async (query) => await fetchMock(options.objectOptions, query, false)}
        onChange={cy.spy().as("OnChangeSpy")}
      />
      <input type="submit" />
    </Form>,
  );

  cy.get(`#${name}`).clear().click().type(changedOption.label);
  cy.get(`a[aria-label='${changedOption.label}']`).click();
  cy.get("@OnChangeSpy").should("have.been.calledWith", changedOption.value);
});

it("is disabled", () => {
  const name = faker.random.word();
  const options = generateOptions(100);

  cy.mount(
    <Form
      onSubmit={() => {
        // Do nothing
      }}
    >
      <AsyncTypeaheadInput name={name} label={name} queryFn={async (query) => await fetchMock(options.objectOptions, query)} disabled />
    </Form>,
  );

  cy.get("input.rbt-input-main").should("be.disabled");
});

it("auto mark on focus", () => {
  const options = generateOptions(100);
  const name = faker.random.alpha(10);
  const [randomOption] = faker.helpers.arrayElements(options.objectOptions, 1);

  cy.mount(
    <Form
      onSubmit={() => {
        // Do nothing
      }}
    >
      <AsyncTypeaheadInput
        defaultSelected={[randomOption.label]}
        name={name}
        label={name}
        queryFn={async (query) => await fetchMock(options.objectOptions, query)}
        markAllOnFocus
      />
    </Form>,
  );

  cy.contains("label", name).click();
  cy.get(`input[id=${name}]`).getSelectedText().should("eq", randomOption.label);
});

it("disabled options", () => {
  const { disabledOptions } = generateOptions(100);
  const name = faker.random.alpha(10);
  const randomOptions = faker.helpers.arrayElements(disabledOptions, 1);

  const [changedOption] = randomOptions;

  cy.mount(
    <Form
      onSubmit={() => {
        // Nothing to do
      }}
    >
      <AsyncTypeaheadInput
        name={name}
        label={name}
        queryFn={async (query) => await fetchMock(disabledOptions, query, false)}
        onChange={cy.spy().as("OnChangeSpy")}
      />
      <input type="submit" />
    </Form>,
  );

  cy.get(`#${name}`).clear().click().type(changedOption.label);
  cy.get(`a[aria-label='${changedOption.label}']`).should("have.class", "disabled");
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
      <AsyncTypeaheadInput
        multiple
        name={name}
        label={name}
        queryFn={async (query) =>
          await fetchMock(
            simpleOptions.map((x) => ({ label: x, value: x })),
            query,
            false,
          )
        }
        defaultSelected={simpleOptions}
        emptyLabel={emptyLabel}
      />
      <input type="submit" />
    </Form>,
  );

  cy.get(`#${name}`).clear().click().type(name);
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
      <AsyncTypeaheadInput
        multiple
        name={name}
        label={name}
        queryFn={async (query) =>
          await fetchMock(
            simpleOptions.map((x) => ({ label: x, value: x })),
            query,
            false,
          )
        }
        placeholder={placeholder}
      />
      <input type="submit" />
    </Form>,
  );
  cy.get(`#${name}`).should("have.attr", "placeholder", placeholder);
});

it("use input-ref and handle on input change", () => {
  const { simpleOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const text = faker.random.words(5);

  const TestForm = () => {
    const ref = useRef<TypeheadRef | null>(null);
    const [disabled, setDisabled] = useState<boolean>(false);
    return (
      <Form
        onSubmit={cy.spy().as("onSubmitSpy")}
        defaultValues={{
          [name]: simpleOptions,
        }}
      >
        <AsyncTypeaheadInput
          inputRef={ref}
          name={name}
          label={name}
          onInputChange={(text) => setDisabled(text.length === 0)}
          onChange={() => ref.current?.toggleMenu()}
          queryFn={async (query) =>
            await fetchMock(
              simpleOptions.map((x) => ({ label: x, value: x })),
              query,
              false,
            )
          }
        />
        <input type="submit" disabled={disabled} />
      </Form>
    );
  };

  cy.mount(<TestForm />);
  cy.get(`#${name}`).clear().click().type(text);
  cy.get('input[type="submit"]').should("be.enabled");
  cy.get(`#${name}`).clear();
  cy.get('input[type="submit"]').should("be.disabled");
  cy.get(`#${name}`).click().type(simpleOptions[0]);
  cy.get(`a[aria-label='${simpleOptions[0]}']`).click();
  cy.get(".rbt-menu.dropdown-menu.show").should("be.visible");
});

it("grouping options", () => {
  const { groupedOptions } = generateOptions();
  const name = faker.random.alpha(10);

  cy.mount(
    <Form
      onSubmit={() => {
        // Nothing to do
      }}
    >
      <AsyncTypeaheadInput name={name} label={name} useGroupBy queryFn={async (query) => await fetchMock(groupedOptions, query, false)} />
      <input type="submit" />
    </Form>,
  );

  cy.get(`#${name}`).type(groupedOptions[0].label);
  cy.get(".dropdown-header").first().should("be.visible").and("have.text", Sex.Male);
  cy.contains("a", groupedOptions[0].label).should("have.class", "disabled");
  cy.get(`#${name}`).clear().type(groupedOptions[5].label);
  cy.get(".dropdown-header").first().should("be.visible").and("have.text", Sex.Female);
});
