const Person = require("./Person");
const axios = require("axios");
const { GraphQLClient, gql } = require("graphql-request");

const endpoint = "http://localhost:7000/graphql";
const graphQlClient = new GraphQLClient(endpoint);

async function createRandomUsers(num) {
  const friends = [];
  for (let i = 0; i < num; i++) {
    const person = Person.random();
    friends.push(person);
    await graphQlClient.request(
      gql`
        mutation ($userInput: UserInput) {
          createUser(userInput: $userInput) {
            success
          }
        }
      `,
      {
        userInput: person.info,
      }
    );
  }
  return friends;
}

async function userLogins(friends) {
  const friendsIDs = [];
  for (let friend of friends) {
    const data = await graphQlClient.request(
      gql`
        mutation ($userInput: UserInput) {
          login(userInput: $userInput) {
            _id
          }
        }
      `,
      {
        userInput: friend.info,
      }
    );

    friendsIDs.push(data.login._id);
  }
  return friendsIDs;
}

async function createRandomFriends(num, userId) {
  const friends = await createRandomUsers(num);
  const ids = await userLogins(friends);
  for (let friendId of ids) {
    await graphQlClient.request(
      gql`
        mutation ($friendshipInput: FriendshipInput) {
          acceptFriend(friendshipInput: $friendshipInput)
        }
      `,
      {
        friendshipInput: { myId: userId, friendId },
      }
    );
  }
}

// createRandomUsers(1);
createRandomFriends(12, "6364e50adf3e8b5a4c1065e4");
