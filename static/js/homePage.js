
var eventsRegistered = false;

function populateTopics(){

    var userId = document.getElementById("userId");
    if(!userId){
        userId = "51";
    } else {
        userId = userId.value;
        if(userId == ""){
            userId = "51";
        }
    }
   var getRUrl = "http://localhost:5000/users/rTopics/";
   getRUrl = getRUrl + userId;

    $.ajax({

        url: getRUrl,
        success : function(result){

            var json = {
            };

            var internalJson= {};

            var obj = JSON.parse(result);

            var topicsArray = obj.topics;

            console.log(topicsArray);

            for (var i = 0; i < topicsArray.length; i++){
                var item = topicsArray[i];
                var key = item.split(":")[0];
                var value = parseFloat(item.split(":")[1]);
                internalJson[key] = value;
            }

            json['topics'] = internalJson;

            var diameter = 300;
            var bleed = 50;

            $("#chartPane").html("<b> Topic Recommendations</b>");
            var svg = d3.select('#chartPane').append('svg')
                                .attr('width', 250)
                                .attr('height', 300);

           var bubble = d3.layout.pack()
                            .size([250, 300])
                            .value(function(d) {return d.size;})
                            .padding(3);

            function processData(data) {
                var obj = data.topics;

                var newDataSet = [];

                for(var prop in obj) {
                  newDataSet.push({name: prop, className: prop.toLowerCase(), size: obj[prop]});
                }
                return {children: newDataSet};
              }

              // generate data with calculated layout values
              var nodes = bubble.nodes(processData(json))
                                    .filter(function(d) { return !d.children; }); // filter out the outer bubble

              var vis = svg.selectAll('g myCircleText')
                                .data(nodes);

              var counter = 0;

              vis.enter().append('g')
                        .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });


                        var circle = vis.append("circle")
                        .attr('r', function(d) {
                            return d.r;
                        })
                        .attr('class', function(d) {
                            counter++;
                            return "color" + counter;
                        });

               vis.append("text").text(function(d){
                    var name =  d.name;
                    name = name.replace("u", "");
                    name = name.replace("'", "");
                    name = name.replace("[", "");
                    name = name.replace("]", "");
                    name = name.replace("-", "");
                     name = name.replace("\'", "");
                    return name;

               }).attr("dx", function(d){ return -30})
               .style("font-size", function(d) {
                return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 16) + "px";
               })
               .append("svg:title").text(function(d, i){
                    return d.name;
               }).attr("stroke", function(d, i){
                    return "white";
               })
               .attr("dy", ".35em");

                if(eventsRegistered == false){
                        registerEvents();
                        eventsRegistered = true;
                }


        },
        error:function(error){

        }

    });

 }

 function getUserTopics(controlsPane){

    if(!controlsPane)
        controlsPane = $("#controlsPane");

    var userIdNumber = document.getElementById("userId");
    if(!userIdNumber){
        userIdNumber = "51";
    } else {
        userIdNumber = userIdNumber.value;
        if(userIdNumber == ""){
            userIdNumber = "51";
        }
    }

    var getUrl = "http://localhost:5000/users/";
    getUrl = getUrl + userIdNumber;

	$.ajax({
			url:getUrl,
			success: function(result){

                controlsPane.html("<b> Select inputs </b>");

                result = JSON.parse(result);

                var userId = $("<div id='userIdContainer'><span><label>User ID: </label> <input id = 'userId' value='"+ userIdNumber +"' type = 'text'></input></span></div>");
	            controlsPane.append(userId);

                var difficulty = $("<div id='difficultyContainer'><span><label>Difficulty: </label> <input id = 'difficulty' type = 'range' min = '0' max= '1' step= '0.1' value = '0.5'></input> <label id ='difficultyValue' >0.5</label></span></div>");
                controlsPane.append(difficulty);

                var time = $("<div id='timeContainer'><span><label>Time: </label> <input id = 'time' type = 'range' min = '0' max= '1' value = '0.5' step= '0.1'></input> <label id ='timeValue'>0.5</label></span></div>");

                controlsPane.append(time);

                var topicSelector = "<div id= 'topicSelector'> <label> Topic:</label><input list='topics' name='topicName' class='marginLeft30'> <datalist id='topics'>";

                var topicsList = result.topics.split(",");
	            for(var i = 0; i < topicsList.length; i++){
		            topicSelector = topicSelector + "<option value = '" + topicsList[i]+ "'>"
	            }

                topicSelector = topicSelector + "</datalist> </input></div>";

                controlsPane.append(topicSelector);

                var submitButton = "<div id='submitButtonContainer' ><input id='submitButton' type='button' value='Submit'></input></div>";
                controlsPane.append(submitButton);

                populateTopics();

            }, error: function(err){
            }
            });

 }

