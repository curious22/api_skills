# table users
user = {
	'username': 'curious',
	'email': 'email@gmail.com'
}

# table interests
interests = {
	'user_id': 'c0ad9ad1-b6fe-4cd7-aa32-cd0e08e2fb15',
	'interests': {
		'Python': [3, 5],
		'JS': [1, 2],
	}
}

# json examples
{"username": "curious", "email": "email@gmail.com"} # users
{"email": "email@gmail.com", "interests": {"Python": [3, 5], "JS": [1, 2]}} # interests

# records in DB
{
  "id": "6b33296c-b7ff-4cc1-9d7d-a8a849962004",
  "interests": {
    "JS": [1, 2],
    "Python": [3, 5]
  },
  "user_id": "c0ad9ad1-b6fe-4cd7-aa32-cd0e08e2fb15"
}
