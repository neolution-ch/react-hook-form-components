/* eslint-disable max-lines */
import { AsyncTypeaheadInput, AsyncTypeaheadInputRef, Form } from "react-hook-form-components";
import { faker, Sex } from "@faker-js/faker";
import { fetchMock, generateOptions } from "../../helpers/typeahead";
import { useRef, useState } from "react";

const waitLoadingOptions = () => {
  cy.get(".MuiCircularProgress-indeterminate").should("be.visible");
  cy.get(".MuiCircularProgress-indeterminate").should("not.exist");
};

const selectOption = (name: string, text: string) => {
  cy.get(`#${name}`).clear().click().type(text);
  waitLoadingOptions();
  cy.get('li[role="option"]').contains(text).click();
};

const waitForChip = (text: string) => {
  cy.get(`span.MuiChip-label:contains(${text})`).should("be.visible");
};

it("reset values works", () => {
  const options = generateOptions();
  const name = faker.random.alpha(10);
  const [defaultSelectedOption, changedOption] = faker.helpers.arrayElements(options.objectOptions, 2);

  const TestForm = () => {
    const ref = useRef<AsyncTypeaheadInputRef | null>(null);

    return (
      <Form
        onSubmit={cy.spy().as("onSubmitSpy")}
        defaultValues={{
          [name]: defaultSelectedOption.value,
        }}
      >
        <AsyncTypeaheadInput
          inputRef={ref}
          name={name}
          label={name}
          queryFn={async (query: string) => await fetchMock(options.objectOptions, query, false)}
          defaultSelected={[defaultSelectedOption]}
        />
        <input type="submit" className="mt-4" />
        <button
          type="button"
          className="mt-4 ms-2 reset"
          onClick={() => {
            if (ref.current) {
              ref.current.resetValues();
            }
          }}
        >
          reset
        </button>
      </Form>
    );
  };

  cy.mount(
    <div className="p-4">
      <TestForm />
    </div>,
  );

  cy.get(`#${name}`).should("have.value", defaultSelectedOption.label);
  selectOption(name, changedOption.label);
  cy.get(`#${name}`).should("have.value", changedOption.label);
  cy.get("button.reset").click({ force: true });
  cy.get(`#${name}`).should("have.value", defaultSelectedOption.label);
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: [defaultSelectedOption.value] });
});

it("set values works", () => {
  const options = generateOptions();
  const name = faker.random.alpha(10);
  const [defaultSelectedOption, changedOption] = faker.helpers.arrayElements(options.objectOptions, 2);

  const TestForm = () => {
    const ref = useRef<AsyncTypeaheadInputRef | null>(null);

    return (
      <Form
        onSubmit={cy.spy().as("onSubmitSpy")}
        defaultValues={{
          [name]: defaultSelectedOption.value,
        }}
      >
        <AsyncTypeaheadInput
          inputRef={ref}
          name={name}
          label={name}
          queryFn={async (query: string) => await fetchMock(options.randomSubset, query, false)}
          defaultSelected={[defaultSelectedOption]}
        />
        <input type="submit" className="mt-4" />
        <button
          type="button"
          className="mt-4 ms-2 set"
          onClick={() => {
            if (ref.current) {
              ref.current.updateValues([changedOption]);
            }
          }}
        >
          set new value
        </button>
      </Form>
    );
  };

  cy.mount(
    <div className="p-4">
      <TestForm />
    </div>,
  );

  cy.get(`#${name}`).should("have.value", defaultSelectedOption.label);
  cy.get("button.set").click({ force: true });
  cy.get(`#${name}`).should("have.value", changedOption.label);
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: changedOption.value });
});

it("clear values works", () => {
  const options = generateOptions();
  const name = faker.random.alpha(10);
  const [defaultSelectedOption] = faker.helpers.arrayElements(options.objectOptions, 1);

  const TestForm = () => {
    const ref = useRef<AsyncTypeaheadInputRef | null>(null);

    return (
      <Form
        onSubmit={cy.spy().as("onSubmitSpy")}
        defaultValues={{
          [name]: defaultSelectedOption.value,
        }}
      >
        <AsyncTypeaheadInput
          inputRef={ref}
          name={name}
          label={name}
          queryFn={async (query: string) => await fetchMock(options.randomSubset, query, false)}
          defaultSelected={[defaultSelectedOption]}
        />
        <input type="submit" className="mt-4" />
        <button
          type="button"
          className="mt-4 ms-2 clear"
          onClick={() => {
            if (ref.current) {
              ref.current.clearValues();
            }
          }}
        >
          clear
        </button>
      </Form>
    );
  };

  cy.mount(
    <div className="p-4">
      <TestForm />
    </div>,
  );

  cy.get(`#${name}`).should("have.value", defaultSelectedOption.label);
  cy.get("button.clear").click({ force: true });
  cy.get(`#${name}`).should("have.value", "");
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: undefined });
});