function populateNetwork(){







}



var registerEvents = function(){
    $("document").ready(function(){

    document.getElementById("userId").value = "51";

    $("#difficultyValue").css('background-color', '#ad8527');
    $("#timeValue").css('background-color', '#ad8527');

	$("#difficulty").on("change", function(event){

		var newValue = event.currentTarget.value;
		$("#difficultyValue").html(newValue);
        $("#difficultyValue").css('background-color', 'white');
        if(newValue == 0){
            $("#difficultyValue").css('background-color', '#047517');
        }        if(newValue == 0.1){
            $("#difficultyValue").css('background-color', '#30b546');
        }        if(newValue == 0.2){
            $("#difficultyValue").css('background-color', '#51ad60');
        }        if(newValue == 0.3){
            $("#difficultyValue").css('background-color', '#cbd127');
        }        if(newValue == 0.4){
            $("#difficultyValue").css('background-color', '#c0c44e');
        }        if(newValue == 0.5){
            $("#difficultyValue").css('background-color', '#ad8527');
        }        if(newValue == 0.6){
            $("#difficultyValue").css('background-color', '#d36e21');
        }        if(newValue == 0.7){
            $("#difficultyValue").css('background-color', '#d34b21');
        }        if(newValue == 0.8){
            $("#difficultyValue").css('background-color', '#e03633');
        }        if(newValue == 0.9){
            $("#difficultyValue").css('background-color', '#b20f0c');
        }        if(newValue == 1){
            $("#difficultyValue").css('background-color', '#f20602');
        }
        populateTopics();
	});

	$("#time").on("change", function(event){

		var newValue = event.currentTarget.value;
		$("#timeValue").html(newValue);
        $("#timeValue").css('background-color', '#ad8527');
		        $("#timeValue").css('background-color', 'white');
        if(newValue == 0){
            $("#timeValue").css('background-color', '#047517');
        }        if(newValue == 0.1){
            $("#timeValue").css('background-color', '#30b546');
        }        if(newValue == 0.2){
            $("#timeValue").css('background-color', '#51ad60');
        }        if(newValue == 0.3){
            $("#timeValue").css('background-color', '#cbd127');
        }        if(newValue == 0.4){
            $("#timeValue").css('background-color', '#c0c44e');
        }        if(newValue == 0.5){
            $("#timeValue").css('background-color', '#ad8527');
        }        if(newValue == 0.6){
            $("#timeValue").css('background-color', '#d36e21');
        }        if(newValue == 0.7){
            $("#timeValue").css('background-color', '#d34b21');
        }        if(newValue == 0.8){
            $("#timeValue").css('background-color', '#e03633');
        }        if(newValue == 0.9){
            $("#timeValue").css('background-color', '#b20f0c');
        }        if(newValue == 1){
            $("#timeValue").css('background-color', '#f20602');
        }
        populateTopics();
	});

	$("#submitButton").on("click", function(event){
        getUserTopics();
        populateNetwork();
	});

});
};



function buildLeftPane(container){

	//this has to be obtained by an AJAX call
    var controlsPane = $('<div id = "controlsPane"><b> Select inputs </b></div>');
    var recoPane = $('<div id="chartPane"><b> Topic Recommendations</b></div>');

    container.append(controlsPane);
    container.append(recoPane);
    getUserTopics(controlsPane);



}

function buildRightPane(container, data){
	var postsJson = data;
    container.html("<div id = 'header'><b> Questions</b></div>");

	for(var i = 0; i < postsJson.length; i++){

		var questionObject = postsJson[i];

		var questionHTML = "<div class = 'questionContainer' class='paddingBottom' ><span> <label>" + questionObject.questionId + ". </label>" + "\
			<label class='question'>"+ questionObject.questionText + "</label> </span></div> <div class='secondLine'> <span><label class = 'secondLabel'> Posted Date : </label>\
			<label class='secondLabel'>" +  questionObject.postedDate + "</label> <label class = 'secondLabel'> Posted By: </label> <label class='secondLabel'>" + questionObject.postedBy + "</label><label class='secondLabel'>\
			Tags: </label><label class='secondLabel'>"+ questionObject.tags  +  "</label></span></div>";


		container.append(questionHTML);

	}

}

