user_list = \
 [
  {
   "internal-name": "foo",
   "real-name": "Foo",
   "nickname": "First",
   "email": "foo@gmail.com",
   "email-for-logs": "foolog@gmail.com",
   "default-recipient": "baz",
   "accepted-xmpp-invitation": True
  },
  {
   "internal-name": "baz",
   "real-name": "Baz",
   "nickname": "Second",
   "email": "baz@gmail.com",
   "email-for-logs": "bazlog@gmail.com",
   "default-recipient": "foo",
   "accepted-xmpp-invitation": True
  },
  {
   "internal-name": "bat",
   "real-name": "Bat",
   "nickname": "Third",
   "email": "bat@gmail.com",
   "email-for-logs": "batlog@gmail.com",
   "default-recipient": "foo",
   "accepted-xmpp-invitation": False
  }
 ]

users = {}

for user in user_list:
 users[user["email"]] = users[user["internal-name"]] = user

def is_android_or_windows(headers):
 if not "user-agent" in headers:
  return False
 else:
  user_agent = headers["user-agent"].lower()
  return "android" in user_agent or "windows" in user_agent

def get_email(internal_name):
 if internal_name in users:
  return users[internal_name]["email"]
 return ""

def get_sender_nickname_or_me(sender, user):
 if sender == user:
  return "me"
 else:
  return \
   users[sender]["nickname"] \
   if sender in users else sender