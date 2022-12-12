sh -c 'cd graphql-server/ && echo $PWD && docker build -t ealjkj/graphql-service . && docker push ealjkj/graphql-service'
sh -c 'cd users-service/ && echo $PWD && docker build -t ealjkj/users-service . && docker push ealjkj/users-service'
sh -c 'cd auth-service/ && echo $PWD && docker build -t ealjkj/auth-service . && docker push ealjkj/auth-service'
sh -c 'cd messages-service/ && echo $PWD && docker build -t ealjkj/messages-service . && docker push ealjkj/messages-service'