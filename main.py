#!/usr/bin/env python


import unicodedata, logging, os, re

try:
 import json as simplejson
except:
 from google.appengine.dist import use_library
 use_library("django", "1.2")
 from django.utils import simplejson

from datetime import datetime, timedelta

from google.appengine.api import mail, channel, xmpp, memcache
from google.appengine.ext import db, webapp
from google.appengine.ext.webapp import util, template

converse_path = os.path.join(os.path.dirname(__file__), "converse.html")

APPLICATION_VERSION = os.environ.get("CURRENT_VERSION_ID");
HOST_NAME = "messenger.appspot.com"
DEV_MODE = False
if os.environ.get("SERVER_SOFTWARE").startswith("Devel"):
 DEV_MODE = True
 HOST_NAME = "localhost:8082"

class CustomJSONEncoder(simplejson.JSONEncoder):
 def default(self, obj):
  if isinstance(obj, datetime):
   return obj.isoformat()
  elif isinstance(obj, db.Model):
   return dict((p, getattr(obj, p)) for p in obj.properties())
  else:
   return simplejson.JSONEncoder.default(self, obj)

class MessageDatabase(db.Model):
 content = db.TextProperty()
 notified = db.BooleanProperty()
 timestamp = db.DateTimeProperty(auto_now_add=True)
 sender = db.StringProperty()
 recipient = db.StringProperty()

class MessageDatabaseTest(db.Model):
 content = db.TextProperty()
 notified = db.BooleanProperty()
 timestamp = db.DateTimeProperty(auto_now_add=True)
 sender = db.StringProperty()
 recipient = db.StringProperty()

class ReportingDatabase(db.Model):
 type = db.StringProperty()
 value = db.TextProperty()
 timestamp = db.DateTimeProperty(auto_now_add=True)

class ReportingDatabaseTest(db.Model):
 type = db.StringProperty()
 value = db.TextProperty()
 timestamp = db.DateTimeProperty(auto_now_add=True)

class MessageArchiveDatabase(db.Model):
 last_message_timestamp = db.DateTimeProperty()
 first_message_timestamp = db.DateTimeProperty()
 timestamp = db.DateTimeProperty(auto_now_add=True)
 user = db.StringProperty()
 partner = db.StringProperty()

# class MessageDatabase(db.Model):
 # content = db.TextProperty()
 # notified = db.BooleanProperty()
 # timestamp = db.DateTimeProperty(auto_now_add=True)
 # sender = db.StringProperty()
 # recipient = db.StringProperty()

# class MessageDatabaseTest(db.Model):
 # content = db.TextProperty()
 # notified = db.BooleanProperty()
 # timestamp = db.DateTimeProperty(auto_now_add=True)
 # sender = db.StringProperty()
 # recipient = db.StringProperty()

first_hebrew_letter_code = 1488
first_hebrew_letter = unichr(first_hebrew_letter_code)
last_hebrew_letter_code = 1514
last_hebrew_letter = unichr(last_hebrew_letter_code)
letter_pattern = \
 "^[^a-zA-Z" + first_hebrew_letter + "-" + last_hebrew_letter + "]+"

def is_right_to_left_content(content):
 first_character = \
  re.sub(letter_pattern, "", content)
 if len(first_character):
  first_character = ord(first_character[0])
  return first_character >= first_hebrew_letter_code and \
         first_character <= last_hebrew_letter_code
 else:
  return False
 
def write_message(manage, message, user):
 attributes = ""
 #attributes = " " + is_right_to_left_content(message.content)
 if is_right_to_left_content(message.content):
  attributes += " dir=\"rtl\""
 if message.sender == user:
  attributes += " class=\"m\""
 if manage:
  manageString = \
""" (<a onclick="removeMessage(this); return false;"
        href="#">delete</a>)""" % message.key()
 else:
  manageString = ""
 return \
  ("<div data-key=\"%s\"%s>" % \
   (message.key(), attributes)) + \
  ("<span class=\"message-header\">From %s (%s)%s</span><br/>%s</div>" % \
   (message.sender,
    convert_to_local_time(message.timestamp)
     .strftime("%Y-%m-%d %H:%M:%S"),
    manageString, message.content))

def hour_delta():
 if datetime.today() < datetime(day=1,month=4,year=2011,hour=0,minute=0,second=0) or \
    (datetime.today() > datetime(day=1,month=10,year=2011,hour=23,minute=0,second=0) and \
     datetime.today() < datetime(day=30,month=3,year=2012,hour=0,minute=0,second=0)) or \
    (datetime.today() > datetime(day=22,month=9,year=2012,hour=23,minute=0,second=0) and \
     datetime.today() < datetime(day=29,month=3,year=2013,hour=0,minute=0,second=0)) or \
    (datetime.today() > datetime(day=7,month=9,year=2013,hour=23,minute=0,second=0) and \
     datetime.today() < datetime(day=28,month=3,year=2014,hour=0,minute=0,second=0)) or \
    (datetime.today() > datetime(day=27,month=9,year=2014,hour=23,minute=0,second=0) and \
     datetime.today() < datetime(day=27,month=3,year=2015,hour=0,minute=0,second=0)):
  return 2
 else:
  return 3

def convert_to_local_time(time):
  return time + timedelta(hours=hour_delta())

def get_local_time():
  return convert_to_local_time(datetime.today())

class ReclaimChannelTokenPage(webapp.RequestHandler):
 def get(self):
  user = self.request.get("from")
  self.response.out.write(channel.create_channel(user))

def is_android_or_windows(headers):
 if not "user-agent" in headers:
  return False
 else:
  user_agent = headers["user-agent"].lower()
  return "android" in user_agent or "windows" in user_agent

