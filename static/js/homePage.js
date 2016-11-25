$("document").ready(function(){

	$("#difficulty").on("change", function(event){

		var newValue = event.currentTarget.value;
		$("#difficultyValue").html(newValue);

		//alert(newValue);


		$.ajax({
			url:"",
			success: function(result){

			},
			error: function(result){

			}
		});


	});

	$("#time").on("change", function(event){

		var newValue = event.currentTarget.value;
		$("#timeValue").html(newValue);

	});

	$("#submitButton").on("click", function(event){

	});

});


function buildLeftPane(container){

	//this has to be obtained by an AJAX call
    var controlsPane = $('<div id = "controlsPane"></div>');
    var recoPane = $('<div id="chartPane"></div>');

    container.append(controlsPane);
    container.append(recoPane);


	var userId = $('#userId').value;

    var getUrl = "http://localhost:5000/users/";
    getUrl = getUrl + "51";

	$.ajax({
			url:getUrl,
			success: function(result){

                result = JSON.parse(result);

                var userId = $("<div id='userIdContainer'><span><label>User ID: </label> <input id = 'userId' value='51' type = 'text'></input></span></div>");
	            controlsPane.append(userId);

                var difficulty = $("<div id='difficultyContainer'><span><label>Difficulty: </label> <input id = 'difficulty' \
                    type = 'range' min = '0' max= '1' step= '0.1' value = '0.5'></input> <label id ='difficultyValue'>0.5</label></span></div>");
                controlsPane.append(difficulty);

                var time = $("<div id='timeContainer'><span><label>Time: </label> <input id = 'time' type = 'range' min = '0' max= '1' value = '0.5' step= '0.1'></input>\
                    <label id ='timeValue'>0.5</label></span></div>");

                controlsPane.append(time);

                var topicSelector = "<div id= 'topicSelector'> <label> Topic:</label><input list='topics' name='topicName' > <datalist id='topics'>";

                var topicsList = result.topics.split(",");
	            for(var i = 0; i < topicsList.length; i++){
		            topicSelector = topicSelector + "<option value = '" + topicsList[i]+ "'>"
	            }

                topicSelector = topicSelector + "</datalist> </input></div>";

                controlsPane.append(topicSelector);

                var submitButton = "<div id='submitButtonContainer' ><input id='submitButton' type='button' value='Submit'></input></div>";
                controlsPane.append(submitButton);

                //var recos = {};


               //var userId = $('#userId').value;

               var getRUrl = "http://localhost:5000/users/rTopics/";
               getRUrl = getRUrl + "51";

                $.ajax({

                    url: getRUrl,
                    success : function(result){

                         var json = {"topics": {
                            "java": 3, "c++": 5, "eclipse": 6
                          }};

                        var json = JSON.parse(result);

                        var diameter = 300;

                        var svg = d3.select('#chartPane').append('svg')
                                            .attr('width', 250)
                                            .attr('height', 400);

                       var bubble = d3.layout.pack()
                                        .size([250, 400])
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

                          var vis = svg.selectAll('circle')
                                            .data(nodes);

                          vis.enter().append('circle')
                                    .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
                                    .attr('r', function(d) { return d.r; })
                                    .attr('class', function(d) { return d.className; });
                    },
                    error:function(error){

                    }

                });

      },
			error: function(result){
                console.log(result);
			}
	});



}

function buildRightPane(container){

	var postsJson = [{
		"questionId": "1",
		"questionText" : "How can I do linear regression in R?",
		"questionLink": "http://stackoverflow.com/"
	},
	{
		"questionId": "2",
		"questionText" : "How can I us lm function in R?",
		"questionLink": "http://stackoverflow.com/"
	}];


	for(var i = 0; i < postsJson.length; i++){

		var questionObject = postsJson[i];

		var questionHTML = "<div class = 'questionContainer'><span> <label>" + questionObject.questionId + ". </label>" + "\
			<label>"+ questionObject.questionText + "</label> </span></div>";

		container.append(questionHTML);

	}

}

function buildMiddlePane(container){

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

            nodes.push({id: 0, label: "User1", color:'green'});
            nodes.push({id: 1, label: "User2", color:'red'});
            nodes.push({id: 2, label: "User3", color:'black'});

            nodes.push({id: 3, label: "Topic"});
            nodes.push({id: 4, label: "Topic2"});

            nodes.push({id: 5, label: "Q1"});
            nodes.push({id: 6, label: "Q2"});
            nodes.push({id: 7, label: "Q3"});
            nodes.push({id: 8, label: "Q4"});
            nodes.push({id: 9, label: "Q5"});

            edges.push({from: 0, to: 3, value : 20});
            edges.push({from: 0, to: 4, value : 20});
            edges.push({from: 1, to: 3});
            edges.push({from: 1, to: 4});
            edges.push({from: 2, to: 3});
            edges.push({from: 2, to: 4});

            edges.push({from: 3, to: 5});
            edges.push({from: 3, to: 6});
            edges.push({from: 4, to: 5});
            edges.push({from: 4, to: 6});
            edges.push({from: 5, to: 5});
            edges.push({from: 5, to: 7});
            edges.push({from: 13, to: 8});

            nodes[0]["level"] = 0;
            nodes[1]["level"] = 0;
            nodes[2]["level"] = 0;

            nodes[3]["level"] = 1;
            nodes[4]["level"] = 1;

            nodes[5]["level"] = 2;
            nodes[6]["level"] = 2;
            nodes[7]["level"] = 2;
            nodes[8]["level"] = 2;
            nodes[9]["level"] = 2;



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

            container = document.getElementById("middlePane");
            network = new vis.Network(container, data, options);
        }

        $(document).ready(function(){
            draw();
        });


}



function loadPage(){

	parent = $("body");

	var titlePane = $("<div class = 'title'>STACKOVERFLOW RECOMMENDER</div>");
	var leftPane = $("<div class = 'pane' id= 'leftPane'></div>");
	var middlePane = $("<div class = 'pane' id ='middlePane'></div>");
	var rightPane = $("<div class = 'pane' id ='rightPane'></div>");

	var leftPaneContent = buildLeftPane(leftPane);
	var middlePaneContent = buildMiddlePane(middlePane);
	var rightPaneContent = buildRightPane(rightPane);

	parent.append(titlePane);
	parent.append(leftPane);
	parent.append(middlePane);
	parent.append(rightPane);

}