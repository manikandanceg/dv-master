from pymongo import MongoClient
from datetime import datetime

connection = MongoClient('localhost', 27017)
db = connection['test_project']

cursor = db.posts.find()

epoch = datetime.utcfromtimestamp(0)
def unix_time_millis(dt):
    return (dt - epoch).total_seconds() * 1000.0

db.drop_collection("posts_new")
db.create_collection("posts_new")
i = 0
for post in cursor:
    i+=1
    t = post['@CreationDate']
    dateobj = datetime.strptime(t, "%Y-%m-%dT%H:%M:%S.%f")
    post['@CreationDate']=unix_time_millis(dateobj)
    db.posts_new.insert(post)
    print i