npm install
npm install pm2 -g
npm test : register servers
npm stop : stop test

example
run test-add-or-stop-a-server.js

serverFactory.getServer(10) return localhost:7083

you can pm2 stop connector3,and wait the zookeeper timeout

serverFactory.getServer(10) return localhost:test

then start connector3

serverFactory.getServer(10) return localhost:7084

