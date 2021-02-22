# BabyFoot Manager

"BabyFoot Manager" is a web application designed to manage all your foot table game in real time. This application is developped using NodeJs with ExpressJs / Socket.io for the backend, and in HTML / CSS / JS for the frontend. All the data are stored in a PostgreSQL database.

## Installation

First of all, you need to setup the PostgreSQL database. You can download it on the official website (https://www.postgresql.org/download/) or directly use the apt package on debian systems :
```shell
$ sudo apt install postgresql
```
Once the database is installed, you can clone the repository and install the project dependencies by running the following command at the root :
```shell
$ npm install
```
After all the dependencies are installed, you need to configure the database by executing the 
`setup.sql` script with this command (replace `USERNAMEDB` by your postgresql username) :
```shell
$ psql -U USERNAMEDB -a -f setup.sql
```
This script will create the database and all the tables needed by the project. One last thing before you can run the project, you need to change the environment variables in the `.env` file to give the project access to the database. Replace `PGUSER` and `PGPASSWORD` by your postgresql username and password.

You can now run the project with :
```shell
$ npm start
```
and access it on http://localhost:8080/ in your web browser.

## Tests

All API endpoints are tested individually with the Mocha library (https://mochajs.org/). You can run this tests with :
```shell
$ npm test
```

## API

Games

`GET /games` list all games.

`POST /games` create a new game.

`PUT /games/:game_id` finish or relaunch a game.

`DELETE /games/:game_id` delete a game.