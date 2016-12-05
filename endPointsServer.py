from flask import Flask, json
import middleWare
from collections import Counter
import random
from flask import request

app = Flask(__name__, static_url_path='')
from pymongo import MongoClient

@app.route("/")
def hello():
    return app.send_static_file('index.html')



@app.route('/users/rTopics/<int:user_id>')    #int has been used as a filter that only integer will be passed in the url otherwise it will give a 404 error
def find_recommendations(user_id):
    connection = MongoClient('localhost', 27017)
    db = connection['test_project']

    recos = db.topic_recommendations.find({"userId": str(user_id)}).next()['recommendations']

    sortedOutput = sorted(recos.items(), key=lambda value: value[1], reverse=True)

    sortedTopics = []
    length = len(sortedOutput)
    c = 0
    for i in xrange(len(sortedOutput)):
        index = random.randrange(0, 220)
        c = c + 1
        sortedTopics.append(str(sortedOutput[index][0]) + ":" + str(sortedOutput[index][1]))
        if c == 7:
            break

    dict = {}
    dict['topics'] = sortedTopics
    connection.close()
    return json.dumps(dict)


@app.route('/users/getNodes', methods=['GET'])    #int has been used as a filter that only integer will be passed in the url otherwise it will give a 404 error
def recommendNodes():
    #"users": list of string
    #"topics": list of string
    #"questions" : list of String{q1,q2,q3 are t1}

    output = {}
    user_id = request.args.get('userId');
    topic = request.args.get('topic');
    difficulty = request.args.get('diff');
    time = request.args.get('time');

    connection = MongoClient('localhost', 27017)
    db = connection['test_project']

    db = connection['test_project']

    recos = db.topic_recommendations.find({"userId": str(user_id)}).next()['recommendations']

    sortedOutput = sorted(recos.items(), key=lambda value: value[1], reverse=True)

    sortedTopics = []
    count = 0

    for i in sortedOutput:
        sortedTopics.append(str(i[0]))
        count +=1
        if count == 3:
            break;

    sortedTopics.append(topic)

    #SortTopics has 4 top topics
    output["topics"] = sortedTopics

    users = []
    # find users.

    users.append(user_id)

    usrCount = 0
    for a in db.posts.find({"@OwnerUserId": {"$exists": "true" }, "@Tags": { "$regex" : topic}}):
        users.append(str(a[u'@OwnerUserId']))
        usrCount+=1
        if usrCount == 2:
            break

    uc = 0
    for i in users:
        user = db.users.find({"@Id": i}).next()
        uname = user[u"@DisplayName"]
        users[uc] = users[uc] + "-" + str(uname)
        uc+=1

    output["users"]= users

    questions = []

    for topic in sortedTopics:

        qc = 0
        for q in db.posts.find({"@OwnerUserId": {"$exists": "true" }, "@PostTypeId": "1", "@Tags": { "$regex" : topic[0]} }):
            quest = q[u'@Id']
            if(quest not in questions):
                questions.append(quest)
                qc+=1

            if qc == 3:
                break


    questionsJson = []
    i = 0
    size = len(sortedTopics)
    for q in questions:
        a = db.posts.find({"@Id" : q}).next()
        quest = {}
        quest["questionId"] = a[u'@Id']
        quest["questionText"] = a[u'@Title']
        quest["questionLink"] = "http://stackoverflow.com/"
        quest["postedDate"] = a[u'@CreationDate']
        quest["postedBy"] = a[u'@OwnerUserId']
        quest["tags"] = sortedTopics[i % size]
        i+=1
        questionsJson.append(quest)

    output["questions"] = questionsJson
    return json.dumps(output)


@app.route('/users/<int:user_id>')    #int has been used as a filter that only integer will be passed in the url otherwise it will give a 404 error
def find_question(user_id):
    connection = MongoClient('localhost', 27017)
    print "connection is "
    db = connection['test_project']
    names = db.collection_names()
    print "names are", names
    answer = db.posts.find({"@OwnerUserId": str(user_id)})
    print answer

    topics = []
    for a in answer:
        if '@Tags' in a:
            localTopics = a['@Tags']
            localTopics = localTopics.replace('<', '')
            localTopics = localTopics.replace('>', ' ')
            topics = topics + localTopics.split(" ")

    counts = Counter(topics).most_common(5)
    topicString = ""
    for val1, val2 in counts:
        topicString += val1 + ","

        topicString = topicString.encode('ascii', 'ignore')
    print "topic is ",topicString
    print type(topicString)
    json_return = {}
    json_return["userId"] = str(user_id)

    json_return ["topics"] = topicString
    connection.close()
    return json.dumps(json_return)

    # return names

if __name__ == "__main__":
    app.wsgi_app = middleWare.LoggingMiddleware(app.wsgi_app)
    app.run()