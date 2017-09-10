# Messenger
An unreliable web based instant messaging application.

## Usage
On Google Cloud Shell or Linux (or macOS perhaps, I did not test) with the Google App Engine SDK installed -
```shell
build_scripts/serve.sh
```
Or, on any platform with the Google App Engine SDK installed -
```batch
python dev_appserver.py .
```

And then go to `localhost:8080/redirect-to-converse`. You can use `foo` or `baz` as the user name and be sure to read the comment in `messenger/authentication.py` first (alternatively, set IS_PRIVATE_MESSENGER to False in `messenger/constants.py` or in your `messenger/configuration.py` - see the Customization Options section below).

## History
It was built due to the huge disappointment I had with Google Talk/GMail Chat/any other name Google picked at the time, because Google Talk was not reliable - I missed messages that were sent to me, others missed messages I sent to them and sometimes messages did not even reach the server and the sender was not notified about that fact.

It was supposed to be reliable and robust against transport issues, without false positives.

However, due to the multiple process/threads nature of Python 2.7 Google App Engine and the fundamental inability of the current code to lock the storage space, it did lose messages.

Still, it was a learning experience in Python.

Note - the JavaScript was already written before the Python version. It used to be a classic ASP messenger.

## Customization Options
You can create `messenger/configuration.py` with the following content in order to customize it -
```python
import os
CUSTOM_JID_HOST_NAME = 'appspot.com'
CUSTOM_HOST_NAME = 'messenger.appspot.com'
CUSTOM_DEV_HOST_NAME = 'localhost:8080'
CUSTOM_APPLICATION_ID = 'messenger'
CUSTOM_APPLICATION_EMAIL_DOMAIN = "%s.appspotmail.com" % CUSTOM_APPLICATION_ID
CUSTOM_APPLICATION_VERSION = os.environ.get('CURRENT_VERSION_ID');
CUSTOM_TEST_MODE_CHANNEL_PREFIX = '____test_mode____'
CUSTOM_IS_PRIVATE_MESSENGER = False
CUSTOM_DEV_MODE = True
CUSTOM_APPLICATION_NAME = 'Messenger'
CUSTOM_PRIVATE_APPLICATION_NAME = 'Blank'
CUSTOM_USER_LIST = None
```

## Security
The client and the server are not secure (other than HTTPS).
While SQL injection are probably not possible (simply because SQL is not used), you can absolutely inject scripts into messages and any HTML is accepted.

## License
### Code
MIT. Enjoy.
### Resources
Creative Commons 0. Enjoy.
### MP3 Player
```
Copyright (c) 2009 jwplayer.com

License -
Attribution-NonCommercial-ShareAlike 2.0 Generic (CC BY-NC-SA 2.0)
http://creativecommons.org/licenses/by-nc-sa/2.0/
```
