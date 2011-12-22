import re

first_hebrew_letter_code = 1488
first_hebrew_letter = unichr(first_hebrew_letter_code)
last_hebrew_letter_code = 1514
last_hebrew_letter = unichr(last_hebrew_letter_code)
letter_pattern = \
 re.compile(
  "^[^a-zA-Z" + first_hebrew_letter + "-" + last_hebrew_letter + "]+")

def is_right_to_left_content(content):
 first_character = \
  letter_pattern.sub("", content)
 if len(first_character):
  first_character = ord(first_character[0])
  return first_character >= first_hebrew_letter_code and \
         first_character <= last_hebrew_letter_code
 else:
  return False