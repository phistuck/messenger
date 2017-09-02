#!/usr/bin/python
import httplib, urllib, sys, os, subprocess

dir_path = os.path.abspath(os.path.dirname(os.path.realpath(__file__)))

def finish():
 print "Go on and upload."

def send_to_closure_compiler_service(scripts_path, externs_path, code):
 externs_file = open(externs_path)
 externs = externs_file.read().decode('utf-8') #template.render(dir_path + "%s..%sscripts%sexterns.js" % (os.sep, os.sep, os.sep), {})
 externs_file.close()

 code = \
  code.replace(
   "var MAIN_DEBUG = true;",
   "var MAIN_DEBUG = false;")

 params = urllib.urlencode(
   [
     ("js_externs", externs),
     ("output_wrapper", "(function() {%output%})();"),
     ("js_code", code.encode('utf-8')),
     ("compilation_level", "ADVANCED_OPTIMIZATIONS"),
     ("output_format", "text"),
     ("output_info", "compiled_code"),
   ])
 print params

 headers = {"Content-type": "application/x-www-form-urlencoded"}
 print "Sending the JavaScript code to the Closure Compiler service."
 conn = httplib.HTTPConnection("closure-compiler.appspot.com")
 conn.request("POST", "/compile", params, headers)
 response = conn.getresponse()
 print "Opening the output file (*.min.js)."
 output = open(scripts_path + "converse.min.js", "w+")
 print "Writing the minified JavaScript file."
 output.write(response.read())
 print "Cleaning up."
 output.close()
 conn.close

should_minify = False

scripts_path = dir_path + "%s..%sscripts%s" % (os.sep, os.sep, os.sep)
scripts_source_path = dir_path + "%s..%sscripts_source%s" % (os.sep, os.sep, os.sep)
generated_path = dir_path + "%sgenerated%s" % (os.sep, os.sep)

compiler_path = dir_path + os.sep + 'compiler.jar'
converse_script_path = scripts_source_path + 'converse.js'
previous_converse_script_path = generated_path + 'converse.previous.js'
processed_converse_script_path = generated_path + 'converse.processed.js'
minified_script_path = scripts_path + 'converse.min.js'
source_map_file_name = 'converse.map.js'
source_map_path = scripts_path + source_map_file_name
previous_externs_path = generated_path + 'externs.previous.js'
externs_path = scripts_source_path + 'externs.js'
previous_flags_path = generated_path + 'compiler.previous.flags'
flags_path = generated_path + 'compiler.flags'
output_wrapper_path = generated_path + 'output-wrapper.js'

# Checking if the cache is dirty.
converse_script = open(converse_script_path, "r")
converse_script_content = converse_script.read().decode('utf-8')
converse_script.close()

# https://stackoverflow.com/questions/273192/how-can-i-create-a-directory-if-it-does-not-exist
import os, errno
try:
 os.makedirs(generated_path)
except OSError as e:
 if e.errno != errno.EEXIST:
  raise

import os, errno
try:
 os.makedirs(scripts_source_path)
except OSError as e:
 if e.errno != errno.EEXIST:
  raise

flags = \
'''--warning_level VERBOSE
--compilation_level ADVANCED_OPTIMIZATIONS
--define MAIN_DEBUG=false
--js %s
--js_output_file %s
--output_wrapper_file %s
--externs %s
--create_source_map %s
--source_map_include_content''' % \
(processed_converse_script_path, minified_script_path, \
 output_wrapper_path, externs_path, source_map_path)

try:
 previous_converse_script = open(previous_converse_script_path, "r")
 if previous_converse_script:
  should_minify = converse_script_content != previous_converse_script.read().decode('utf-8')
 previous_converse_script.close()
 if not should_minify:
  externs_file = open(externs_path, "r")
  previous_externs = open(previous_externs_path, "r")
  if externs_file and previous_externs:
   should_minify = externs_file.read().decode('utf-8') != previous_externs.read().decode('utf-8')
  externs_file.close()
  previous_externs.close()
  
 if not should_minify:
  previous_flags_file = open(previous_flags_path)
  if previous_flags_file:
   should_minify = flags != previous_flags_file.read().decode('utf-8')
  previous_flags_file.close()

except:
 print "Could not find the previous files to compare, assuming compilation is necessary anyway."
 should_minify = True

if not should_minify:
 print "Nothing to minify, all is done!"
 finish()
 exit()

print "Compiling..."

code = converse_script_content #template.render(converse_script_path, {})
code = code.replace("main.$.log", "if (MAIN_DEBUG) main.$.log")
code = code.replace("if (MAIN_DEBUG) main.$.log =", "main.$.log =")
code = code.replace("console.log", "if (MAIN_DEBUG) console.log")

processed_converse_file = open(processed_converse_script_path, 'w+')
processed_converse_file.write(code.encode('utf-8'))
processed_converse_file.close()

flags_file = open(flags_path, 'w+')
flags_file.write(flags.encode('utf-8'))
flags_file.close()
 
output_wrapper = \
 """(function() {%%output%%})();
//@ sourceMappingURL=%s""" % source_map_file_name
output_wrapper_file = open(output_wrapper_path, "w+")
output_wrapper_file.write(output_wrapper)
output_wrapper_file.close()

from distutils.spawn import find_executable
if not find_executable('java') and not find_executable('java.exe'):
 print "Java seems to be missing (java or java.exe in PATH)."

if not os.path.exists("%s%scompiler.jar" % (dir_path, os.sep)):
 print "Closure Compiler is missing (compiler.jar under the current directory)."

subprocess.check_call( \
 ['java',
  '-jar',
  compiler_path,
  '--flagfile',
  flags_path])

if 0:
 send_to_closure_compiler_service(scripts_path, externs_path, code)

print "Caching the current state."
previous_converse_script = open(previous_converse_script_path, "w+")
previous_converse_script.write(converse_script_content.encode('utf-8'))
previous_converse_script.close()

previous_externs = open(previous_externs_path, "w+")
previous_externs.write(open(externs_path).read().decode('utf-8').encode('utf-8'))
previous_externs.close()

previous_flags = open(previous_flags_path, "w+")
previous_flags.write(flags.encode('utf-8'))
previous_flags.close()
print "All is done!"
finish()