const jsonIsoDateReviver = (_key: string, value: unknown) => {
  if (
    typeof value == "string" &&
    /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z?))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z?))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z?))/.exec(
      value,
    )
  ) {
    return new Date(`${value}`);
  }

  return value;
};

const setUtcTime = (date: Date | null | undefined) => {
  if (date && date instanceof Date) {
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
  }
};

const setUtcTimeToZero = (date: Date | null | undefined) => {
  if (date && date instanceof Date) {
    date.setHours(0, 0, 0, 0);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  }
};

export { jsonIsoDateReviver, setUtcTime, setUtcTimeToZero };
