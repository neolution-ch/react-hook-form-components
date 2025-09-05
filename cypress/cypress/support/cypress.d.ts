import type { mount } from "cypress/react18";
declare global {
  namespace Cypress {
    interface Chainable {
      setSliderValue(value: number): Chainable<void>;
      getSelectedText(): Chainable<void>;
      mount: typeof mount;
    }
  }
}
