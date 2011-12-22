from datetime import datetime, timedelta

def timestamp_hour_delta(timestamp):
 if (timestamp > datetime(day = 5, month = 10, year = 2008, hour = 1, minute = 59, second = 59) and \
     timestamp < datetime(day = 27, month = 3, year = 2009, hour = 1, minute = 59, second = 59)) or \
    (timestamp > datetime(day = 27, month = 9, year = 2009, hour = 1, minute = 59, second = 59) and \
     timestamp < datetime(day = 26, month = 3, year = 2010, hour = 1, minute = 59, second = 59)) or \
    (timestamp > datetime(day = 12, month = 9, year = 2010, hour = 1, minute = 59, second = 59) and \
     timestamp < datetime(day = 1, month = 4, year = 2011, hour = 1, minute = 59, second = 59)) or \
    (timestamp > datetime(day = 2, month = 10, year = 2011, hour = 1, minute = 59, second = 59) and \
     timestamp < datetime(day = 30, month = 3, year = 2012, hour = 1, minute = 59, second = 59)) or \
    (timestamp > datetime(day = 22, month = 9, year = 2012, hour = 1, minute = 59, second = 59) and \
     timestamp < datetime(day = 29, month = 3, year = 2013, hour = 1, minute = 59, second = 59)) or \
    (timestamp > datetime(day = 7, month = 9, year = 2013, hour = 1, minute = 59, second = 59) and \
     timestamp < datetime(day = 28, month = 3, year = 2014, hour = 1, minute = 59, second = 59)) or \
    (timestamp > datetime(day = 27, month = 9, year = 2014, hour = 1, minute = 59, second = 59) and \
     timestamp < datetime(day = 27, month = 3, year = 2015, hour = 1, minute = 59, second = 59)):
  return 2
 else:
  return 3

def hour_delta():
 return timestamp_hour_delta(datetime.today())

def convert_to_local_time(time):
  return time + timedelta(hours=timestamp_hour_delta(time))

def get_local_time():
  return convert_to_local_time(datetime.today())
