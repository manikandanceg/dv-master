from pymongo import MongoClient
from datetime import datetime

connection = MongoClient('localhost', 27017)
db = connection['test_project']

db.drop_collection("question_time_mapping")
db.create_collection("question_time_mapping")

maxTime = db.posts_new.find({'$query':{},'$orderby':{'@CreationDate':-1}}).limit(1).next()['@CreationDate']

minTime = db.posts_new.find({'$query':{},'$orderby':{'@CreationDate':1}}).limit(1).next()['@CreationDate']


cursor = db.posts_new.find()
diff = float(maxTime) - float(minTime)

i = 0
for post in cursor:
    i+=1
    qId = post["@Id"]
    dateFactor = (float(post["@CreationDate"]) - float(minTime)) / diff
    itemToInsert = {}
    itemToInsert['qId'] = qId
    itemToInsert['timeFactor'] = dateFactor
    db.question_time_mapping.insert(itemToInsert)
    #print i
    print dateFactor