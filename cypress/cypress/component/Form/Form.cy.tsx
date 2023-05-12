import { faker } from "@faker-js/faker";
import { FormProvider, useForm } from "react-hook-form";
import { Input } from "react-hook-form-components";

it("using the react-hook-form provider directly works", () => {
  const Component: React.FC = () => {
    const formMethods = useForm();
    console.log(formMethods);
    const { handleSubmit } = formMethods;

    return (
      <FormProvider {...formMethods}>
        <form
          onSubmit={(e) => {
            void (async () => {
              await handleSubmit(cy.spy().as("onSubmitSpy"))(e);
            })();
          }}
        >
          <Input name={name} label={name} />

          <button type={"submit"} />
        </form>
      </FormProvider>
    );
  };

  const name = faker.random.alpha(10);
  const randomWord = faker.random.word();

  cy.mount(<Component />);

  cy.contains("label", name).click().type(randomWord.toString());
  cy.get("input[type=submit]").click({ force: true });

  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomWord });
});
