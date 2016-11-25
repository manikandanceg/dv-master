from flask import Flask, json
import middleWare
from collections import Counter

app = Flask(__name__, static_url_path='')
from pymongo import MongoClient

@app.route("/")
def hello():
    return app.send_static_file('index.html')

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

