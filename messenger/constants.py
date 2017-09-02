import os, sys
from datetime import datetime

JID_HOST_NAME = 'appspot.com'
HOST_NAME = 'messenger.appspot.com'
APPLICATION_ID = 'messenger'
APPLICATION_EMAIL_DOMAIN = "%s.appspotmail.com" % APPLICATION_ID
APPLICATION_VERSION = os.environ.get('CURRENT_VERSION_ID');
TEST_MODE_CHANNEL_PREFIX = "____test_mode____"
IS_PRIVATE_MESSENGER = True
APPLICATION_NAME = 'Messenger'
PRIVATE_APPLICATION_NAME = 'Blank'
DEV_MODE = False
DEV_HOST_NAME = 'localhost:8080'
USER_LIST = \
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

try:
 from configuration \
  import CUSTOM_JID_HOST_NAME, CUSTOM_APPLICATION_EMAIL_DOMAIN, \
         CUSTOM_APPLICATION_ID, CUSTOM_APPLICATION_VERSION, \
         CUSTOM_HOST_NAME, CUSTOM_TEST_MODE_CHANNEL_PREFIX, \
         CUSTOM_DEV_MODE, CUSTOM_PRIVATE_APPLICATION_NAME, \
         CUSTOM_APPLICATION_NAME, CUSTOM_IS_PRIVATE_MESSENGER, \
         CUSTOM_USER_LIST
 JID_HOST_NAME = CUSTOM_JID_HOST_NAME or JID_HOST_NAME
 HOST_NAME = CUSTOM_HOST_NAME or HOST_NAME
 APPLICATION_ID = CUSTOM_APPLICATION_ID or APPLICATION_ID
 APPLICATION_EMAIL_DOMAIN = \
  CUSTOM_APPLICATION_EMAIL_DOMAIN or APPLICATION_EMAIL_DOMAIN
 APPLICATION_VERSION = \
  CUSTOM_APPLICATION_VERSION or APPLICATION_VERSION
 TEST_MODE_CHANNEL_PREFIX = \
  CUSTOM_TEST_MODE_CHANNEL_PREFIX or TEST_MODE_CHANNEL_PREFIX
 IS_PRIVATE_MESSENGER = \
  CUSTOM_IS_PRIVATE_MESSENGER or IS_PRIVATE_MESSENGER
 DEV_MODE = CUSTOM_DEV_MODE or DEV_MODE
 APPLICATION_NAME = \
  CUSTOM_APPLICATION_NAME or APPLICATION_NAME
 PRIVATE_APPLICATION_NAME = \
  CUSTOM_PRIVATE_APPLICATION_NAME or PRIVATE_APPLICATION_NAME
 USER_LIST = CUSTOM_USER_LIST or USER_LIST
except Exception as e:
 import logging
 if DEV_MODE:
  import traceback
  logging.error(e)
  logging.error(traceback.format_exc())
 import logging
 logging.info('No custom configuration defined, or there was an error loading it.')

APPLICATION_NAME = PRIVATE_APPLICATION_NAME if IS_PRIVATE_MESSENGER else APPLICATION_NAME
if DEV_MODE or os.environ.get('SERVER_SOFTWARE').startswith('Devel'):
 DEV_MODE = True
 HOST_NAME = DEV_HOST_NAME
 APPLICATION_VERSION = "dev%s" % str(datetime.now())
 APPLICATION_NAME = "Dev%s" % APPLICATION_NAME

CHANNEL_DURATION = 900
APPLICATION_JID = "%s@%s" % (APPLICATION_ID, JID_HOST_NAME)
NO_REPLY_EMAIL = "no-reply@%s" % APPLICATION_EMAIL_DOMAIN
APPLICATION_EMAIL_SENDER = "%s <%s>" % (APPLICATION_NAME, NO_REPLY_EMAIL)
