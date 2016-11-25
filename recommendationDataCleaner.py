from pymongo import MongoClient
from collections import Counter

connection = MongoClient('localhost', 27017)
db = connection['test_project']

#find all unique users.
#topicDictionaryCounter = 1
#topicDictionary = {}

data = {}
hash_conversion = {}

users = db.posts.distinct("@Id")
print users
count = 0

for user in users:
    count = count + 1
    answer = db.posts.find({"@OwnerUserId": str(user)})
    topics = []
    for a in answer:
        if '@Tags' in a:
            localTopics = a['@Tags']
            localTopics = localTopics.replace('<', '')
            localTopics = localTopics.replace('>', ' ')
            topics = topics + localTopics.split(" ")

    counts = Counter(topics)
    count_hash = {}
    #print type(counts)
    for count_temp in counts:
        if count_temp != "":
            count_hash[hash(count_temp)] = counts[count_temp]
            hash_conversion[hash(count_temp)] = count_temp
    data[user] = count_hash
    if count == 10:
        break
    print "user data", user, "\n",data[user]
from scikits.crab.models import MatrixPreferenceDataModel
from scikits.crab.recommenders.knn import UserBasedRecommender
from scikits.crab.metrics import pearson_correlation
from scikits.crab.similarities import UserSimilarity


model = MatrixPreferenceDataModel(data)
similarity = UserSimilarity(model, pearson_correlation)
recommender = UserBasedRecommender(model, similarity, with_preference=True)
print "going to print"
recommended_hash =  recommender.recommend('5')
print recommended_hash
for key,value in recommended_hash:
    print hash_conversion[key], "is ", value
print "done"
connection.close()