function constructNetwork(container, data){

    var users = data.users;
    var topics = data.topics;
    var postsJson = data.questions;

    var nodes = null;
        var edges = null;
        var network = null;

        function destroy() {
            if (network !== null) {
                network.destroy();
                network = null;
            }
        }

        function draw() {
            destroy();
            nodes = [];
            edges = [];
            var connectionCount = [];
            //ids: 0 -2 users, 3 -6 topics, 7 - 18 questions
            nodes.push({id: 0, label: users[0], title: users[0], color:'green', image: 'images/icon_main.png', value: 15, mass : 2});
            nodes.push({id: 1, label: users[1], title: users[1],  color:'#8cd98c',image: 'images/icon_sub.png', value: 15, mass : 10});
            nodes.push({id: 2, label: users[2], title: users[2],  color: '#53c653', image: 'images/icon_sub.png', value: 15, mass : 20});

            nodes[0]["level"] = 0;
            nodes[1]["level"] = 0;
            nodes[2]["level"] = 0;

            var topicColors = ["#267326", '#8cd98c', '#53c653', '#53c653'];

            var j = 0;
            var qCount = 0;
            for(var i = 0; i < postsJson.length; i++){
                if(qCount % 3 == 0){
                    nodes.push({id: 3 + j, label: topics[j], title: topics[j], color:topicColors[j] , value: 15, mass : 15});
                    nodes[3 + j]["level"] = 1;
                    j++;
                }
                qCount++;
        	}

            var questionColor = ['#267326', '#267326', '#2d862d', '#2d862d','#40bf40', '#40bf40', '#8cd98c', '#8cd98c', '#339933', '#339933', '#39ac39', '#39ac39', '#53c653', '#53c653', '#53c653'];
            for(var i = 0; i < postsJson.length; i++){
                var question = postsJson[i];
                var id = question.questionId;
                nodes.push({id: 7 + i, label: id, title : id, color:questionColor[i]});
                nodes[7 + i]["level"] = 2;
        	}

            var valuesArray1 = [ 12, 8, 4 ,2];
            var valuesArray2 = [ 11, 5, 3 ,2];
            var valuesArray3 = [ 14, 6, 4 ,2];

            var colorValues1 = ["#023484", "#0347b5", "#1050b7", "#1e66db"];
            var colorValues2 = ["#033d9b", "#1050b7", "#1e66db", "#4079d6"];
            var colorValues3 = ["#0347b5", "#145bce", "#2d74e5", "#528ae5"];

            for(var i = 0; i < 3; i++){

                for(var j = 0; j < 4; j++){
                    if(i == 0)
                        edges.push({from: i, to: 3 + j,color: colorValues1[j] ,value : valuesArray1[j], arrows : "to"});

                    if(i == 1)
                       edges.push({from: i, to: 3 + j, color: colorValues2[j], value : valuesArray2[j], arrows : "to"});

                    if(i == 2)
                       edges.push({from: i, to: 3 + j, color: colorValues3[j], value : valuesArray3[j], arrows : "to"});

                    }
            }

            var valuesArray1 = [ 12, 8, 4 ,2];
            var valuesArray2 = [ 11, 5, 3 ,2];
            var valuesArray3 = [ 14, 6, 4 ,2];
            var valuesArray4 = [ 17, 12, 11, 7];


            var colorValues1 = ["#023484", "#0347b5", "#1050b7", "#1e66db"];
            var colorValues2 = ["#033d9b", "#1050b7", "#1e66db", "#4079d6"];
            var colorValues3 = ["#0347b5", "#145bce", "#2d74e5", "#528ae5"];
            var colorValues4 = ["#0347b5", "#145bce", "#2d74e5", "#528ae5"];


            var questStart = 7;
            for(var i = 0; i < 4; i ++){

                for(var j = 0; j < 3; j++){

                    if(i == 0)
                        edges.push({from: i + 3, to: questStart ,color : colorValues1[j],  value : valuesArray1[j], arrows : "to"});

                    if(i == 1)
                        edges.push({from: i + 3, to: questStart ,color : colorValues2[j], value : valuesArray2[j], arrows : "to"});

                    if(i == 2)
                        edges.push({from: i + 3, to: questStart ,color : colorValues3[j], value : valuesArray3[j], arrows : "to"});

                    if(i == 3)
                        edges.push({from: i + 3, to: questStart ,color : colorValues4[j], value : valuesArray4[j], arrows : "to"});

                    questStart++;

                }
            }

          // create a network

            var data = {
                nodes: nodes,
                edges: edges
            };

            var options = {
                edges: {
                    smooth: {
                        type: 'cubicBezier',
                        forceDirection: 'vertical',
                        roundness: 0.4
                    }
                },
                layout: {
                    hierarchical: {
                        direction: "UD"
                    }
                },
                physics:false
            };

            container = document.getElementById("networkPane");
            network = new vis.Network(container, data, options);
        }

        $(document).ready(function(){
            draw();
        });

        container.append();
        container.append("<div id='legendPane'> <div class='my-legend'> <div class='legend-scale'><ul class='legend-labels'><li><span style='background:#023484;'></span>Best</li><li><span style='background:#033d9b;'></span></li><li><span style='background:#0347b5;'></span></li><li><span style='background:#1050b7;'></span></li><li><span style='background:#145bce;'></span>Good</li><li><span style='background:#1e66db;'></span></li><li><span style='background:#2d74e5;'></span></li><li><span style='background:#4079d6;'></span></li><li><span style='background:#528ae5;'></span></li><li><span style='background:#82adf2;'></span>Related</li></ul></div> <br/><div class='legend-scale'> <ul class='legend-labels'> <li><span style='background:#267326;'></span>Best</li>     <li><span style='background:#2d862d;'></span></li>     <li><span style='background:#339933;'></span></li>     <li><span style='background:#39ac39;'></span></li>     <li><span style='background:#40bf40;'></span>Good</li>     <li><span style='background:#53c653;'></span></li>     <li><span style='background:#66cc66;'></span></li>     <li><span style='background:#79d279;'></span></li>     <li><span style='background:#8cd98c;'></span></li>     <li><span style='background:#9fdf9f;'></span>Related</li>   </ul> </div> <div class='legend-source'>Relevance</div></div></div>");

}



