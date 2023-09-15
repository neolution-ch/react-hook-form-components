import { faker } from "@faker-js/faker";
import { yupResolver } from "@hookform/resolvers/yup";
import { LabelValueOption, Form, Input } from "react-hook-form-components";
import * as yup from "yup";

it("select works", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.string(),
  });

  const options = faker.helpers.uniqueArray<LabelValueOption>(() => ({ value: faker.random.alpha(10), label: faker.random.alpha(10) }), 3);
  const randomOption = faker.helpers.arrayElement(options);

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
      <Input type="select" name={name} label={name} options={options} />

      <input type={"submit"} />
    </Form>,
  );

  cy.get(`select[id=${name}]`).select(randomOption.label);
  cy.get("input[type=submit]").click({ force: true });

  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomOption.value });
});

it("select multiple works", () => {
  const name = faker.random.alpha(10);

  const options = faker.helpers
    .uniqueArray<LabelValueOption>(() => ({ value: faker.random.alpha(10), label: faker.random.alpha(10) }), 10)
    .sort((a, b) => a.label.localeCompare(b.label));
  const randomOptions = faker.helpers.arrayElements(options).sort((a, b) => a.label.localeCompare(b.label));

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")}>
      <Input type="select" multiple name={name} label={name} options={options} />

      <input type={"submit"} />
    </Form>,
  );
  cy.get(".mb-3").should("have.length", 1);
  cy.get(`select[id=${name}]`).select(randomOptions.map((option) => option.label));

  cy.get("input[type=submit]").click({ force: true });

  cy.get("@onSubmitSpy").should("be.calledWithMatch", { [name]: randomOptions.map((option) => option.value) });
});

it("input is disabled", () => {
  const name = faker.random.word();
  const options = [...Array<unknown>(5)].map<LabelValueOption>(() => {
    const randomVal = faker.science.chemicalElement().name;
    return { label: randomVal, value: randomVal };
  });

  cy.mount(
    <Form
      onSubmit={() => {
        // Do nothing
      }}
    >
      <Input type="select" name={name} label={name} options={options} disabled />
    </Form>,
  );

  cy.get(`select[name=${name}]`).should("be.disabled");
});

it("option is disabled", () => {
  const name = faker.random.word();
  const options = [...Array<unknown>(5)].map<LabelValueOption>(() => {
    const randomVal = faker.science.chemicalElement().name;
    return { label: randomVal, value: randomVal };
  });
  options.push({ label: "DisabledOption", value: "DisabledOption", disabled: true });

  cy.mount(
    <Form
      onSubmit={() => {
        // Do nothing
      }}
    >
      <Input type="select" name={name} label={name} options={options} />
    </Form>,
  );

  cy.get(`select[name=${name}]`).get('[value="DisabledOption"]').should("be.disabled");
});

it.only("undefined option value is working", () => {
  const name = faker.random.word();
  const schema = yup.object().shape({
    [name]: yup.string(),
  });
  const options = faker.helpers.uniqueArray<LabelValueOption>(() => ({ value: faker.random.alpha(10), label: faker.random.alpha(10) }), 3);

  options[0].value = undefined;

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
      <Input type="select" name={name} label={name} options={options} />
      <input type={"submit"} />
    </Form>,
  );

  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: undefined });

  cy.get("@onSubmitSpy").invoke("resetHistory");
  cy.get(`select[id=${name}]`).select(options[1].label);
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: options[1].value });

  cy.get("@onSubmitSpy").invoke("resetHistory");
  cy.get(`select[id=${name}]`).select(options[0].label);
  cy.get("input[type=submit]").click({ force: true });
  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: undefined });
});
