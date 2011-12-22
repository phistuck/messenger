import httplib, urllib, sys, os
DIR_PATH = os.path.abspath(os.path.dirname(os.path.realpath(__file__)))
sys.path = sys.path + [r"lib",
                       r"lib\webob", r"lib\django_0_96"]
from google.appengine.ext.webapp import template

converse_script_path = DIR_PATH + r"\..\scripts\converse.js"
previous_converse_script_path = DIR_PATH + r"\..\scripts\converse.previous.js"
minified_script_path = DIR_PATH + r"\..\scripts\converse.min.js"
converse_script = open(converse_script_path, "r")
converse_script_content = converse_script.read()
converse_script.close()
previous_converse_script = open(previous_converse_script_path, "r")
should_minify = True
if previous_converse_script:
 should_minify = not converse_script_content == previous_converse_script.read()
previous_converse_script.close()
if should_minify:
 
 previous_converse_script = open(previous_converse_script_path, "wb")
 previous_converse_script.write(converse_script_content)
 previous_converse_script.close()
 code = template.render(converse_script_path, {})
 externs = template.render(DIR_PATH + r"\..\scripts\externs.js", {})

 params = urllib.urlencode(
   [
     ("js_externs", externs),
     ("output_wrapper", "(function() {%output%})();"),
     ("js_code", code),
     ("compilation_level", "ADVANCED_OPTIMIZATIONS"),
     ("output_format", "text"),
     ("output_info", "compiled_code"),
   ])

 headers = {"Content-type": "application/x-www-form-urlencoded"}
 print "Sending the JavaScript code to the Closure Compiler service."
 conn = httplib.HTTPConnection("closure-compiler.appspot.com")
 conn.request("POST", "/compile", params, headers)
 response = conn.getresponse()
 print "Opening the output file (*.min.js)"
 output = open(DIR_PATH + r"\..\scripts\converse.min.js","wb")
 print "Writing the minified JavaScript file."
 output.write(response.read())
 print "Cleaning up"
 output.close()
 conn.close
 print "Yay! Go on and upload."
else:
 print "Nothing to minify!"