it("works with multiple simple options and default selected", () => {
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
          [name]: defaultSelectedOptions.map((o) => o.label),
        }}
      >
        <AsyncTypeaheadInput
          multiple
          name={name}
          label={name}
          defaultSelected={defaultSelectedOptions}
          queryFn={async (query: string) => await fetchMock(options.objectOptions, query)}
        />
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: defaultSelectedOptions.map((o) => o.label) });

  cy.get(`#${name}`).click().type("{backspace}".repeat(20));

  for (const changedOption of changedOptions) {
    selectOption(name, changedOption.label);
  }

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledWith", { [name]: changedOptions.map((o) => o.label) });
});

it("works with multiple object options and default selected", () => {
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
        <AsyncTypeaheadInput
          multiple
          name={name}
          label={name}
          queryFn={async (query: string) => await fetchMock(options.objectOptions, query, false)}
        />
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: defaultSelectedOptions.map((o) => o.value) });

  cy.get(`#${name}`).click().type("{backspace}".repeat(20));

  for (const changedOption of changedOptions) {
    selectOption(name, changedOption.label);
  }

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledWith", { [name]: changedOptions.map((o) => o.value) });
});

it("works with single object option and default selected", () => {
  const options = generateOptions();
  const name = faker.random.alpha(10);
  const [defaultSelectedOption, changedOption] = faker.helpers.arrayElements(options.objectOptions, 2);

  cy.mount(
    <div className="p-4">
      <Form
        onSubmit={cy.spy().as("onSubmitSpy")}
        defaultValues={{
          [name]: defaultSelectedOption.value,
        }}
      >
        <AsyncTypeaheadInput
          name={name}
          label={name}
          defaultSelected={[defaultSelectedOption]}
          queryFn={async (query: string) => await fetchMock(options.objectOptions, query, false)}
        />
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  cy.get(`#${name}`).should("have.value", defaultSelectedOption.label);
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: defaultSelectedOption.value });
  selectOption(name, changedOption.label);
  cy.get(`#${name}`).click().type("e"); // simulate typo
  cy.get(`#${name}`).blur();
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("have.been.calledWith", { [name]: changedOption.value });
});

it("works with single simple option and default selected", () => {
  const options = generateOptions();
  const name = faker.random.alpha(10);
  const randomOptions = faker.helpers.arrayElements(options.objectOptions, 2);

  const [defaultSelectedOption, changedOption] = randomOptions;

  cy.mount(
    <div className="p-4">
      <Form
        onSubmit={cy.spy().as("onSubmitSpy")}
        defaultValues={{
          [name]: defaultSelectedOption.label,
        }}
      >
        <AsyncTypeaheadInput
          name={name}
          label={name}
          defaultSelected={[defaultSelectedOption.label]}
          queryFn={async (query: string) => await fetchMock(options.objectOptions, query)}
        />
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  cy.get(`#${name}`).should("have.value", defaultSelectedOption.label);
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: defaultSelectedOption.label });
  selectOption(name, changedOption.label);
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("have.been.calledWith", { [name]: changedOption.label });
});

it("select automatically single option when one option is available - single (autoSelect/autoHighlight)", () => {
  const options = generateOptions();
  const name = faker.random.alpha(10);

  cy.mount(
    <div className="p-4">
      <Form onSubmit={cy.spy().as("onSubmitSpy")}>
        <AsyncTypeaheadInput
          name={name}
          label={name}
          queryFn={async (query: string) => await fetchMock(options.objectOptions, query, false)}
        />
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  cy.get(`#${name}`).type(options.objectOptions[0].label);
  waitLoadingOptions();
  cy.get(`#${name}`).blur();
  cy.get("ul.MuiAutocomplete-listbox").should("not.exist");
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: options.objectOptions[0].value });
});

it("select automatically single option when multiple options are available - single (autoSelect)", () => {
  const prefix = faker.random.alpha(3);
  const options = [
    { label: prefix + faker.random.alpha(7), value: faker.datatype.uuid() },
    { label: prefix + faker.random.alpha(7), value: faker.datatype.uuid() },
  ];
  const name = faker.random.alpha(10);

  cy.mount(
    <div className="p-4">
      <Form onSubmit={cy.spy().as("onSubmitSpy")}>
        <AsyncTypeaheadInput
          name={name}
          label={name}
          queryFn={async (query: string) => await fetchMock(options, query, false)}
          autoSelect
        />
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  cy.get(`#${name}`).type(prefix);
  waitLoadingOptions();
  cy.get(`#${name}`).type("{downarrow}");
  cy.get(`#${name}`).blur();
  cy.get("ul.MuiAutocomplete-listbox").should("not.exist");
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: options[1].value });
});

