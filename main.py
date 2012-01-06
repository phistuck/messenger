#!/usr/bin/env python
#from google.appengine.dist import use_library
#use_library("django", "1.2")
import os, re, time, webapp2, datetime, logging, json
from datetime import timedelta, datetime

from google.appengine.api import mail, channel, xmpp, memcache, urlfetch
from google.appengine.runtime import apiproxy_errors
from google.appengine.ext import db, deferred
from google.appengine.ext.webapp import template #, util
from google.appengine.ext.webapp.mail_handlers import InboundMailHandler

from messenger \
 import authentication, db_util, time_util, canned_messages, \
        internationalization, user_details

def create_html_path(name):
 return os.path.join(os.path.dirname(__file__), "html/" + name)

HOST_NAME = "messenger.appspot.com"
APPLICATION_VERSION = os.environ.get("CURRENT_VERSION_ID");
DEV_MODE = False
if os.environ.get("SERVER_SOFTWARE").startswith("Devel"):
 DEV_MODE  = True
 HOST_NAME = "localhost:8082"
 APPLICATION_VERSION = "dev" + str(datetime.now())
SEND_MESSAGE_PATH = "/send-message"
SEND_MESSAGE_URL = "https://" + HOST_NAME + SEND_MESSAGE_PATH

"""
 General utility functions and classes.
"""

def secure(self):
 if not DEV_MODE:
  self.response.headers["Strict-Transport-Security"] = \
   "max-age=500; includeSubdomains"

def write(self, file_name):
 write(self, file_name, {})

def write(self, file_name, variables):
 self.response.write(template.render(create_html_path(file_name), variables))

def get_user_readable_timestamp(timestamp):
 return timestamp.strftime("%Y-%m-%d %H:%M:%S")
 
def get_user_readable_local_timestamp(timestamp):
 return get_user_readable_timestamp(
         time_util.convert_to_local_time(timestamp))

#def parse_javascript_timestamp(timestamp_string):
# return datetime.strptime(
#         timestamp_string[0:-9], "%a %b %d %Y %H:%M:%S")

year_switch_pattern = re.compile("([\\d:]{8}) ([\\d]{4})")
def get_javascript_datetime_string(timestamp):
 return year_switch_pattern.sub("\\2 \\1", timestamp.ctime()) + " GMT+0000"

trailing_z_pattern = re.compile("[zZ]$")
microsecond_dot_pattern = re.compile("\\.")
def parse_iso_timestamp(iso_timestamp):
 if "." in iso_timestamp:
  return datetime.strptime(
          trailing_z_pattern.sub("", iso_timestamp), "%Y-%m-%dT%H:%M:%S.%f")
 else:
  return datetime.strptime(
         trailing_z_pattern.sub("", iso_timestamp), "%Y-%m-%dT%H:%M:%S")

def write_message(manage, message, user):
 content = message.content
 className = " m" if message.sender == user else ""
 if manage:
  manageString = " (<a data-action=\"remove\" href=\"#\">delete</a>)"
 else:
  manageString = ""
 sender = message.sender
 html = \
  ("<div data-sender=\"%s\" data-recipient=\"%s\" data-key=\"%s\" " % \
   (sender, message.recipient, message.key())) + \
   ("class=\"message%s\">" % \
   className) + \
  ("<div class=\"message-headers\">From %s (%s)%s</div>" % \
   (sender, \
    get_user_readable_local_timestamp(message.timestamp), manageString))
 if internationalization.is_right_to_left_content(message.content):
  html += "<div dir=\"rtl\">" + content + "</div>"
 else:
  html += "<div>" + content + "</div>"
 html += "</div>"
 return html

def send_chat_message(jid, content, invite = True):
 xmpp.send_invite(jid)
 xmpp.send_message( \
  jid, content, from_jid = "messenger@appspot.com")

test_mode_channel_prefix = "____test_mode____"
def send_channel_message(test_mode, recipient, content):
 if test_mode:
  fixed_recipient = (test_mode_channel_prefix + recipient)
 else:
  fixed_recipient = recipient
 channel.send_message(fixed_recipient, content)

def is_test_channel_recipient(recipient):
 return recipient.startswith(test_mode_channel_prefix)

def clean_test_channel_recipient(recipient):
 return recipient[len(test_mode_channel_prefix) - 1:]

def send_email(
 email, subject, content,
 sender = "Messenger <no-reply@messenger.appspotmail.com>"):
 mail.send_mail(sender, email, subject, content)

def notify_recipient(recipient):
 if recipient in user_details.users:
  email = user_details.users[recipient]["email"]
  invite = not user_details.users[recipient]["accepted-xmpp-invitation"]
  send_chat_message( \
   email,
   "Welcome to the messenger. " +
   "A message was received. " +
   "Replies are not necessary.",
   invite = invite
   )
  send_email( \
   email,
   "A Message Was Received - Do Not Reply",
   "This is an automated message. No need to reply. " +
   "Welcome.")
  return

