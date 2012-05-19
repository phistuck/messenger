from __future__ import with_statement
from messenger import db_util
from google.appengine.api import memcache, urlfetch
import webapp2, json, logging

DEV_MODE = False

def get_data(name, initial_value, data = None):
 if not data:
  data = memcache.get("application-data") or {}
 if not name in data:
  data[name] = initial_value
 return (data, data[name])

def set_data(data):
 memcache.set("application-data", data)

def to_json(data, indent = DEV_MODE):
 return json.dumps(data, cls = CustomJSONEncoder, indent = indent)

def from_json(json_string):
 return json.loads(json_string)

def store_attachment(name, body, content = None, content_type = None):
 from google.appengine.api import files
 import re
 extension = re.sub(name, "^.+\\.([^\\.]+)", "\\1", name)
 if not content_type:
  if name.search(".jpg"):
   content_type = "image/jpeg"
  elif name.search(".gif"):
   content_type = "image/gif"
  elif name.search(".png"):
   content_type = "image/png"
  elif name.search(".mp3"):
   content_type = "audio/mpeg"
  elif name.search(".wav"):
   content_type = "audio/wav"
  elif name.search(".mp4"):
   content_type = "video/mp4"
  elif name.search(".flv"):
   content_type = "video/x-flv"
  elif name.search(".pdf"):
   content_type = "application/pdf"
  elif name.search(".txt"):
   content_type = "text/plain"
  else:
   content_type = "application/octet-stream"
 if not content:
  if "encoding" in body:
   content = body.decode()
  else:
   content = body.read()

 file_name = files.blobstore.create(mime_type=content_type)
 datastr = str(contents.decode())
 
 with files.open(file_name, 'a') as f:
   f.write(datastr[0:65536])
   datastr = datastr[65536:]
   while len(datastr) > 0:
     f.write(datastr[0:65536])
     datastr = datastr[65536:]
 with files.open(file_name, "a") as attachment:
  attachment.write(content)
 files.finalize(file_name)
 blob_key = files.blobstore.get_blob_key(file_name)
 file_entry = db_util.FileDatabase()
 file_entry.blob_key = str(blob_key)
 file_entry.document_key = ""
 file_entry.content_length = len(content)
 file_entry.content_name = name
 file_entry.content_type = content_type
 file_entry.last_uploaded_offset = 0
 file_entry.complete = False
 file_entry.put()

PACKET_LENGTH = 512 * 1024
 
class UploadPage(webapp2.RequestHandler):
 def get(self):
  self.response.write("""
  <!doctype html>
  <form method=post action=upload enctype=multipart/form-data><input type=file name="crap"/><input type="submit"/></form>
  """)
 def post(self):
  field = self.request.POST["crap"]
  logging.info(field.name)
  logging.info(field.filename)
  logging.info(field.type)
  store_attachment(field.filename, None, content_type = field.type, content = field.value)
def bla(self):
  user = "foo"
  (data, tokens) = get_data("tokens", {})
  if not user in tokens:
   return
  import gdata.docs.data
  import gdata.docs.client
  headers = \
   {
    "GData-Version": "3.0",
    "Authorization": "AuthSub token=\"%s\"" % tokens[user]
   }
  data = from_json(urlfetch.fetch("https://docs.google.com/feeds/default/private/full?alt=json", headers=headers).content)
  for link in data["feed"]["link"]:
   if link["rel"] == "http://schemas.google.com/g/2005#resumable-create-media":
    create_url = link["href"]
  body = \
   """<?xml version="1.0" encoding="UTF-8"?>
       <entry xmlns="http://www.w3.org/2005/Atom" xmlns:docs="http://schemas.google.com/docs/2007">
        <title>Legal Contract</title>
       </entry>"""
  headers = \
   {
    "X-Upload-Content-Type": "audio/mpeg",
    "X-Upload-Content-Length": 256879,
    "Authorization": "AuthSub token=\"%s\"" % tokens[user],
    "GData-Version": "3.0"
   }
  a = urlfetch.fetch(create_url, method = "POST", headers = headers, deadline = 1000)
  if not a.status_code == 200:
   return
  upload_url = a.headers["Location"].replace("https://", "http://")

  f = open("file.mp3", "rb").read()
  b = urlfetch.fetch(upload_url, method="PUT", headers = {"Content-Type": "audio/mpeg"}, payload = f, deadline = 1000)

def bla_continue():
 logging.info("fetched")
 logging.info(a.status_code)
 logging.info(a.headers)
 logging.info(a.content)
 if not a.status_code == 200:
  return
 upload_url = a.headers["Location"].replace("https://", "http://")
  
 f = open("file.mp3", "rb").read()
 logging.info("sending")
 b = urlfetch.fetch(upload_url, method="PUT", headers = {"Content-Type": "audio/mpeg"}, payload = f, deadline = 1000)
 logging.info(b.status_code)
 logging.info(b.headers)
 logging.info(b.content)
  
 #import multipart_related
 #multipart_related.upload("docs.google.com", upload_url)


 client = gdata.docs.client.DocsClient(source = "messenger")
 client.ssl = True  # Force all API requests through HTTPS
 client.http_client.debug = False  # Set to True for debugging HTTP requests
 client.auth_token = gdata.gauth.AuthSubToken(tokens[user])
 media = gdata.data.MediaSource(self.request.get("crap"), "audio/mp3")
 #self.response.write(client.GetResources())
 avatar = self.request.get("crap")
 #import logging
 #logging.info(avatar)
 #client.CreateResource(gdata.docs.data.Resource(), media = media)
 #help(gdata.docs.client.DocsClient.CreateResource)#(media = media, )

def upload_to_google_docs(sender, attachments):
 #client.auth_token = gdata.oauth.OAuthToken(TOKEN_STR, TOKEN_SECRET)
 pass
 #for (name, content) in attachments:
 # gdata.client
  
def authorize(self):
 import gdata.gauth
 get_session_token_url = "https://www.google.com/accounts/AuthSubSessionToken"
 headers = \
  {
   "Authorization": "AuthSub token=\"%s\"" % self.request.get("token")
  }
 response = urlfetch.fetch(get_session_token_url, headers = headers)
 token = gdata.gauth.auth_sub_string_from_body(response.content)
 (data, tokens) = get_data("tokens", {})
 tokens[self.request.get("from")] = token
 set_data(data)
 self.response.write("""
 <!doctype html>
 <form action=upload method=post enctype=multipart/form-data><input type=file name=crap/><input type="submit"/></form>
 """)


class AuthorizePage(webapp2.RequestHandler):
 def post(self):
  authorize(self)
 def get(self):
  authorize(self)

class GetAuthorizationTokenPage(webapp2.RequestHandler):
 def get(self):
  import gdata.gauth
  def GetAuthSubUrl():
   next = "http://" + HOST_NAME + "/authorize?from=foo"
   scopes = ["http://docs.google.com/feeds/", "https://docs.google.com/feeds/"]
   secure = False
   session = True
   return gdata.gauth.generate_auth_sub_url(next, scopes, secure=secure, session=session)
  self.response.write('<a href="%s">Login to your Google account</a>' % GetAuthSubUrl())