it("select automatically single option - multiple (autoSelect/autoHighlight)", () => {
  const options = generateOptions();
  const name = faker.random.alpha(10);

  cy.mount(
    <div className="p-4">
      <Form onSubmit={cy.spy().as("onSubmitSpy")}>
        <AsyncTypeaheadInput
          name={name}
          label={name}
          queryFn={async (query: string) => await fetchMock(options.objectOptions, query, false)}
          multiple
        />
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  cy.get(`#${name}`).type(options.objectOptions[0].label);
  waitLoadingOptions();
  cy.get(`#${name}`).blur();
  waitForChip(options.objectOptions[0].label);

  cy.get(`#${name}`).type(options.objectOptions[1].label);
  waitLoadingOptions();
  cy.get(`#${name}`).blur();
  waitForChip(options.objectOptions[1].label);

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: [options.objectOptions[0].value, options.objectOptions[1].value] });
});

it("select automatically single option when multiple options are available - multiple (autoSelect/autoHighlight)", () => {
  const prefix = faker.random.alpha(3);
  const options = [
    { label: prefix + faker.random.alpha(7), value: faker.datatype.uuid() },
    { label: prefix + faker.random.alpha(7), value: faker.datatype.uuid() },
    { label: prefix + faker.random.alpha(7), value: faker.datatype.uuid() },
  ];
  const name = faker.random.alpha(10);

  cy.mount(
    <div className="p-4">
      <Form onSubmit={cy.spy().as("onSubmitSpy")}>
        <AsyncTypeaheadInput
          name={name}
          label={name}
          queryFn={async (query: string) => await fetchMock(options, query, false)}
          multiple
          autoSelect
          autoHighlight
        />
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  cy.get(`#${name}`).type(prefix);
  waitLoadingOptions();
  cy.get(`#${name}`).blur();
  waitForChip(options[0].label);

  cy.get(`#${name}`).type(prefix);
  waitLoadingOptions();
  cy.get(`#${name}`).blur();
  waitForChip(options[1].label);

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: [options[0].value, options[1].value] });
});