class CustomJSONEncoder(json.JSONEncoder):
 def default(self, obj):
  if isinstance(obj, datetime):
   return get_javascript_datetime_string(obj)
  elif isinstance(obj, db.Model):
   return dict((p, getattr(obj, p)) for p in obj.properties())
  else:
   return json.JSONEncoder.default(self, obj) 

def to_json(data, indent = DEV_MODE):
 return json.dumps(data, cls = CustomJSONEncoder, indent = indent)

def from_json(json_string):
 return json.loads(json_string)

def get_data(name, initial_value, data = None):
 if not data:
  data = memcache.get("application-data") or {}
 if not name in data:
  data[name] = initial_value
 return (data, data[name])

def set_data(data):
 memcache.set("application-data", data)

def initialize_user_data(users_data, user):
 if not user in users_data:
  users_data[user] = \
   {
    "last-read-message-timestamp": None
   }
 return users_data[user]

timestamp_1998 = datetime(year = 1998, month = 1, day = 1)
timestamp_1999 = datetime(year = 1999, month = 1, day = 1)
timestamp_2000 = datetime(year = 2000, month = 1, day = 1)
timestamp_2001 = datetime(year = 2001, month = 1, day = 1)

def get_set_history_data(
 data, sender, recipient, property = None, value = None):
 history_data = data["history-data"]
 save = False

 if not sender in history_data:
  save = True
  history_data[sender] = {}
 if not recipient in history_data:
  save = True
  history_data[recipient] = {}
 if not recipient in history_data[sender]:
  save = True
  history_data[sender][recipient] = \
   {
    "last-message": timestamp_1999,
    "previous-last-message": timestamp_1998,
    "last-logged-message": timestamp_2000
   }
 if not sender in history_data[recipient]:
  save = True
  history_data[recipient][sender] = \
   {
    "last-message": timestamp_1999,
    "previous-last-message": timestamp_1998,
    "last-logged-message": timestamp_2000
   }
 if property:
  save = True
  history_data[recipient][sender][property] = value
  history_data[sender][recipient][property] = value
 if save:
  set_data(data)
 return history_data

def send_message(
 test_mode, dynamic, user, recipient, content, notify, data = None,
 unique_id = None):
 if notify:
  notify_recipient(recipient)
 try:
  message = db_util.save_message(test_mode, user, recipient, content, notify)
  if not content:
   return True
  message_json = \
   to_json(
    {
     "value": message,
     "accurate-timestamp": message.timestamp.isoformat(),
     "unique-id": unique_id,
     "key": str(message.key()),
     "type": "message"
    })
  send_channel_message(test_mode, recipient, message_json)
  send_channel_message(test_mode, user, message_json)
  (data, users_data) = get_data("users-data", {}, data = data)
  (data, history_data) = get_data("history-data", {}, data = data)
  get_set_history_data(
   data, user, recipient, property = "last-message", value = message.timestamp)
  if is_xmpp_user_available(recipient, data = data):
   send_chat_message(user_details.users[recipient]["email"], content)
   get_set_history_data(
    data, recipient, user, property = "last-read-message-timestamp",
    value = message.timestamp)
  user_data = initialize_user_data(users_data, recipient)
  if not user_data["last-read-message-timestamp"]:
   user_data["last-read-message-timestamp"] = \
    (datetime.now() - timedelta(seconds = 1))
   set_data(data)
  return True
 except (db.NotSavedError, db.Timeout, apiproxy_errors.DeadlineExceededError):
  if not dynamic:
   return False
  else:
   raise "Error"

def convert_coordinates_to_address(location, data = None):
 if location:
  try:
   (data, locations) = get_data("locations", {}, data = data)
   if not location in locations:
    response = \
     urlfetch.fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
      location + "&sensor=true")
    content = from_json(response.content)
    locations[location] = content[u"results"][0][u"formatted_address"]
    set_data(data)
   return locations[location]
  except:
   return ""

def update_presence_state(
 test_mode, user, location, typing, online,
 last_read_message_timestamp = None, data = None):
 if user:
  (data, active_users) = get_data("active-users", {}, data = data)
  if (not online) and user in active_users:
   del active_users[user]
  else:
   user_state = \
    {
     "timestamp": datetime.now(),
     "location-coordinates": location,
     "location": "",
     "typing": datetime.now() if typing else 0
    }
   if last_read_message_timestamp:
    (data, users_data) = get_data("users-data", {}, data = data)
    user_data = initialize_user_data(users_data, user)
    user_data["last-read-message-timestamp"] = last_read_message_timestamp
   if user in active_users:
    previous_user_state = active_users[user]
    if location and location != previous_user_state["location-coordinates"]:
     resolved_address = convert_coordinates_to_address(location, data)
     user_state["location"] = resolved_address
    else:
     user_state["location"] = previous_user_state["location"]
   else:
    user_state["location"] = convert_coordinates_to_address(location, data)
   if online:
    active_users[user] = user_state
  set_data(data)
  message_json = \
   to_json(
    {
     "type": "presence",
     "value": active_users
    })
  for online_user in active_users:
   send_channel_message(test_mode, online_user, message_json)

