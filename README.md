# ZAPI
API service to store data about skills (Python 3.5, Flask, RethinkDB)

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
* example: `{'username': 'curious', 'email': 'email@gmail.com'}`
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
* example: `{"email": "email@gmail.com", "interests": {"Python": [3, 5], "JS": [1, 2]}}`
* record in DB:
```
{
  "id": "6b33296c-b7ff-4cc1-9d7d-a8a849962004",
  "interests": {
    "JS": [1, 2],
    "Python": [3, 5]
  },
  "user_id": "c0ad9ad1-b6fe-4cd7-aa32-cd0e08e2fb15"
}
```
* response codes:
    * `201` The record is created
    * `401` The user is not authorized

/statistic (in progress)
* description: _Returns the interests of all users to display on the chart_
* method `GET`
* Content Type: `application/json`
