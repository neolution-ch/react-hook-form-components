const jsonIsoDateReviver = (_key: string, value: unknown) => {
  if (
    typeof value == "string" &&
    /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z?))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z?))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z?))/.test(
      value,
    )
  ) {
    return new Date(`${value}`);
  }

  return value;
};

const getUtcTimeZeroDate = (date: Date) => {
  const copy = new Date(date.getTime());
  copy.setHours(0, 0, 0, 0);
  copy.setMinutes(copy.getMinutes() - copy.getTimezoneOffset());
  return copy;
};

export { jsonIsoDateReviver, getUtcTimeZeroDate };