"""
 Page classes.
"""

class UpdatePresenceDataPage(webapp2.RequestHandler):
 def get(self):
  secure(self)
  last_read_message_timestamp = self.request.get("last-message-timestamp")
  if last_read_message_timestamp:
   last_read_message_timestamp = \
    parse_iso_timestamp(last_read_message_timestamp)
  update_presence_state(
   self.request.get("test") == 1, self.request.get("from"),
   self.request.get("location") or "", self.request.get("typing") == "1", True,
   last_read_message_timestamp = last_read_message_timestamp)

class ReclaimChannelTokenPage(webapp2.RequestHandler):
 def get(self):
  secure(self)
  user = self.request.get("from")
  if self.request.get("test") == "1":
   user = test_mode_channel_prefix + user
  self.response.write(channel.create_channel(user))

def get_last_messages_for_user(test_mode, user, unlimited, data = None):
 return_object = {}
 (data, users_data) = get_data("users-data", {}, data = data)
 user_data = initialize_user_data(users_data, user)
 timestamp = user_data["last-read-message-timestamp"]
 advanced_timestamp = None
 # We have data regarding the last read message timestamp
 if timestamp:
  # Adding a microsecond to the timestamp so we would not
  # consider the last message as unread.
  advanced_timestamp = timestamp + timedelta(microseconds = 1)
 if unlimited:
  count = 100000
 else:
  count = 20
 fetched_messages = \
  db_util.fetch_messages_for_user(
   test_mode, user, count, advanced_timestamp, True)
 if timestamp:
  fetched_unread_messages = \
    db_util.fetch_messages_for_user(
     test_mode, user, count, timestamp, False)
 else:
  fetched_unread_messages = []
  return_object["show-messages"] = True
 while len(fetched_unread_messages):
  if fetched_unread_messages[0].sender == user:
   fetched_messages.append(fetched_unread_messages.pop(0))
   return_object["show-messages"] = True
  else:
   break
 return_object["last-messages"] = fetched_messages
 return_object["new-messages"] = fetched_unread_messages
 return return_object

class ConversePage(webapp2.RequestHandler):
 def get(self):
  secure(self)
  if not authentication.is_authenticated(self, DEV_MODE):
   return
  development = self.request.get("dev") == "1"
  desktop = self.request.get("desktop") or "0"
  mode_desktop = desktop == "1"
  manage = self.request.get("manage") or "0"
  mode_manage = manage == "1"
  user = self.request.get("from")
  recipient = self.request.get("to")
  unlimited = self.request.get("unlimited") == "1"
  test = self.request.get("test") or "0"
  test_mode = test == "1"
  message_list = get_last_messages_for_user(test_mode, user, unlimited)
  fetched_messages = message_list["last-messages"]
  fetched_unread_messages = message_list["new-messages"]
  message_timestamp_offsets = \
   {
    "first": datetime.now().isoformat(),
    "last": datetime.now().isoformat()
   }
  def render_messages(messages, define_first):
   rendered_messages = []
   for message in messages:
    if message.content:
     if define_first:
      message_timestamp_offsets["first"] = message.timestamp.isoformat()
      define_first = False
     else:
      message_timestamp_offsets["last"] = message.timestamp.isoformat()
     rendered_messages.append(write_message(mode_manage, message, user))
   return rendered_messages
  messages = render_messages(fetched_messages, True)
  unread_messages = render_messages(fetched_unread_messages, False)
  variables = {}
  variables["user"] = user
  variables["to"] = recipient
  variables["status"] = self.request.get("status")
  variables["test"] = test
  variables["manage"] = manage
  variables["messages"] = messages
  variables["dev_mode"] = DEV_MODE
  variables["desktop"] = desktop
  variables["desktop_mode"] = mode_desktop
  variables["new_messages_mode"] = len(unread_messages) > 0
  variables["unread_messages"] = unread_messages
  variables["development"] = development  
  variables["channel_name"] = \
   channel.create_channel(
    user if not test_mode else test_mode_channel_prefix + user)
  variables["canned_messages"] = canned_messages.list;
  variables["application_version"] = APPLICATION_VERSION;
  variables["first_message_timestamp"] = message_timestamp_offsets["first"]
  variables["last_message_timestamp"] = message_timestamp_offsets["last"]
  write(self, "converse.html", variables)

class RemoveMessagePage(webapp2.RequestHandler):
 def get(self):
  secure(self)
  key = self.request.get("key") or ""
  sender = self.request.get("sender") or ""
  recipient = self.request.get("recipient") or ""
  test_mode = self.request.get("test") == "1"
  if not key:
   return
  db_util.remove_message(test_mode, key)
  message_json = \
   to_json(
    {
     "type": "remove-message",
     "value": key
    })
  send_channel_message(test_mode, sender, message_json)
  send_channel_message(test_mode, recipient, message_json)

