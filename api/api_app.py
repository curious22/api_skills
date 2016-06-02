from flask import Flask
from flask import request, g, abort
import rethinkdb as r
from rethinkdb.errors import RqlRuntimeError, RqlDriverError

import json
from configs import RDB_HOST, RDB_PORT, TODO_DB, codes

application = Flask(__name__)


def add_to_log(*args):
    print('\n'.join([str(arg) for arg in args]))


# db setup; only run once
def dbSetup():
    connection = r.connect(host=RDB_HOST, port=RDB_PORT)
    try:
        r.db_create(TODO_DB).run(connection)
        r.db(TODO_DB).table_create('users').run(connection)
        r.db(TODO_DB).table_create('interests').run(connection)
        print('Database setup completed')
    except RqlRuntimeError:
        print('Database already exists.')
    finally:
        connection.close()
dbSetup()

# open connection before each request
@application.before_request
def before_request():
    try:
        g.rdb_conn = r.connect(host=RDB_HOST, port=RDB_PORT, db=TODO_DB)
    except RqlDriverError:
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
        except Exception as e:
            add_to_log('error during create user', e)
        return 'User created', 201


@application.route('/statistics')
def get_statistic():
    """Returns the interests of all users"""
    try:
        data = r.table('interests').run(g.rdb_conn)
    except Exception as e:
        add_to_log('error during get statistic', e)
        return e, 500
    else:
        results = []
        for i in data.items:
            results.append(i['interests'])
        return json.dumps(results)


@application.route('/interests', methods=['POST'])
def data_processing():
    """Getting data into json to store in the database"""
    data = request.get_json()
    user_id = request_verification(data)

    if isinstance(user_id, int):
        return codes[user_id], user_id
    else:
        interest = {
            'user_id': user_id,
            'interests': data['interests']
        }
        try:
            r.table('interests').insert(interest).run(g.rdb_conn)
        except Exception as e:
            add_to_log(e)
            return e, 500
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
            user_data = r.table('interests').filter(r.row['user_id'] == data).run(g.rdb_conn)
        except Exception as e:
            return e, 500
        else:
            interests = user_data.items[0].get('interests')
            return json.dumps(interests), 200


# helper functions
def user_exists(email):
    user_in_db = r.table('users').filter(r.row['email'] == email).run(g.rdb_conn)
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


if __name__ == '__main__':
    application.run(debug=True)
    # TODO add logging to a file
    # TODO remove 200, 500
