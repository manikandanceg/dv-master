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
count = 0

usersToIgnore = []

for user in users:
    count = count  + 1
    answer = db.posts.find({"@OwnerUserId": str(user)})
    topics = []
    for a in answer:
        if '@Tags' in a:
            localTopics = a['@Tags']
            localTopics = localTopics.replace('<', '')
            localTopics = localTopics.replace('>', ' ')
            topics = topics + localTopics.split(" ")

    #After collecting tags, check if the topic count for user is 0
    #In that case, add him to ignore list and continue
    if len(topics) == 0:
        usersToIgnore.append(str(user))
        continue

    counts = Counter(topics)
    count_hash = {}

    for count_temp in counts:
        if count_temp != "":
            count_hash[hash(count_temp)] = counts[count_temp]
            hash_conversion[hash(count_temp)] = count_temp
    data[user] = count_hash

    if count == 1000:
        break


from scikits.crab.models import MatrixPreferenceDataModel
from scikits.crab.recommenders.knn import UserBasedRecommender
from scikits.crab.metrics import pearson_correlation
from scikits.crab.similarities import UserSimilarity


model = MatrixPreferenceDataModel(data)
similarity = UserSimilarity(model, pearson_correlation)
recommender = UserBasedRecommender(model, similarity, with_preference=True)
print "going to print"

db.drop_collection("topic_recommendations")
db.create_collection("topic_recommendations")

for user in users:
    if user not in usersToIgnore:
        print str(user)
        recommended_hash =  recommender.recommend(str(user))

        if len(recommended_hash) == 0:
            continue

        itemToinsert = {}
        recommendations = {}
        print recommended_hash
        for key,value in recommended_hash:
            print hash_conversion[key], "is ", value
            recommendations[hash_conversion[key]] = value

        itemToinsert['userId'] = user
        itemToinsert['recommendations'] = recommendations
        db.topic_recommendations.insert(itemToinsert)
        print "done"

connection.close()