def import_message_history_import_async(test_mode):
   data = memcache.get("application-data") or {}
   if not "imported-messages" in data:
    data["imported-messages"] = 0
   messages_to_import = []
   response = {"content": template.render(create_html_path("history-to-import.json"), {})}
   logging.info("Got the response.")
   try:
    content = from_json(response["content"])
    logging.info("Parsed the response.")
   except:
    return
   for message in content[u"messages"]:
    timestamp = datetime.strptime(message[u"timestamp"], "%m/%d/%Y %I:%M:%S %p")
    if time_util.timestamp_hour_delta(timestamp) == 3:
     timestamp = timestamp - timedelta(hours = 1)
    messages_to_import.append(
     db_util.create_message(
      test_mode, content = message[u"content"], sender = message[u"sender"],
      recipient = message[u"recipient"], timestamp = timestamp))
   logging.info("Appended the messages.")
   logging.info(len(messages_to_import))
   logging.info("Saved the data.")
   if len(messages_to_import):
     messages_to_import = messages_to_import[data["imported-messages"] - 1:]
     for i in range (0, 15):
      if not len(messages_to_import):
       break
      messages_to_import[0].put()
      logging.debug("Saving a message.")
      if messages_to_import[0].key():
       messages_to_import.pop(0)
       data["imported-messages"] = data["imported-messages"] + 1
       set_data(data)
      else:
       break
     if len(messages_to_import):
      defer_import_messages(test_mode)

def defer_import_messages(test_mode):
 deferred.defer(import_message_history_import_async, test_mode, _countdown=300)

class ImportMessageHistory(webapp2.RequestHandler):
 def get(self):
  defer_import_messages(self.request.get("test") == "1")   

class SendMessagePage(webapp2.RequestHandler):
 def post(self):
  test_mode = self.request.get("test") == "1"
  test = "&test=1" if test_mode else ""
  manage = "&manage=1" if self.request.get("manage") == "1" else ""
  last_read_message_timestamp = \
   self.request.get("last-message-timestamp") or None
  dynamic = self.request.get("dynamic") == "1"
  user = self.request.get("from")
  unique_id = self.request.get("unique-id") or None
  data = None
  if last_read_message_timestamp:
   (data, users_data) = get_data("users-data", {})
   user_data = initialize_user_data(users_data, user)
   user_data["last-read-message-timestamp"] = \
    parse_iso_timestamp(last_read_message_timestamp)
  recipient = self.request.get("to")
  content = self.request.get("content")
  notify = self.request.get("notify") == "on"
  sent = send_message( \
   test_mode, dynamic, user, recipient, content, notify,
   data = data, unique_id = unique_id)
  if last_read_message_timestamp:
   set_data(data)
  status = "Sent." if sent else "Not sent."
  if not dynamic:
   self.redirect(
    "/converse?from=%s&to=%s%s%s&status=%s" % \
    (user, recipient, test, manage, status))

class SignOutPage(webapp2.RequestHandler):
 def get(self):
  secure(self)
  self.response.headers["Set-Cookie"] = "authenticated=0"
  self.redirect("/redirect-to-converse")

def is_xmpp_user_available(user, data = None):
 (data, xmpp_users_data) = get_data("xmpp-users", {}, data = data)
 return user in xmpp_users_data and \
         xmpp_users_data[user]["available"] > datetime.now()

