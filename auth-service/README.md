## Enviroment variables
There are some enviroment variables that need to be defined to run the application. 

### Network

- `PORT` determines on which port the application is gonna be listening.

### DATABASE
There is also an enviroment variable that determines the location of the db-server

- `MONGODB_URL` is the url for Mongo database. **Example:** `MONGODB_URL="mongodb://127.0.0.1:27017/auth-db"`
 
### SECURITY
Since this API manages sensitive data, is important to have some sort of encryption. 

- `JWT_SECRET` is the secret used for the Json Web Token generation. **Example:** `JWT_SECRET="mysecret"`