def has_session(headers):
 if is_android_or_windows(headers):
  return "cookie" in headers and "authenticated=1" in headers["cookie"]
 else:
  return True

def is_authenticated(self):
 response = self.response
 request_headers = self.request.headers
 response.headers["WWW-Authenticate"] = "Basic realm=LogIn"
 if not "Authorization" in request_headers:
  response.set_status(401)
  return False
 elif has_session(request_headers) and request_headers["Authorization"] == "Basic dTo=":
  return True
 elif request_headers["Authorization"] == "Basic czo=":
  response.headers["Set-Cookie"] = "authenticated=1"
 response.set_status(401)
 return True


class ConversePage(webapp.RequestHandler):
 def get(self):
  if not is_authenticated(self):
   return   
  manage = self.request.get("manage") or 0
  mode_manage = manage == "1"
  user = self.request.get("from")
  recipient = self.request.get("to")
  status = self.request.get("status")
  unlimited = self.request.get("unlimited") == "1"
  test = self.request.get("test") or 0
  mode_test = test == "1"
  addition = ""
  if mode_test:
   addition = "Test"
  if status:
   status = "(" + status + ")<br/>"
  if unlimited:
   count = 10000
  else:
   count = 10
  if mode_test:
   results = MessageDatabaseTest.all()
  else:
   results = MessageDatabase.all()
  results.filter("sender =", user)
  results.order("-timestamp")
  messages = results.fetch(count)
  if mode_test:
   results = MessageDatabaseTest.all()
  else:
   results = MessageDatabase.all()
  results.filter("recipient =", user)
  results.order("-timestamp")
  messages.extend(results.fetch(count))
  messages.sort(lambda a, b: a.timestamp < b.timestamp or -1)
  rendered_messages = []
  i = 0
  for message in messages:
   if i > 20 and not unlimited:
    break
   if len(message.content) != 0:
    i = i + 1
    rendered_messages.append(write_message(manage, message, user))
  variables = {}
  variables["user"] = user
  variables["to"] = recipient
  variables["status"] = status
  variables["test"] = test
  variables["manage"] = manage
  variables["messages"] = rendered_messages
  variables["channel_name"] = channel.create_channel(user)
  self.response.out.write(template.render(converse_path, variables))

class RemoveMessagePage(webapp.RequestHandler):
 def get(self):
  MessageDatabase.get(self.request.get("key")).delete()

users = \
 {
 }

def get_recipient_email(recipient):
 if recipient == "Foo":
  return "foo@gmail.com"
 elif recipient == "Baz":
   return "baz@gmail.com"
 elif recipient == "Boz":
    return "boz@gmail.com"
 else:
  return ""

def notify_by_xmpp(recipient):
 email = get_recipient_email(recipient)
 if email:
  xmpp.send_invite(email)
  xmpp.send_message(
   email,
   "Welcome to the new messenger. " +
   "Another message was received. " +
   "Replies are not necessary.")
  mail.send_mail("no-reply@messenger.appspotmail.com",
                 email,
                 "A Message Was Received - Do Not Reply",
                 "This is an automated message. No need to reply. " +
                 "Welcome.")
  return

class SendMessagePage(webapp.RequestHandler):
 def post(self):
  dynamic = self.request.get("dynamic")
  manage = self.request.get("manage") == "1"
  user = self.request.get("from")
  recipient = self.request.get("to")
  content = self.request.get("content")
  notify = self.request.get("notify") == "on"
  if notify:
   notify_by_xmpp(recipient)
  test = self.request.get("test") or "0"
  if test == "1":
   testAddition = "-test"
  if test == "1":
   message = MessageDatabaseTest()
  else:
   message = MessageDatabase()
  message.sender = user
  message.recipient = recipient
  message.content = content
  message.notified = notify
  message.put()
  while True:
   delay = 100
   try:
    message.put()
    break
   except db.Timeout:
    thread.sleep(delay)
    delay *= 2
  if not message.is_saved():
   raise db.NotSavedError
  else:
   if content != "":
    message_json = \
     simplejson.dumps(
      {"message": message, "type": "message"},
      cls=CustomJSONEncoder)
    channel.send_message(recipient, message_json)
    channel.send_message(user, message_json)
    #write_message(manage, message, recipient)
    #write_message(manage, message, user)
    status = "Sent."
   else:
    status = "Not sent."
   if dynamic != "1":
    self.redirect("/converse?from=%s&to=%s&status=%s" % (user, recipient, status))
class SignOutPage(webapp.RequestHandler):
 def get(self):
  self.response.headers["Set-Cookie"] = "authenticated=0"

class HandleIncomingXMPPStanzas(webapp.RequestHandler):
 def post(self):
  message = xmpp.Message(self.request.POST)
  logging.debug(message)
  print message
  #raise self.request.get("from")

class HandleChannelConnections(webapp.RequestHandler):
 def post(self):
  memcache.set(self.request.get("from"), datetime.now())
  print self.request.get("from") + "ConnectLog"
  #raise self.request.get("from")

class HandleChannelDisconnections(webapp.RequestHandler):
 def post(self):
  print self.request.get("from") + "DisconnectLog"
  #raise self.request.get("from")
  
def main():
 application = webapp.WSGIApplication(
  [
   ("/converse", ConversePage),
   ("/sign-out", SignOutPage),
   ("/send-message", SendMessagePage),
   ("/reclaim-channel-token", ReclaimChannelTokenPage),
   ("/remove-message", RemoveMessagePage),
   ("/_ah/xmpp/message/chat/", HandleIncomingXMPPStanzas),
   ("/_ah/channel/connected/", HandleChannelConnections),
   ("/_ah/channel/disconnected/", HandleChannelDisconnections)
  ],
  debug=DEV_MODE)
 util.run_wsgi_app(application)


if __name__ == "__main__":
 main()