remove_xmpp_bot_pattern = re.compile("/.*$")
digit_only_pattern = re.compile("\\D")
class HandleIncomingXMPPStanzas(webapp2.RequestHandler):
 def post(self):
  message = xmpp.Message(self.request.POST)
  jid = remove_xmpp_bot_pattern.sub("", message.sender)
  transmit_message = True
  available_time = None
  disguise_service = False
  if not jid in user_details.users:
   return
  (data, xmpp_users_data) = get_data("xmpp-users", {})
  (data, history_data) = get_data("history-data", {}, data = data)
  (data, users_data) = get_data("users-data", {}, data = data)
  if not jid in xmpp_users_data:
   xmpp_users_data[jid] = \
    {
     "available": datetime(year = 1900, month = 1, day = 1),
     "offset": None
    }
  xmpp_user_data = xmpp_users_data[jid]
  recipient = user_details.users[jid]["default-recipient"]
  user = user_details.users[jid]["internal-name"]
  user_data = initialize_user_data(users_data, user)
  def update_xmpp_state(available_time):
   xmpp_user_data["available"] = \
    datetime.now() + timedelta(minutes = available_time)
   if xmpp_user_data["available"] < datetime.now():
    xmpp_user_data["offset"] = None\

  def send_disguise_message(optional_text):
   if optional_text.__class__.__name__ == "bool":
    optional_text = ""
   message.reply(
    "%s\n\n\n\n\n\n\n\n\n\n\n\n\n\nPlease, do not reply." % optional_text)

  def send_messages(messages):
   contents = []
   first = True
   for message in messages:
    if message.__class__.__name__ == "bool":
     contents.append("\n_Yet unread messages -_")
    elif message.content:
     contents.append(
      message.sender + " (" +
      get_user_readable_local_timestamp(message.timestamp) + ") -\n" +
      message.content)
     if first:
      xmpp_user_data["offset"] = message.timestamp
      first = False

   if len(contents):
    send_chat_message(jid, "\n".join(contents), invite = False)

  def send_new_messages():
   #logging.info("Sending new messages.")
   history_data = get_set_history_data(data, user, recipient)
   abort_send = True
   has_history_data = False
   if user_data["last-read-message-timestamp"]:
    for history_user_data in history_data[user]:
     history_user_data = history_data[user][history_user_data]   
     #logging.info(history_user_data)
     has_history_data = True
     if user_data["last-read-message-timestamp"] < history_user_data["last-message"]:
      abort_send = False
    if has_history_data and abort_send:
     return
   #logging.info("Looking for messages...")
   message_list = get_last_messages_for_user(False, user, False)
   if message_list["show-messages"]:
    messages = []
    messages.extend(message_list["last-messages"])
    if len(message_list["new-messages"]):
     messages.append(True)
     messages.extend(message_list["new-messages"])
    try:
     user_data["last-read-message-timestamp"] = \
      messages[len(messages) - 1].timestamp
    except:
     pass
    send_messages(messages)

  def send_old_messages():
   #logging.info("Sending old messages.")
   send_messages(
    db_util.fetch_messages_for_user(
     False, user, 20, xmpp_user_data["offset"], True))

  body = message.body
  enter_real_mode = body.startswith("--real")
  enter_stop_mode = body.startswith("--stop")
  enter_more_mode = body.startswith("--more")
  if enter_real_mode or enter_stop_mode or enter_more_mode:
   transmit_message = False
   #logging.info("It starts with --real, --stop, or --more")
  if enter_real_mode:
   available_time = int(digit_only_pattern.sub("", body) or 5)
   message.reply("_The real mode was activated - messages may follow._")
   send_new_messages()
  elif enter_more_mode:
   send_old_messages()
  elif body.startswith("SAW") or body.startswith("PAW") or \
       enter_stop_mode:
   disguise_service = True
   available_time = -1
  if available_time:
   update_xmpp_state(available_time)
  if transmit_message:
   sent = send_message(False, False, jid, recipient, body, False, data = data)
   if is_xmpp_user_available(user, data = data) and sent:
    message.reply("_Sent._")
   elif not sent and is_xmpp_user_available(user, data = data):
     message.reply("_The message could not be delivered... sorry. :(_")
   elif sent and not is_xmpp_user_available(user, data = data):
    disguise_service = True
   else:
    disguise_service = "_Sorry, the service is not available._"
  elif not enter_real_mode and not enter_more_mode:
   disguise_service = True
  if disguise_service:
   send_disguise_message(disguise_service)
  #logging.info(to_json(data, indent = True))
  set_data(data)

class HandleChannelConnections(webapp2.RequestHandler):
 def post(self):
  test_mode = False
  recipient = self.request.get("from")
  if is_test_channel_recipient(recipient):
   test_mode = True
   recipient = clean_test_channel_recipient(recipient)
  update_presence_state(test_mode, recipient, "", False, True)

class HandleChannelDisconnections(webapp2.RequestHandler):
 def post(self):
  test_mode = False
  recipient = self.request.get("from")
  if is_test_channel_recipient(recipient):
   test_mode = True
   recipient = clean_test_channel_recipient(recipient)
  update_presence_state(test_mode, recipient, "", False, False)

def fetch_more_messages_reply(test_mode, user, return_object):
 message_json = to_json(return_object)
 
 def send():
  send_channel_message(test_mode, user, message_json)

 if len(message_json) < 32000:
  send()
  return
 
 message_count = len(return_object["value"])
 sent_message_count = 0
 new_return_object = \
  {
   "type": return_object["type"],
   "timestamp": return_object["timestamp"],
   "value": return_object["value"]
  }
 while sent_message_count < message_count:
  while len(message_json) > 32000:
   if len(new_return_object["value"]) == 1:
    # TODO - handle the case where a single
    # message is too big for us to handle.
    return
   new_return_object["value"] = \
    new_return_object["value"][1:len(new_return_object["value"])]
   message_json = to_json(new_return_object)
  send()
  sent_message_count = sent_message_count + len(new_return_object["value"])
  if not sent_message_count == message_count:
   new_return_object["value"] = \
    return_object["value"][0:message_count - len(new_return_object["value"])]


