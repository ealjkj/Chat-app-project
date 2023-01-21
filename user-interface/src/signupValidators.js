import isEmail from "validator/lib/isEmail";

const createValidators = (inputs, t) => ({
  password: (value) => {
    if (value.length < 8)
      return {
        error: true,
        helperText: t("min8char"),
      };

    if (value.length > 20)
      return {
        error: true,
        helperText: t("max20char"),
      };

    if (value.includes(" "))
      return {
        error: true,
        helperText: t("noWhiteSpacesAllowed"),
      };

    return { error: false, helperText: "" };
  },

  passwordConfirm: (value) => {
    return { error: false, helperText: "" };
  },

  email: (value) => {
    if (!isEmail(value))
      return {
        error: true,
        helperText: t("emailNotValid"),
      };

    if (value.length > 40)
      return {
        error: true,
        helperText: t("max40char"),
      };

    return { error: false, helperText: "" };
  },

  username: (value) => {
    if (value.length > 20)
      return {
        error: true,
        helperText: t("max20char"),
      };

    if (value.trim() === "")
      return {
        error: true,
        helperText: t("Please enter a value"),
      };

    return { error: false, helperText: "" };
  },
  firstName: (value) => {
    if (value.length > 20)
      return {
        error: true,
        helperText: t("max20char"),
      };

    if (value.trim() === "")
      return {
        error: true,
        helperText: t("Please enter a value"),
      };

    return { error: false, helperText: "" };
  },
  lastName: (value) => {
    if (value.length > 20)
      return {
        error: true,
        helperText: t("max20char"),
      };

    if (value.trim() === "")
      return {
        error: true,
        helperText: t("Please enter a value"),
      };

    return { error: false, helperText: "" };
  },
});

export default createValidators;
