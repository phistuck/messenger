from google.appengine.ext import db

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

def fetch_last_logged_message_timestamp(user, partner):
 #import logging
 #logging.info("(OH YEAH!) Fetching from the datastore.")
 results = MessageArchiveDatabase.all()
 results.filter("user =", user)
 results.filter("partner =", partner)
 results.order("-last_message_timestamp")
 fetched_results = results.fetch(1)
 if len(fetched_results):
  #logging.info(fetched_results[0].last_message_timestamp)
  return fetched_results[0].last_message_timestamp
 return None

def save_message_log_entry(
 user, partner, first_logged_message, last_logged_message):
 entry = MessageArchiveDatabase()
 entry.user = user
 entry.partner = partner
 entry.first_message_timestamp = first_logged_message
 entry.last_message_timestamp = last_logged_message
 entry.put()

def save_message(test_mode, sender, recipient, content, notify, timestamp = None):
 message = \
  create_message(
   test_mode, sender = sender, recipient = recipient, content = content,
   notify = notify, timestamp = timestamp)
 while True:
  delay = 100
  try:
   message.put()
   break
  except db.Timeout:
   if message.is_saved():
    break
   thread.sleep(delay)
   delay *= 2
 if not message.is_saved():
  raise db.NotSavedError
 return message;

def remove_message(test_mode, key):
 if test_mode:
  message = MessageDatabaseTest.get(key)
 else:
  message = MessageDatabase.get(key)
 if message:
  message.delete()

def create_message(
 test_mode, sender = None, recipient = None, content = None, timestamp = None,
 notify = False):
 if test_mode:
  message = MessageDatabaseTest()
 else:
  message = MessageDatabase()
 message.sender = sender
 message.recipient = recipient
 message.content = content
 message.notify = notify or False
 if timestamp:
  message.timestamp = timestamp
 return message

def fetch_messages(
 test_mode, user, count, sent, timestamp, earlier, partner = None):
 if test_mode:
  results = MessageDatabaseTest.all()
 else:
  results = MessageDatabase.all()
 if timestamp:
  if earlier:
   results.filter("timestamp <", timestamp)
  else:
   results.filter("timestamp >", timestamp)
 if sent:
  results.filter("sender =", user)
  if partner:
   results.filter("recipient =", partner)
 else:
  results.filter("recipient =", user)
  if partner:
   results.filter("sender =", partner)  
 if not timestamp or earlier:
  results.order("-timestamp")
 else:
  results.order("timestamp")
 return results.fetch(count)
 
def fetch_messages_for_user(
 test_mode, user, count, timestamp, earlier, last_first = True, partner = None):
 messages = \
  fetch_messages(
   test_mode, user, count, True, timestamp, earlier, partner = partner)
 messages.extend(
  fetch_messages(
   test_mode, user, count, False, timestamp, earlier, partner = partner))
 if not len(messages):
  return []
 messages.sort(lambda a, b: a.timestamp > b.timestamp or -1)
 result_count = len(messages)
 if result_count > count:
  if not earlier and not last_first:
   messages = messages[0:count]
  else:
   messages = messages[result_count - count:result_count]
 return messages
 
def add_report(test_mode, type, value):
 if test_mode:
  report = ReportingDatabaseTest()
 else:
  report = ReportingDatabase()
 report.type = type
 report.value = value
 report.put()