it("works with the correct value onChange", () => {
  const options = generateOptions();
  const name = faker.random.alpha(10);
  const randomOptions = faker.helpers.arrayElements(options.objectOptions, 1);

  const [changedOption] = randomOptions;

  cy.mount(
    <div className="p-4">
      <Form
        onSubmit={() => {
          // Nothing to do
        }}
      >
        <AsyncTypeaheadInput
          name={name}
          label={name}
          queryFn={async (query: string) => await fetchMock(options.objectOptions, query, false)}
          onChange={cy.spy().as("OnChangeSpy")}
        />
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  selectOption(name, changedOption.label);
  cy.get("@OnChangeSpy").should("have.been.calledWith", changedOption.value);
});

it("it is disabled", () => {
  const name = faker.random.word();
  const options = generateOptions();

  cy.mount(
    <div className="p-4">
      <Form
        onSubmit={() => {
          // Do nothing
        }}
      >
        <AsyncTypeaheadInput
          name={name}
          label={name}
          queryFn={async (query: string) => await fetchMock(options.objectOptions, query)}
          disabled
        />
      </Form>
    </div>,
  );

  cy.get("input").should("be.disabled");
});

it("it is readonly", () => {
  const name = faker.random.word();
  const options = generateOptions();

  cy.mount(
    <div className="p-4">
      <Form
        onSubmit={() => {
          // Do nothing
        }}
      >
        <AsyncTypeaheadInput
          name={name}
          label={name}
          queryFn={async (query: string) => await fetchMock(options.objectOptions, query)}
          readOnly
        />
      </Form>
    </div>,
  );

  cy.get("input").should("have.attr", "readonly");
  cy.get(`#${name}`).should("have.value", "");
});

it("auto mark on focus", () => {
  const options = generateOptions();
  const name = faker.random.alpha(10);
  const [randomOption] = faker.helpers.arrayElements(options.objectOptions, 1);

  cy.mount(
    <div className="p-4">
      <Form
        onSubmit={() => {
          // Do nothing
        }}
        defaultValues={{
          [name]: randomOption.label,
        }}
      >
        <AsyncTypeaheadInput
          defaultSelected={[randomOption.label]}
          name={name}
          label={name}
          queryFn={async (query: string) => await fetchMock(options.objectOptions, query)}
          markAllOnFocus
        />
      </Form>
    </div>,
  );

  cy.contains("label", name).click();
  cy.get(`input[id=${name}]`).getSelectedText().should("eq", randomOption.label);
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
        <AsyncTypeaheadInput
          name={name}
          label={name}
          queryFn={async (query: string) => await fetchMock(disabledOptions, query, false)}
          onChange={cy.spy().as("OnChangeSpy")}
        />
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  cy.get(`#${name}`).clear().click().type(randomOption.label);
  waitLoadingOptions();
  cy.get('li[role="option"]').should("have.attr", "aria-disabled", "true");
});

it("test empty label and loading label", () => {
  const { simpleOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const emptyLabel = faker.random.words(5);
  const loadingLabel = faker.random.words(5);

  cy.mount(
    <div className="p-4">
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
          queryFn={async (query: string) =>
            await fetchMock(
              simpleOptions.map((x) => ({ label: x, value: x })),
              query,
              false,
            )
          }
          defaultSelected={simpleOptions}
          autocompleteProps={{
            noOptionsText: emptyLabel,
            loadingText: loadingLabel,
          }}
        />
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  cy.get(`#${name}`).clear().click().type(name);
  cy.get("div.MuiAutocomplete-loading").should("have.text", loadingLabel);
  cy.get("div.MuiAutocomplete-noOptions").should("have.text", emptyLabel);
});

it("placeholder", () => {
  const { simpleOptions } = generateOptions();
  const name = faker.random.alpha(10);
  const placeholder = faker.random.words(5);

  cy.mount(
    <div className="p-4">
      <Form
        onSubmit={() => {
          // Nothing to do
        }}
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
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );
  cy.get(`#${name}`).should("have.attr", "placeholder", placeholder);
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
          <AsyncTypeaheadInput
            name={name}
            label={name}
            onInputChange={(text: string) => setDisabled(text.length === 0)}
            queryFn={async (query: string) =>
              await fetchMock(
                simpleOptions.map((x) => ({ label: x, value: x })),
                query,
                false,
              )
            }
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
        <AsyncTypeaheadInput
          name={name}
          label={name}
          useGroupBy
          queryFn={async (query: string) => await fetchMock(groupedOptions, query, false)}
        />
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
  selectOption(name, groupedOptions[COUNT].label);
});

it("test pagination 2 by 2", () => {
  const name = faker.random.alpha(10);
  const prefix = faker.random.alpha(3);
  const options = [
    { label: prefix + faker.random.alpha(7), value: faker.datatype.uuid() },
    { label: prefix + faker.random.alpha(7), value: faker.datatype.uuid() },
    { label: prefix + faker.random.alpha(7), value: faker.datatype.uuid() },
    { label: prefix + faker.random.alpha(7), value: faker.datatype.uuid() },
  ];

  cy.mount(
    <div className="p-4">
      <Form
        onSubmit={() => {
          // Nothing to do
        }}
      >
        <AsyncTypeaheadInput
          name={name}
          label={name}
          queryFn={async (query: string) => await fetchMock(options, query, false)}
          onChange={cy.spy().as("OnChangeSpy")}
          limitResults={2}
        />
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  cy.get(`#${name}`).clear().click().type(prefix);
  waitLoadingOptions();
  cy.get("ul.MuiAutocomplete-listbox").find("li").should("have.length", 2);
  cy.get('button[title="Load 2 more"]').click();
  cy.get("ul.MuiAutocomplete-listbox").find("li").should("have.length", 4);
});

it("cannot select already selected option when multiple", () => {
  const options = generateOptions();
  const name = faker.random.alpha(10);
  const [defaultSelectedOption] = faker.helpers.arrayElements(options.objectOptions, 1);

  cy.mount(
    <div className="p-4">
      <Form
        onSubmit={cy.spy().as("onSubmitSpy")}
        defaultValues={{
          [name]: defaultSelectedOption.value,
        }}
      >
        <AsyncTypeaheadInput
          multiple
          name={name}
          label={name}
          defaultSelected={[defaultSelectedOption]}
          queryFn={async (query: string) => await fetchMock(options.objectOptions, query, false)}
        />
        <input type="submit" className="mt-4" />
      </Form>
    </div>,
  );

  cy.get(`#${name}`).clear().click().type(defaultSelectedOption.label);
  waitLoadingOptions();
  cy.get('div[role="presentation"]').should("have.class", "MuiAutocomplete-noOptions");
});
