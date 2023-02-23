function removeDuplicates(members) {
  return members.filter(
    (member, index) =>
      members.findIndex((item) => item.userId === member.userId) === index
  );
}

module.exports = { removeDuplicates };
