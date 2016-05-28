from flask import Flask
from flask import request, g, abort
import rethinkdb as r
from rethinkdb.errors import RqlRuntimeError, RqlDriverError

import pprint
import json
from configs import RDB_HOST, RDB_PORT, TODO_DB

app = Flask(__name__)

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
@app.before_request
def before_request():
    try:
        g.rdb_conn = r.connect(host=RDB_HOST, port=RDB_PORT, db=TODO_DB)
    except RqlDriverError:
        abort(503, "Database connection could be established.")


# close the connection after each request
@app.teardown_request
def teardown_request(exception):
    try:
        g.rdb_conn.close()
    except AttributeError:
        pass

@app.route('/registration', methods=['POST'])
def create_user():
    data = request.form
    user = {
        'username': data.get('username'),
        'email': data.get('email')
    }

    if not user_exists(user['email']):
        try:
            r.table('users').insert(user).run(g.rdb_conn)
        except Exception as e:
            print(e)
        return 'User created', 201
    else:
        return 'User already exists'


@app.route('/statistic')
def get_statistic():
    """Returns the data for the chart drawing"""
    return 'Data for charmts'


@app.route('/interests', methods=['POST'])
def data_processing():
    """Getting data into json to store in the database"""
    data = request.get_json()
    print(data)
    user_email = data['email']

    if user_exists(user_email):
        user_id = get_user_id(user_email)
        print(data, user_id)
        return 'interests'
    else:
        return 'The user is not authorized', 401

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


if __name__ == '__main__':
    app.run(debug=True)
