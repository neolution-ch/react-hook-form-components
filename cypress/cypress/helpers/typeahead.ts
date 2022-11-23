import { faker } from "@faker-js/faker";
import { LabelValueOption } from "react-hook-form-components";

interface GenerateOptionsResult {
  objectOptions: LabelValueOption[];
  simpleOptions: string[];
  randomSubset: LabelValueOption[];
}

const generateOptions = (count = 10): GenerateOptionsResult => {
  const objectOptions = faker.helpers.uniqueArray<LabelValueOption>(
    () => ({
      value: faker.datatype.uuid(),
      label: faker.helpers.unique(faker.name.firstName),
    }),
    count,
  );
  const simpleOptions = objectOptions.map((o) => o.label);

  const randomSubset = faker.helpers
    .arrayElements(objectOptions, 2)
    .sort((a, b) => objectOptions.findIndex((x) => x.value == a.value) - objectOptions.findIndex((x) => x.value == b.value));
  return { objectOptions, simpleOptions, randomSubset };
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchMock = async (options: LabelValueOption[], query: string, simpleOptions = true) => {
  const result = options.filter((x) => x.label.toLowerCase().includes(query.toLowerCase()));

  await delay(faker.datatype.number({ min: 10, max: 1000 }));

  if (simpleOptions) {
    return result.map((x) => x.label);
  }
  return result;
};

export { generateOptions, fetchMock };
