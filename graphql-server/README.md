## Enviroment variables
There are some enviroment variables that need to be defined to run the application. 

### Network

- `PORT` determines on which port the application is gonna be listening.

### APIs
On top of that, there are some enviroment variables used to consume other services

- `AUTH_API` is the url for the authorization/authentication API. **Example:** `AUTH_API="http://localhost:3000"`
- `USER_API` is the url for the user API. **Example:** `USER_API="http://localhost:4000"`
- `MESSAGES_API` is the url for the conversations-messages API. **Example:** `MESSAGES_API="http://localhost:5000"`