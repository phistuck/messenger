import user_details#, logging

def has_session(request):
 if user_details.is_android_or_windows(request.headers):
  #logging.info("Android or windows")
  return "authenticated" in request.cookies and \
         request.cookies["authenticated"] == "1"
 else:
  #logging.info("Has session")
  return True

def is_authenticated(self, DEV_MODE):
 response = self.response
 request = self.request
 request_headers = request.headers
 def deny_access():
  response.headers["WWW-Authenticate"] = "Basic realm=LogIn"
  response.set_status(401)
 #if DEV_MODE and "Nokia" in request_headers["user-agent"]:
 # return True
 #if not "Authorization" in request_headers:
  #logging.info("\n\n\n")
  #headerss = "\n"
  #for header in request_headers:
  # headerss += header + " - " + request_headers[header] + "\n"
  #logging.info("No authorization... " + headerss + "\n" + request.body)
  
 # In order to authenticate in the fake mode,
 # use the very secretive username "s" and no password
 # When asked again, use the very secretive username "u" and no password.
 if "Authorization" in request_headers:
  if has_session(request) and request_headers["Authorization"] == "Basic dTo=":
   return True
  elif request_headers["Authorization"] == "Basic czo=":
   response.headers["Set-Cookie"] = "authenticated=1; Max-Age=30;"
 deny_access()
 return False