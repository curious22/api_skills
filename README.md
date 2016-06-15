# ZAPI
API service to store data about skills (Python 3.5, Flask, RethinkDB)

## Navigation
1. [Requirements](#requirements)
2. [Endpoints](#endpoints)
3. [Queries to the database from the UI](#queries-to-the-database-from-the-ui)

## Установка
### Requirements
* Python 3.5
* [Flask](http://flask.pocoo.org/)
* [RethinkDB](https://www.rethinkdb.com/)
* [Miniconda](http://conda.pydata.org/miniconda.html)

Установка пакетов и окружения через файл setup.sh `bash setup.sh`

Запуск сервера `python api/app.py`

## Endpoints
`*` required field

/registration

* description: _Creates the user if it is not in the DB_
* method `POST`
* Content Type: `application/json`
* Fields:
    * email `*` _string_
    * username `*` _string_
* example: `{"username": "curious", "email": "email@gmail.com"}`
* record in DB:
```
{
  "email": "email@gmail.com",
  "id": "c0ad9ad1-b6fe-4cd7-aa32-cd0e08e2fb15",
  "username": "curious"
}
```
* response codes:
    * `200` User already exists
    * `201` The user is created

/interests
* description: _Creates the record about the user's interests_
* method `POST`
* Content Type: `application/json`
* Fields:
    * email `*` _string_
    * interests `*` _object_
* example: `{"email":"mar@gmail.com","interests":[{"tech_id":1,"interest":1,"level":4},{"tech_id":2,"interest":3,"level":2}]}`
* record in DB:
```
{
  "id": "6c1b5c97-f018-450f-8d94-52fea13e2a24",
  "interests": [
    {
      "interest": 1,
      "level": 4,
      "tech_id": 1
    },
    {
      "interest": 3,
      "level": 2,
      "tech_id": 2
    }
  ],
  "user_id": "2853625f-4595-42a5-b48a-c2e2452fbe9e"
}
```
* response codes:
    * `201` The record is created
    * `401` User is not in the database

/statistics (in progress)
* description: _Returns the interests of all users to display on the chart_
* method `GET`
* response data: _string_ `[{"1":{"level":4,"interest":1},"2":{"level":2,"interest":3}},{"2":{"level":2,"interest":3},"4":{"level":3,"interest":5}}]`
* response codes:
    * `200` Return result
    * `500` Error getting data from database

/profile
* description: _Returns the user's interest_
* method `POST`
* Content Type: `application/json`
* Fields:
    * email `*` _string_
* example: `{"email": "email@gmail.com"}`
* response data: _string_ `{"JS": [1, 2], "Python": [3, 5]}`
* response codes:
    * `200` Return result
    * `401` User is not in the database
    * `500` Error getting data from database

## Queries to the database from the UI
![Data Explorer](https://snag.gy/sPTCVS.jpg)
* `r.db('skills').table('users')` Get all users
* `r.db('skills').table('interests')` Get all interests
