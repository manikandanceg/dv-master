from flask import Flask, json
import middleWare

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
    topics = ""
    for a in answer:
        if '@Tags' in a:
            topics += a['@Tags']
    topics = topics.encode('ascii', 'ignore')
    print "topic is ",topics
    print type(topics)
    topics = topics.replace('<','')
    topics = topics.replace('>', ' ')
    json_return = {}
    json_return["userId"] = str(user_id)

    json_return ["topics"] = topics
    
    return json.dumps(json_return)

    # return names

if __name__ == "__main__":
    app.wsgi_app = middleWare.LoggingMiddleware(app.wsgi_app)
    app.run(host='0.0.0.0')

