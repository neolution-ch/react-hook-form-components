/* eslint-disable max-lines */
import { DatePickerInput, Form, getUtcTimeZeroDate, AddonPosition } from "react-hook-form-components";
import "react-datepicker/dist/react-datepicker.css";
import { faker } from "@faker-js/faker";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { faCalendar, faClock } from "@fortawesome/free-solid-svg-icons";
import { Button } from "reactstrap";
import { SinonSpy } from "cypress/types/sinon";
import { useRef } from "react";
import ReactDatePicker from "react-datepicker";

it("selecting today works", () => {
  const name = faker.random.alpha(10);

  const schema = yup.object().shape({
    [name]: yup.date().required(),
  });

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
      <DatePickerInput name={name} label={name} />

      <input type={"submit"} />
    </Form>,
  );

  cy.contains("label", name).click();
  cy.get(".react-datepicker__day--today").click();
  cy.get("input[type=submit]").click({ force: true });

  const todayMidnight = getUtcTimeZeroDate(new Date());

  cy.get("@onSubmitSpy")
    .its("lastCall.args.0")
    .should("deep.equal", { [name]: todayMidnight });
});

it("setting intial value as iso string works", () => {
  const name = faker.random.alpha(10);
  const randomDate = getUtcTimeZeroDate(faker.date.future());

  const schema = yup.object().shape({
    [name]: yup.date().required(),
  });

  const x = (values: unknown) => {
    console.log(values);
    console.log(JSON.stringify(values));
  };

  cy.mount(
    <Form
      onSubmit={cy.spy(x).as("onSubmitSpy")}
      resolver={yupResolver(schema)}
      defaultValues={{
        [name]: randomDate.toISOString(),
      }}
    >
      <DatePickerInput name={name} label={name} />

      <input type={"submit"} />
    </Form>,
  );

  cy.get("input[type=submit]").click({ force: true });

  cy.get("@onSubmitSpy")
    .its("lastCall.args.0")
    .should("deep.equal", { [name]: randomDate });
});

it("setting intial value as date object works", () => {
  const name = faker.random.alpha(10);
  const randomDate = getUtcTimeZeroDate(faker.date.future());

  const schema = yup.object().shape({
    [name]: yup.date().required(),
  });

  cy.mount(
    <Form
      onSubmit={cy.spy().as("onSubmitSpy")}
      resolver={yupResolver(schema)}
      defaultValues={{
        [name]: randomDate,
      }}
    >
      <DatePickerInput name={name} label={name} />

      <input type={"submit"} />
    </Form>,
  );

  cy.get("input[type=submit]").click({ force: true });

  cy.get("@onSubmitSpy")
    .its("lastCall.args.0")
    .should("deep.equal", { [name]: randomDate });
});

it("is disabled", () => {
  const name = faker.random.word();

  cy.mount(
    <Form
      onSubmit={() => {
        // Do nothing
      }}
    >
      <DatePickerInput label={name} name={name} disabled />
    </Form>,
  );

  cy.get(`input[name=${name}]`).should("be.disabled");
});

it("contains calendar icon if provided in DateInput", () => {
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
      <DatePickerInput name={name} label={name} icon={faClock} addonPosition={AddonPosition.Rigth} />
    </Form>,
  );

  cy.get(`label[for=${name}]`).parent().find("svg[data-icon=clock]").should("be.visible");
});

it("not contains calendar icon if not provided in DateInput", () => {
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
      <DatePickerInput name={name} label={name} />
    </Form>,
  );

  cy.get(`label[for=${name}]`).parent().find("svg").should("not.exist");
});

it("passing an IANA timezone works", () => {
  const name = "input1";

  interface FormFields {
    [name]: Date;
  }

  const schema = yup.object().shape({
    [name]: yup.date(),
  });

  const timezone = "America/New_York";
  const isoInputDate = "2021-02-03T08:00:00.000Z";
  const fixedDate = new Date(isoInputDate);
  const inputJsonString = JSON.stringify(fixedDate);

  cy.mount(
    <Form<FormFields>
      defaultValues={{
        [name]: fixedDate,
      }}
      onSubmit={cy.spy().as("onSubmitSpy")}
      resolver={yupResolver(schema)}
    >
      <DatePickerInput
        name={name}
        label={name}
        ianaTimeZone={timezone}
        datePickerProps={{
          showTimeSelect: true,
        }}
      />

      <Button type={"submit"}>Submit</Button>
    </Form>,
  );

  cy.get(`input[name=${name}]`).should("have.value", "03.02.2021 03:00");

  cy.get("button[type=submit]").click({ force: true });

  cy.get<SinonSpy>("@onSubmitSpy").should((x) => {
    expect(x).to.have.callCount(1);
    const [args] = x.getCall(0).args as [FormFields];
    expect(JSON.stringify(args[name])).to.equal(inputJsonString);
  });
});

it("passing the the icon correctly render the icon on rigth and open/close calendar", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.date(),
  });

  cy.mount(
    <>
      <Form
        onSubmit={() => {
          // Nothing to do
        }}
        resolver={yupResolver(schema)}
      >
        <DatePickerInput name={name} label={name} icon={faCalendar} />
      </Form>
    </>,
  );

  cy.get(`label[for=${name}]`).parent().find("svg[data-icon=calendar]").click();
  cy.get(".react-datepicker-popper").should("be.visible");
  cy.get(`label[for=${name}]`).parent().find("svg[data-icon=calendar]").click();
  cy.get(".react-datepicker-popper").should("not.exist");
});

it("passing the the icon correctly render the icon on the left and open/close calendar", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.date(),
  });

  cy.mount(
    <>
      <Form
        onSubmit={() => {
          // Nothing to do
        }}
        resolver={yupResolver(schema)}
      >
        <DatePickerInput name={name} label={name} icon={faCalendar} addonPosition={AddonPosition.Left} />
      </Form>
    </>,
  );

  cy.get(`label[for=${name}]`).parent().find("svg[data-icon=calendar]").click();
  cy.get(".react-datepicker-popper").should("be.visible");
  cy.get(`label[for=${name}]`).parent().find("svg[data-icon=calendar]").click();
  cy.get(".react-datepicker-popper").should("not.exist");
});

it("Clicking the icon with disabled input should not open the calendar", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.date(),
  });

  cy.mount(
    <>
      <Form
        onSubmit={() => {
          // Nothing to do
        }}
        resolver={yupResolver(schema)}
      >
        <DatePickerInput name={name} label={name} icon={faCalendar} disabled />
      </Form>
    </>,
  );

  cy.get(`label[for=${name}]`).parent().find("svg[data-icon=calendar]").click();
  cy.get(".react-datepicker-popper").should("not.exist");
});

it("Passing ref works", () => {
  const name = faker.random.alpha(10);
  const id = faker.random.alpha(10);

  const schema = yup.object().shape({
    [name]: yup.date(),
  });

  const CustomComponent = () => {
    const datePickerRef = useRef<ReactDatePicker>(null);
    return (
      <Form
        onSubmit={() => {
          // Nothing to do
        }}
        resolver={yupResolver(schema)}
      >
        <DatePickerInput datePickerRef={datePickerRef} name={name} label={name} icon={faCalendar} />
        <button id={id} type="button" onClick={() => datePickerRef.current?.setOpen(true)}>
          Click me
        </button>
      </Form>
    );
  };

  cy.mount(<CustomComponent />);

  cy.get(`button[id=${id}]`).click();
  cy.get(".react-datepicker-popper").should("be.visible");
});
