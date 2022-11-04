const { getRandomElement } = require("./utils");
const fs = require("fs");
const { info } = require("console");

const buffer = fs.readFileSync("data.json");
const data = JSON.parse(buffer);

const Person = class {
  constructor(info) {
    this.info = info;
  }

  static random() {
    const firstName = getRandomElement(data.names);
    const lastName = getRandomElement(data.lnames);

    const info = {
      firstName,
      lastName,
      description:
        getRandomElement(data.greetings) +
        ` My name is ${firstName} ${lastName}`,
      email: `${firstName}@${getRandomElement(data.mailServices)}.com`,
      username: `${firstName}${getRandomElement([
        1, 2, 3, 4, 5, 6,
      ])}${getRandomElement([7, 8, 9, 0, "a", "h"])}`,
      password: "12345678",
      passwordConfirm: "12345678",
      avatar: getRandomElement(data.avatars),
    };

    return new Person(info);
  }
};

const person = Person.random();

module.exports = Person;
