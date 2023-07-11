import { Form, Input, DatePickerInput, AsyncTypeaheadInput } from "react-hook-form-components";
import {faker} from "@faker-js/faker";
import { fetchMock, generateOptions } from "../../helpers/typeahead";

it("input has correct classname", () => {
    const name = faker.random.alpha(10);
    const value = faker.random.alpha(10);

    cy.mount(
        <Form
            onSubmit={() => {
                // Do nothing
            }}
        >
            <Input type="text" name={name} label={name} value={value} className="mt-0" />
        </Form>,
    );
    cy.get(`[name=${name}]`).should("have.class", "mt-0");
});

it("datepicker input has correct classname", () => {
    const name = faker.random.word();

    cy.mount(
        <Form
            onSubmit={() => {
                // Do nothing
            }}
        >
            <DatePickerInput label={name} name={name} className="mt-0" />
        </Form>,
    );

    cy.get(`input[name=${name}]`).should("have.class", "mt-0");
});
