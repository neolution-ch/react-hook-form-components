import { AsyncTypeaheadInput, Form } from "react-hook-form-components";
import { faker } from "@faker-js/faker";
import { fetchMock, generateOptions } from "../../helpers/typeahead";

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
  const randomOption = faker.helpers.arrayElements(options.objectOptions, 1)[0];

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
            simpleOptions.map((x) => {
              return { label: x, value: x };
            }),
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
            simpleOptions.map((x) => {
              return { label: x, value: x };
            }),
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
