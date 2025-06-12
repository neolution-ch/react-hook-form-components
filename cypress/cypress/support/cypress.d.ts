export declare global {
  namespace Cypress {
    interface Chainable {
      setSliderValue(value: number): Chainable<void>;
      getSelectedText(): Chainable<void>;
      mount(mounting: object): typeof mount;
    }
  }
}