function buildMiddlePane(container){


    var userIdNumber = document.getElementById("userId");
    if(!userIdNumber){
        userIdNumber = "51";
    } else {
        userIdNumber = userIdNumber.value;
        if(userIdNumber == ""){
            userIdNumber = "51";
        }
    }


    var difficulty = document.getElementById("difficulty");
    if(!difficulty){
        difficulty = "0.5";
    } else {
        difficulty = difficulty.value;
        if(difficulty == ""){
            difficulty = "0.5";
        }
    }

    var time = document.getElementById("time");
    if(!time){
        time = "0.5";
    } else {
        time = time.value;
        if(time == ""){
            time = "0.5";
        }
    }


    var topic = $('#topics option:selected');
    if(!topic){
        topic = "algorithms";
    } else {
        topic = topic.val();
        if(!topic || topic == ""){
            topic = "algorithms";
        }
    }

    var getUrl = "http://localhost:5000/users/getNodes?userId=" + userIdNumber + "&topic=" + topic + "&diff=" + difficulty + "&time=" + time;

    $.ajax({
			url:getUrl,
			success: function(result){
			result = JSON.parse(result);
            constructNetwork($("#middlePane"), result);
            buildRightPane($("#rightPane"), result.questions);

      }, error: function(err){
            }
     });

}



function loadPage(){

	parent = $("body");

	var titlePane = $("<div class = 'title'><h3>A RECOMMENDER FOR QUESTION SEEKER ON STACK OVERFLOW</h3></div>");
	var leftPane = $("<div class = 'pane' id= 'leftPane'></div>");
	var middlePane = $("<div class = 'pane' id ='middlePane'><div id='titlePane'><b>Influence Graph with weighted edges depicting the power of entity influence.</b></div><div id='networkPane'/></div>");
	var rightPane = $("<div class = 'pane' id ='rightPane'></div>");

	var leftPaneContent = buildLeftPane(leftPane);
	var middlePaneContent = buildMiddlePane(middlePane);

	parent.append(titlePane);
	parent.append(leftPane);
	parent.append(middlePane);
	parent.append(rightPane);

}