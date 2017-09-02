from constants import USER_LIST

users = {}

for user in USER_LIST:
 users[user["email"]] = users[user["internal-name"]] = user

def is_android_or_windows(headers):
 if not "user-agent" in headers:
  return False
 else:
  user_agent = headers["user-agent"].lower()
  return "android" in user_agent or "windows" in user_agent

def is_windows(headers):
 if not "user-agent" in headers:
  return False
 else:
  user_agent = headers["user-agent"].lower()
  return "windows" in user_agent

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