const getDeepValue = (object: any, name: string): any => {
  if (name.indexOf(".") > 0) {
    let firstName = name.substring(0, name.indexOf("."));
    let secondName = name.substring(name.indexOf(".") + 1);

    if (firstName.endsWith("]")) {
      secondName = `${firstName.substring(firstName.indexOf("[") + 1).replace("]", "")}.${secondName}`;
      firstName = firstName.substring(0, firstName.indexOf("["));
    }

    if (object[firstName] === undefined) {
      return undefined;
    }

    return getDeepValue(object[firstName], secondName);
  }

  return object[name];
};
export { getDeepValue };
