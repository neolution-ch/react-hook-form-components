/* eslint-disable max-lines */
import { DatePickerInput, Form, Input, AsyncTypeaheadInput, StaticTypeaheadInput } from "react-hook-form-components";
import "react-datepicker/dist/react-datepicker.css";
import { faker } from "@faker-js/faker";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { faCalendar, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputGroupText } from "reactstrap";
import { fetchMock, generateOptions } from "../../helpers/typeahead";

it("contains pencil icon and inputGroup has correct style", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.date(),
  });
  const inputGroupStyle = "background-color: black;";
  const defaultStyle = "flex-wrap: nowrap; align-items: center; ";
  const style = defaultStyle.concat(inputGroupStyle);

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
        inputGroupStyle={{ backgroundColor: "black" }}
        addonRight={
          <InputGroupText>
            <FontAwesomeIcon icon={faPencil} />
          </InputGroupText>
        }
      />
    </Form>,
  );

  cy.get(`label[for=${name}]`).parent().find("svg[data-icon=pencil]");
  cy.get(".input-group").should("have.attr", "style", style);
});

it("contains calendar icon and inputGroup has correct style", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.date(),
  });
  const inputGroupStyle = "background-color: black;";
  const defaultStyle = "flex-wrap: nowrap; align-items: normal; ";
  const style = defaultStyle.concat(inputGroupStyle);

  cy.mount(
    <Form
      onSubmit={() => {
        // Nothing to do
      }}
      resolver={yupResolver(schema)}
    >
      <DatePickerInput
        inputGroupStyle={{ backgroundColor: "black" }}
        name={name}
        label={name}
        addonLeft={
          <InputGroupText>
            <FontAwesomeIcon icon={faCalendar} />
          </InputGroupText>
        }
        addonRight={
          <InputGroupText>
            <FontAwesomeIcon icon={faCalendar} />
          </InputGroupText>
        }
      />
    </Form>,
  );

  cy.get(`label[for=${name}]`).parent().find("svg[data-icon=calendar]");
  cy.get(".input-group").should("have.attr", "style", style);
});

it("async typeahead input contains pencil icon and inputGroup has correct style", () => {
  const name = faker.random.word();
  const options = generateOptions(100);

  const customStyle = "background-color: black;";
  const defaultStyle = "flex-wrap: nowrap; align-items: center; ";
  const style = defaultStyle.concat(customStyle);

  cy.mount(
    <Form
      onSubmit={() => {
        // Do nothing
      }}
    >
      <AsyncTypeaheadInput
        name={name}
        label={name}
        queryFn={async (query) => await fetchMock(options.objectOptions, query)}
        className="mt-0 text-white"
        addonRight={
          <InputGroupText>
            <FontAwesomeIcon icon={faPencil} />
          </InputGroupText>
        }
        inputGroupStyle={{ backgroundColor: "black" }}
      />
    </Form>,
  );

  cy.get(`label[for=${name}]`).parent().find("svg[data-icon=pencil]");
  cy.get(".input-group").should("have.attr", "style", style);
});

it("static typeahead input contains pencil icon and inputGroup has correct style", () => {
  const name = faker.random.word();
  const { simpleOptions } = generateOptions(100);

  const customStyle = "background-color: black;";
  const defaultStyle = "flex-wrap: nowrap; align-items: center; ";
  const style = defaultStyle.concat(customStyle);

  cy.mount(
    <Form
      onSubmit={() => {
        // Do nothing
      }}
    >
      <StaticTypeaheadInput
        name={name}
        label={name}
        options={simpleOptions}
        className="mt-0 text-white"
        addonRight={
          <InputGroupText>
            <FontAwesomeIcon icon={faPencil} />
          </InputGroupText>
        }
        inputGroupStyle={{ backgroundColor: "black" }}
      />
    </Form>,
  );

  cy.get(`label[for=${name}]`).parent().find("svg[data-icon=pencil]");
  cy.get(".input-group").should("have.attr", "style", style);
});
