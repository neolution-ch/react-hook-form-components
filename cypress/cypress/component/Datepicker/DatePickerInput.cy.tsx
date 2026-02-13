import { DatePickerInput, Form, getUtcTimeZeroDate } from "react-hook-form-components";
import "react-hook-form-components/styles.css";
import { faker } from "@faker-js/faker";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { faCalendar, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, InputGroupText } from "reactstrap";
import { mount } from "cypress/react";

import { SinonSpy } from "cypress/types/sinon";
import { useRef, useEffect, FC } from "react";
import ReactDatePickers from "react-datepicker";

it("selecting today works", () => {
  const name = faker.random.alpha(10);

  const schema = yup.object().shape({
    [name]: yup.date().required(),
  });

  mount(
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

  mount(
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

  mount(
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

  mount(
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

  mount(
    <Form
      onSubmit={() => {
        // Nothing to do
      }}
      resolver={yupResolver(schema)}
    >
      <DatePickerInput
        name={name}
        label={name}
        addonRight={
          <InputGroupText>
            <FontAwesomeIcon icon={faCalendar} />
          </InputGroupText>
        }
        addonLeft={
          <InputGroupText>
            <FontAwesomeIcon icon={faClock} />
          </InputGroupText>
        }
      />
    </Form>,
  );

  cy.get(`label[for=${name}]`).parent().find("svg[data-icon=calendar]");
  cy.get(`label[for=${name}]`).parent().find("svg[data-icon=clock]");
});

it("not contains calendar icon if not provided in DateInput", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.date(),
  });

  mount(
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

  mount(
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

it("passing the ref works", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.date(),
  });

  const DatePickerWithRef: FC = () => {
    const ref = useRef<ReactDatePickers>(null);

    useEffect(() => {
      if (ref && ref.current) {
        ref.current.setOpen(true);
      }
    }, [ref]);

    return (
      <>
        <Form
          onSubmit={() => {
            // Nothing to do
          }}
          resolver={yupResolver(schema)}
        >
          <DatePickerInput name={name} label={name} datePickerRef={ref} />
        </Form>
        ,
      </>
    );
  };

  mount(<DatePickerWithRef />);

  cy.get(".react-datepicker-popper").should("be.visible");
});

it("addon works as a function (with onClick)", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.date(),
  });

  mount(
    <Form
      onSubmit={() => {
        // Nothing to do
      }}
      resolver={yupResolver(schema)}
    >
      <DatePickerInput
        name={name}
        label={name}
        addonLeft={({ isDisabled, toggleDatePicker }) => (
          <InputGroupText className="rounded-end">
            <FontAwesomeIcon size="lg" icon={faCalendar} role={isDisabled ? "none" : "button"} onClick={toggleDatePicker} />
          </InputGroupText>
        )}
      />
    </Form>,
  );

  cy.get(".fa-calendar").click();
  cy.get(".react-datepicker-popper").should("be.visible");
});