class FetchMoreMessagesPage(webapp2.RequestHandler):
 def get(self):
  secure(self)
  user = self.request.get("from")
  original_timestamp = self.request.get("timestamp")
  timestamp = parse_iso_timestamp(original_timestamp)
  test_mode = self.request.get("test") == "1"
  queued_messages_mode = self.request.get("queued") == "1"
  return_object = \
   {
    "type": "queued-messages" if queued_messages_mode else "old-messages",
    "timestamp": original_timestamp,
    "value": []
   }

  count = 10000 if queued_messages_mode else 20

  messages = \
   db_util.fetch_messages_for_user(
    test_mode, user, count, timestamp, not queued_messages_mode)
  if not len(messages):
   fetch_more_messages_reply(test_mode, user, return_object)
   return

  messages_to_send = []
  for message in messages:
   if message.content:
    messages_to_send.append( \
     {
      "value": message,
      "accurate-timestamp": message.timestamp.isoformat(),
      "key": str(message.key())
     })
  return_object["timestamp"] = messages[0].timestamp.isoformat()
  return_object["value"] = messages_to_send
  deferred.defer(fetch_more_messages_reply, test_mode, user, return_object)

class DispatchNotificationActionPage(webapp2.RequestHandler):
 def get(self):
  secure(self)
  send_channel_message(
   self.request.get("test") == "1",
   self.request.get("from"),
   to_json(
    {
     "type": "dispatch",
     "value":
      {
       "action": self.request.get("action"),
       "evaluate": self.request.get("evaluate") or ""
      }
    }))

sender_email_pattern = re.compile("^(.*<|)([^>]+)(>*)")
email_receiver_pattern = re.compile("^.*to\\+([^@]+)@.*$")
invalid_email_receiver_pattern = re.compile("[^a-zA-Z-_]")
class ProcessMailPage(InboundMailHandler):
 def receive(self, message):
  sender = sender_email_pattern.sub("\\2", message.sender)
  recipient = email_receiver_pattern.sub("\\1", message.to)
  if invalid_email_receiver_pattern.match(recipient) or \
     not sender in user_details.users or not recipient in user_details.users:
   return
  user = user_details.users[sender]["internal-name"]
  recipient = user_details.users[recipient]["internal-name"]
  for content_type, body in message.bodies("text/plain"):
   sent = send_message(False, False, user, recipient, body.decode(), True)
   if not sent:
    send_email(sender, "Error!", "Sorry! The message was not sent.")
   else:
    send_email(sender, "Success!", "Sent.")
   break

def create_conversation_log(
 test_mode, user, timestamp, partner = None, detailed = False,
 include_plaintext = False, show_titles = False, ongoing = True,
 single = True):
 logging.info("Creating conversation log between " + user + " and " + partner)
 logging.info("Looking for conversations that started after " + timestamp.ctime())
 return_object = \
  {
   "log": None,
   "plaintext-log": None,
   "last-logged-message": None,
   "first-logged-message": None,
   "last-message": None
  }
 count = 200
 elements = []
 state = \
  {
   "last-timestamp": None,
   "last-sender": "Anonymous",
   "first": True,
   "conversation-ended": False
  }
 def gather_messages(messages):
  logging.info("Gathering messages")
  def is_ongoing(timestamp):
   return datetime.now() - timedelta(minutes = 60) < message_timestamp

  def add_conversation_title(first_timestamp):
   elements.append(
    {
     "conversation": get_user_readable_local_timestamp(first_timestamp)
    })

  i = 0
  if len(messages):
   logging.info("First gathered message has the timestamp of " + messages[0].timestamp.ctime());
  for message in messages:
   i = i + 1
   first = False
   # We only log messages with content.
   if not message.content:
    continue
   # Caching the message timestamp.
   message_timestamp = message.timestamp
   # Creating a dummy last timestamp value in order not to complicate
   # the logic later, in case this is the first logged message.
   if state["first"]:
    first = True
    # Detracting 4 minutes from the current timestamp in order to make
    # the logic show the name and the hour of the first message.
    state["last-timestamp"] = message_timestamp - timedelta(minutes = 4)
    # Remembering the timestamp of the first message.
    return_object["first-logged-message"] = message_timestamp
    # Resetting the first message flag.
    state["first"] = False
   # Resetting the delay, sender and element.
   delay = 0
   sender = None
   element = {}
   # Indicating that the conversation was cleanly ended,
   # if the message were sent an hour later than the previous one.
   if message_timestamp - timedelta(minutes = 60) > state["last-timestamp"]:
    if single:
     state["conversation-ended"] = True
     return False
    # Adding a conversation title before the first message of the next
    # conversation, if we should show titles.
    elif show_titles:
     add_conversation_title(message_timestamp)
   # Adding a conversation title before the first message,
   # if we should show titles.
   if first and show_titles:
    add_conversation_title(message_timestamp)

   # Bailing if this is an ongoing conversation (one of the messages were sent
   # within the last sixty minutes) and we do want to log such conversations.
   if not ongoing and is_ongoing(message_timestamp):
    return_object["last-message"] = message_timestamp
    return False
   # Showing a delay separator, if the previous message were sent
   # earlier than five minutes before the current message.
   if message_timestamp - timedelta(minutes = 5) > state["last-timestamp"]:
    # Showing the sender after such delay, no matter who it is.
    sender = message.sender
    # Calculating the duration of the delay.
    delay = int((message_timestamp - state["last-timestamp"]).seconds / 60)
    # Adding the delay element.
    elements.append({"delay": delay})
   # Showing the sender, if it differs from the last message.
   elif message.sender != state["last-sender"]:
    sender = message.sender
   # Setting an RTL flag, if the content starts with a Hebrew letter.
   if internationalization.is_right_to_left_content(message.content):
    element["rtl"] = True
   # Caching the local timestamp
   local_timestamp = time_util.convert_to_local_time(message_timestamp)
   # Adding the local timestamp as a @title.
   element["local_timestamp"] = get_user_readable_timestamp(local_timestamp)
   # Showing the hour next to the message, if the message
   # were sent earlier than a minute ago.
   if not (message_timestamp - timedelta(minutes = 1) < \
           state["last-timestamp"] and \
           state["last-timestamp"].minute == message_timestamp.minute):
    element["hour"] = local_timestamp.strftime("%H:%M")
   # Hiding the hour for same minute sent messages.
   else:
    element["hour"] = "&#160;"
   # Showing the sender nickname, or "me" if the sender is the target of
   # the log, or hiding it altogether if it is the same as the last one.
   element["sender_or_me"] = \
    user_details.get_sender_nickname_or_me(sender, user) if sender else None
   # Showing the content of the message.
   element["content"] = message.content
   # Adding the message element.
   elements.append(element)
   # Remembering the timestamp and sender of the message.
   state["last-timestamp"] = message_timestamp
   state["last-sender"] = message.sender
  # TODO - Consolidate this duplicate code...
  if not ongoing and is_ongoing(message_timestamp):
   return_object["last-message"] = message_timestamp
   return False
  
  return i == count

 more = True
 while more and not timestamp == state["last-timestamp"]:
  more = \
   gather_messages(
    db_util.fetch_messages_for_user(
     test_mode, user, count, timestamp, False, partner = partner,
     last_first = False))
  if state["last-timestamp"]:
   timestamp = state["last-timestamp"]
 if state["last-timestamp"]:
  logging.info("state.last-timestamp - " + state["last-timestamp"].ctime());
 logging.info("Done gathering. Gathered " + str(len(elements)) + " messages.")

 if not len(elements) or not state["last-timestamp"]:
  if detailed:
   return return_object
  else:
   return return_object["log"]

 partner_nickname = \
  user_details.users[partner]["nickname"] \
   if partner in user_details.users else partner
 rendered_log = \
  template.render(
   create_html_path("history-message.html"),
   {
    "elements": elements,
    "partner": partner_nickname
   })
 return_object["log"] = rendered_log
 if include_plaintext:
  rendered_plaintext_log = \
   template.render(
    create_html_path("plaintext-history-message.txt"),
    {
     "elements": elements,
     "partner": partner_nickname
    })
  return_object["plaintext-log"] = rendered_plaintext_log

 if detailed:
  return_object["last-logged-message"] = state["last-timestamp"]
  return return_object
 else:
  return return_object["log"]

