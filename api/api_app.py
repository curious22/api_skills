from flask import Flask
from flask import request, g, abort
import rethinkdb as r
from rethinkdb.errors import RqlRuntimeError, RqlDriverError
from flask_cors import CORS, cross_origin

import json
import logging
from configs import RDB_HOST, RDB_PORT, TODO_DB, codes

application = Flask(__name__)
CORS(application)

FORMAT = u'[%(asctime)s] %(levelname)-8s %(message)s'
logging.basicConfig(format=FORMAT, filename='error.log', level=logging.DEBUG)


# db setup; only run once
def db_setup():
    connection = r.connect(host=RDB_HOST, port=RDB_PORT)
    try:
        r.db_create(TODO_DB).run(connection)
        r.db(TODO_DB).table_create('users').run(connection)
        r.db(TODO_DB).table_create('interests').run(connection)
        logging.info('Database setup completed')
    except RqlRuntimeError:
        logging.info('Database already exists')
    finally:
        connection.close()
db_setup()


# open connection before each request
@application.before_request
def before_request():
    try:
        g.rdb_conn = r.connect(host=RDB_HOST, port=RDB_PORT, db=TODO_DB)
    except RqlDriverError:
        logging.info('Database connection could be established',
                     exc_info=True)
        abort(503, "Database connection could be established.")


# close the connection after each request
@application.teardown_request
def teardown_request(exception):
    try:
        g.rdb_conn.close()
    except AttributeError:
        pass


@application.route('/registration', methods=['POST'])
def create_user():
    data = request.get_json()

    if user_exists(data['email']):
        return 'User already exists'
    else:
        try:
            r.table('users').insert(data).run(g.rdb_conn)
        except Exception as error:
            logging.error('Error when creating user',
                          exc_info=True)
            return error
        return 'User created', 201


@application.route('/statistics')
def get_statistic():
    """Returns the interests of all users"""
    try:
        data = r.table('interests').run(g.rdb_conn)
    except Exception as error:
        logging.error('Error while retrieving statistics',
                      exc_info=True)
        return error
    else:
        results = []
        for i in data.items:
            results.append(get_formatted_interests(i['interests']))
        return json.dumps(results)


@application.route('/interests', methods=['POST'])
def data_processing():
    """Getting data into json to store in the database"""
    data = request.get_json()
    user_id = request_verification(data)

    if isinstance(user_id, int):
        return codes[user_id], user_id
    elif interests_exists(user_id):
        return 'Entry already exists', 400
    else:
        interest = {
            'user_id': user_id,
            'interests': data['interests']
        }
        try:
            r.table('interests').insert(interest).run(g.rdb_conn)
        except Exception as error:
            logging.error('Error when creating a record in the database',
                          exc_info=True)
            return error
        else:
            return 'The record is created', 201


@application.route('/profile', methods=['POST'])
def get_user_interests():
    """Returns the user's interests"""
    data = request_verification(request.get_json())
    if isinstance(data, int):
        return codes[data], data
    else:
        try:
            user_data = r.table('interests').\
                filter(r.row['user_id'] == data).run(g.rdb_conn)
        except Exception as error:
            logging.error('Error getting profile',
                          exc_info=True)
            return error
        else:
            interests = user_data.items[0].get('interests')
            return json.dumps(interests), 200


@application.route('/updating_interest', methods=['POST'])
def updating():
    """Updates an existing record"""
    data = request.get_json()
    user_id = request_verification(data)

    if interests_exists(user_id):
        if updating_interests(user_id, data['interests']):
            return 'The record updated successfully'
        else:
            return 'The record is not updated', 500
    else:
        return 'The record does not exist', 400


# helper functions
def user_exists(email):
    user_in_db = r.table('users').\
        filter(r.row['email'] == email).run(g.rdb_conn)
    if user_in_db.items:
        return True
    else:
        return False


def get_user_id(email):
    user = r.table('users').filter(r.row['email'] == email).run(g.rdb_conn)
    return user.items[0].get('id')


def request_verification(data):
    """Checks for field email and whether there is a user in the database"""
    if 'email' in data:
        if user_exists(data['email']):
            return get_user_id(data['email'])
        else:
            return 401
    else:
        return 400


def get_formatted_interests(user_data):
    """
    Returns a formatted interests
    key - tech_id
    """
    user_interest = {}

    for item in user_data:
        interest = {
            'interest': item['interest'],
            'level': item['level']
        }
        user_interest[item['tech_id']] = interest

    return user_interest


def interests_exists(user_id):
    data = r.table('interests').filter(r.row['user_id'] == user_id).run(g.rdb_conn)
    if data.items:
        return True
    else:
        return False


def updating_interests(user_id, interests):
    """
    Updates interests
    In case of success - True, else - False
    """
    try:
        r.table('interests').filter(r.row['user_id'] == user_id).\
            update({'interests': interests}).run(g.rdb_conn)
    except Exception as error:
        logging.error('Error during update of interest', exc_info=True)
        return False
    else:
        return True


if __name__ == '__main__':
    application.run(debug=True)
