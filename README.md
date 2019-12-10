```js
npm install

npm install pm2 -g

npm test : test register servers

npm stop : stop test

example

pm2 config

{
  "apps": [
    {

      "name": "connector1",
      "max_memory_restart": "2024M",
      "log_date_format": "YYYY-MM-DD HH:mm",
      "script": "./main/connector/connector.js",
      "out_file": "./log/app.log",
      "error_file": "./log/err.log",
       "port": "7081",
       "env": {
        "SERVER_TYPE":"connector",
        "DEBUG":"* node ./main/connector/connector.js",
        "PORT": "7081",
        "HOST":"192.168.1.127"
      }
    },
    {
      "name": "connector2",
      "max_memory_restart": "2024M",
      "log_date_format": "YYYY-MM-DD HH:mm",
      "script": "./main/connector/connector.js",
      "out_file": "./log/app.log",
      "error_file": "./log/err.log",
      "port": "7082",
      "env": {
        "SERVER_TYPE":"connector",
        "DEBUG":"* node ./main/connector/connector.js",
        "PORT": "7082",
        "HOST":"192.168.1.127"
      }
    },
    {
      "name": "connector3",
      "max_memory_restart": "2024M",
      "log_date_format": "YYYY-MM-DD HH:mm",
      "script": "./main/connector/connector.js",
      "out_file": "./log/app.log",
      "error_file": "./log/err.log",
      "port": "7083",
      "env": {
        "SERVER_TYPE":"connector",
        "DEBUG":"* node ./main/connector/connector.js",
        "PORT": "7083",
        "HOST":"192.168.1.127"
      }
    },
    {
      "name": "connector4",
      "max_memory_restart": "2024M",
      "log_date_format": "YYYY-MM-DD HH:mm",
      "script": "./main/connector/connector.js",
      "out_file": "./log/app.log",
      "error_file": "./log/err.log",
      "port": "7084",
      "env": {
        "SERVER_TYPE":"connector",
        "DEBUG":"* node ./main/connector/connector.js",
        "PORT": "7084",
        "HOST":"192.168.1.127"
      }
    },
    {
      "name": "connector5",
      "max_memory_restart": "2024M",
      "log_date_format": "YYYY-MM-DD HH:mm",
      "script": "./main/connector/connector.js",
      "out_file": "./log/app.log",
      "error_file": "./log/err.log",
      "port": "7085",
      "env": {
        "SERVER_TYPE":"connector",
        "DEBUG":"* node ./main/connector/connector.js",
        "PORT": "7085",
        "HOST":"192.168.1.127"
      }
    }
  ]
}

and connector.js like

var ServerFactory = require("consistent-hashing-server");
var serverFactory = new ServerFactory(host+":"+port,"/connectors",5,constants.zookeeper_url);
serverFactory.getServer(key);



run test-add-or-stop-a-server.js (add server)

serverFactory.getServer(10) return localhost:7083


pm2 stop connector3 (stop server)

serverFactory.getServer(10) return localhost:test


then start connector3

serverFactory.getServer(10) return localhost:7084