class MessageHistoryPage(webapp2.RequestHandler):
 def get(self):
  secure(self)
  user = self.request.get("from")
  partner = self.request.get("to") or None
  test_mode = self.request.get("test") == "1"
  timestamp = parse_iso_timestamp(self.request.get("timestamp"))
  self.response.write(
  "<!doctype html><title>Message History</title>" +
  "<style>body{font:normal 13px arial;}</style>")
  self.response.write(
   create_conversation_log(
    test_mode, user, timestamp, partner = partner, single = False,
    show_titles = True))

email_username_pattern = re.compile("@.+$")
class SendConversationHistoryPage(webapp2.RequestHandler):
 def get(self):
  """ This will do something nice soon. """
  (data, history_data) = get_data("history-data", {})
  now = datetime.now()
  today = datetime(year = now.year, month = now.month, day = now.day)
  stop = False
  for user_obj in user_details.user_list:
   if stop:
    break
   for partner_obj in user_details.user_list:
    if partner_obj == user_obj:
     continue
    user = user_obj["internal-name"]
    partner = partner_obj["internal-name"]
    #logging.info(user + " " + partner)
    no_cache = \
     not user in history_data or not partner in history_data[user] or \
     history_data[user][partner]["last-logged-message"] == \
      timestamp_2000
    #logging.info("No cache? " + str(no_cache))
    #logging.info("user in history_data? " + str(user in history_data))
    #logging.info("partner in history_data[user]? " + str(user in history_data and partner in history_data[user]))
    #logging.info("last-logged is 2000? " + str(user in history_data and partner in history_data[user] and history_data[user][partner]["last-logged-message"] == timestamp_2000))
    #logging.info("last-logged is 2000? " + str(user in history_data and partner in history_data[user] and history_data[user][partner]["last-logged-message"]))
    history_data = get_set_history_data(data, user, partner)
    if no_cache:
     last_timestmap = \
      db_util.fetch_last_logged_message_timestamp(user, partner)
     if last_timestmap:
      history_data[user][partner]["last-logged-message"] = last_timestmap
     else:
      history_data[user][partner]["last-logged-message"] = timestamp_2001
      set_data(data)
    last_logged_message = history_data[user][partner]["last-logged-message"]
    last_sent_message = history_data[user][partner]["last-message"]
    previous_last_sent_message = \
     history_data[user][partner]["previous-last-message"]
    #logging.info(
    # "From cache, last-logged - " + str(last_logged_message) +
    # " last-sent - " + str(last_sent_message))
    if last_logged_message == last_sent_message:
     continue
    if last_sent_message > datetime.now() - timedelta(minutes = 60):
     continue
    if last_sent_message == previous_last_sent_message:
     continue
    #logging.info("Stayed within the loop.")
    log_object = \
     create_conversation_log(
      False, user, last_logged_message, partner = partner, detailed = True,
      include_plaintext = True)
    if log_object["log"]:
     #logging.info(
     # "user - " + user + " partner - " + partner + " len(log) - " +
     # str(len(log_object["log"])) + " first-logged-message - " +
     # str(log_object["first-logged-message"]) + "last-logged-message - " +
     # str(log_object["last-logged-message"]))
     partner_nickname = user_details.users[partner]["nickname"]
     email = mail.EmailMessage()
     email.to = user_details.users[user]["email-for-logs"]
     email.sender = \
      user_details.users[partner]["nickname"] + " <" + \
      email_username_pattern.sub("", user_details.users[partner]["email"]) + \
      "@messenger.appspotmail.com>"
     email.subject = \
      "Conversation with " + partner_nickname + " (" + \
       get_user_readable_local_timestamp(
        log_object["first-logged-message"]) + " - " + \
       get_user_readable_local_timestamp(
        log_object["last-logged-message"]) + ")"
     email.body = log_object["plaintext-log"]
     email.html = log_object["log"]
     email.send()
     if DEV_MODE:
      self.response.write("<pre>")
      self.response.write(log_object["plaintext-log"])
      self.response.write("</pre>")
      self.response.write(log_object["log"])
      
     db_util.save_message_log_entry(
      user, partner, log_object["first-logged-message"],
      log_object["last-logged-message"])
     history_data[user][partner]["last-logged-message"] = \
      log_object["last-logged-message"]
     set_data(data)
     stop = True
     break
    else:
     history_data[user][partner]["previous-last-message"] = \
      history_data[user][partner]["last-message"]
     set_data(data)

