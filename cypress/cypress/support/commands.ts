/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      setSliderValue(value: number): Chainable<void>;
      getSelectedText(): Chainable<void>;

      // containsExactly(text: string): Chainable<JQuery>;
    }
  }
}

Cypress.Commands.add("setSliderValue", { prevSubject: "element" }, (subject, value) => {
  // eslint-disable-next-line prefer-destructuring
  const element = subject[0];

  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;

  nativeInputValueSetter?.call(element, value);
  element.dispatchEvent(new Event("input", { bubbles: true }));
});

Cypress.Commands.add("getSelectedText", { prevSubject: "element" }, (subject) => {
  const inputField = subject[0] as HTMLInputElement;
  cy.wrap(
    inputField.selectionStart !== undefined && inputField.selectionEnd !== null
      ? inputField.value.slice(inputField.selectionStart ?? 0, inputField.selectionEnd ?? 0)
      : "",
  );
});

// Cypress.Commands.add(
//   "containsExactly",
//   {
//     prevSubject: "optional",
//   },
//   (subject, arg1, arg2) => {
//     // subject may be defined or undefined
//     // so you likely want to branch the logic
//     // based off of that

//     if (subject) {
//       // wrap the existing subject
//       // and do something with it
//       cy.wrap(subject);
//     } else {
//       console.log("HI");
//     }
//   },
// );

export {};
