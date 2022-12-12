sh -c 'cd front/ && echo $PWD && docker build -t leballote/chat_front . && docker push leballote/chat_front'
sh -c 'cd gateway/ && echo $PWD && docker build -t leballote/graphql_gateway . && docker push leballote/graphql_gateway'
cd services
sh -c 'cd user/ && echo $PWD && docker build -t leballote/user_service . && docker push leballote/user_service'
sh -c 'cd chat/ && echo $PWD && docker build -t leballote/chat_service . && docker push leballote/chat_service'
sh -c 'cd auth/ && echo $PWD && docker build -t leballote/auth_service . && docker push leballote/auth_service'