class StaticFormPage(webapp2.RequestHandler):
 def get(self):
  self.response.headers["Content-Disposition"] = \
   "attachment; filename=form.html"
  variables = {}
  variables["action"] = SEND_MESSAGE_URL;
  variables["from"] = self.request.get("from")
  variables["to"] = self.request.get("to")
  write(self, "static-form.html", variables)

class ReportPage(webapp2.RequestHandler):
 def post(self):
  test_mode = self.request.get("test") == "1"
  type = self.request.get("type")
  value = self.request.get("value")
  db_util.add_report(test_mode, type, value)

class PrintMemcachePage(webapp2.RequestHandler):
 def get(self):
  self.response.headers["Content-Type"] = "text/plain; charset=utf-8"
  self.response.write(to_json(memcache.get("application-data") or {}, indent = True))

class HandleXMPPPresence(webapp2.RequestHandler):
 def post(self):
  pass
 def get(self):
  pass

#def main():
handler = webapp2.WSGIApplication(
 [
  ("/converse", ConversePage),
  ("/sign-out", SignOutPage),
  (SEND_MESSAGE_PATH, SendMessagePage),
  ("/reclaim-channel-token", ReclaimChannelTokenPage),
  ("/remove-message", RemoveMessagePage),
  ("/_ah/xmpp/message/chat/", HandleIncomingXMPPStanzas),
  ("/_ah/xmpp/presence/available/", HandleXMPPPresence),
  ("/_ah/xmpp/presence/unavailable/", HandleXMPPPresence),
  ("/_ah/xmpp/subscription/subscribe/", HandleXMPPPresence),
  ("/_ah/xmpp/subscription/subscribed/", HandleXMPPPresence),
  ("/_ah/xmpp/subscription/unsubscribe/", HandleXMPPPresence),
  ("/_ah/xmpp/subscription/unsubscribed/", HandleXMPPPresence),
  ("/_ah/xmpp/presence/probe/", HandleXMPPPresence),
  ("/_ah/channel/connected/", HandleChannelConnections),
  ("/_ah/channel/disconnected/", HandleChannelDisconnections),
  ("/dispatch-notification-action", DispatchNotificationActionPage),
  ("/update-presence-data", UpdatePresenceDataPage),
  ("/fetch-more-messages", FetchMoreMessagesPage),
  ("/show-message-history", MessageHistoryPage),
  ("/send-conversation-history", SendConversationHistoryPage),
  ("/import-now", ImportMessageHistory),
  ("/print-memcache", PrintMemcachePage),
  ("/static-form", StaticFormPage),
  ("/report", ReportPage),
  ProcessMailPage.mapping()
 ],
 debug = DEV_MODE)
 #util.run_wsgi_app(handler)

#if __name__ == "__main__":
# main()