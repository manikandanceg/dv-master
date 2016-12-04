var registerEvents = function(){
    $("document").ready(function(){

    $("#difficultyValue").css('color', '#ad8527');
	$("#difficulty").on("change", function(event){

		var newValue = event.currentTarget.value;
		$("#difficultyValue").html(newValue);
        $("#difficultyValue").css('color', 'white');
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

	});

	$("#time").on("change", function(event){

		var newValue = event.currentTarget.value;
		$("#timeValue").html(newValue);
        $("#timeValue").css('background-color', '#ad8527');
		        $("#timeValue").css('color', 'white');
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



	});

	$("#submitButton").on("click", function(event){

	});

});
};



function buildLeftPane(container){

	//this has to be obtained by an AJAX call
    var controlsPane = $('<div id = "controlsPane"><h3> Select inputs </h3></div>');
    var recoPane = $('<div id="chartPane"><h3> Topic Recommendations</h3></div>');

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
                    type = 'range' min = '0' max= '1' step= '0.1' value = '0.5'></input> <label id ='difficultyValue' >0.5</label></span></div>");
                controlsPane.append(difficulty);

                var time = $("<div id='timeContainer'><span><label>Time: </label> <input id = 'time' type = 'range' min = '0' max= '1' value = '0.5' step= '0.1'></input>\
                    <label id ='timeValue'>0.5</label></span></div>");

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

                //var recos = {};


               //var userId = $('#userId').value;

               var getRUrl = "http://localhost:5000/users/rTopics/";
               getRUrl = getRUrl + "51";

                $.ajax({

                    url: getRUrl,
                    success : function(result){

                        var json = {
                        };

                        var internalJson= {};

                        var obj = JSON.parse(result);

                        var topicsArray = obj.topics;

                        for (var i = 0; i < topicsArray.length; i++){
                            var item = topicsArray[i];
                            var key = item.split(":")[0];
                            var value = parseFloat(item.split(":")[1]);
                            internalJson[key] = value;
                        }

                        json['topics'] = internalJson;

                        var diameter = 300;
                        var bleed = 50;

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
                           .attr("dy", ".35em");;

                           registerEvents();

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
		"questionText" : "Where can I find good explanations of Computability and Complexity??",
		"questionLink": "http://stackoverflow.com/",
		"postedDate" : "2014-10-11",
		"postedBy" : "Carrie Mattheisen",
		"tags" : "Module, Computability, Resources"
	},
	{
		"questionId": "2",
		"questionText" : "Q: Numerical Economic Computability Algorithm",
		"questionLink": "http://stackoverflow.com/",
		"postedDate" : "2014-10-11",
		"postedBy" : "Spitzi Spitzi",
		"tags" : "numerical-analysis, Computability"
	},
	{
		"questionId": "3",
		"questionText" : "Q: Computability: SAT Formula with Bounded Number of Clauses",
		"questionLink": "http://stackoverflow.com/",
		"postedDate" : "2014-10-11",
		"postedBy" : "Wolfgang",
		"tags" : "sat, Computability"
	},
	{
		"questionId": "4",
		"questionText" : "Ways to measure bit sequence complexity??",
		"questionLink": "http://stackoverflow.com/",
		"postedDate" : "2014-10-11",
		"postedBy" : "User201193",
		"tags" : "sequences,complexity, Computability"
	},
	{
		"questionId": "5",
		"questionText" : "HaltingProblem in Agda?",
		"questionLink": "http://stackoverflow.com/",
		"postedDate" : "2014-10-13",
		"postedBy" : "Psyche",
		"tags" : "akda, haskell, Computability"
	},
	{
		"questionId": "6",
		"questionText" : "Can a program decide whether an arbitrary progam halts for SOME input?",
		"questionLink": "http://stackoverflow.com/",
		"postedDate" : "2014-10-16",
		"postedBy" : "Larry",
		"tags" : "halting-problem, Computability"
	},
	{
		"questionId": "7",
		"questionText" : "Reduction from ATM to ATM-co",
		"questionLink": "http://stackoverflow.com/",
		"postedDate" : "2014-10-18",
		"postedBy" : "Dvir Samuel",
		"tags" : "turing-machines, Computability"
	},
	{
		"questionId": "8",
		"questionText" : "Computation Step using state diagram of 'Turing Machine'",
		"questionLink": "http://stackoverflow.com/",
		"postedDate" : "2014-10-22",
		"postedBy" : "IS2057",
		"tags" : "turing-machine, Computability"
	},{
		"questionId": "9",
		"questionText" : "Why is chess, checkers, Go, etc. in EXP but conjectured to be in NP?",
		"questionLink": "http://stackoverflow.com/",
		"postedDate" : "2014-11-11",
		"postedBy" : "Wolfgang",
		"tags" : "asymptotic-complexity, Computability"
	},
	{
		"questionId": "10",
		"questionText" : "Subset sum where the size of the subset is `k` is NPC?",
		"questionLink": "http://stackoverflow.com/",
		"postedDate" : "2014-11-14",
		"postedBy" : "Mugen",
		"tags" : "sat, Computability"
	}];

    container.append("<div id = 'header'><h3> Questions</h3></div>");

	for(var i = 0; i < postsJson.length; i++){

		var questionObject = postsJson[i];

		var questionHTML = "<div class = 'questionContainer' class='paddingBottom' ><span> <label>" + questionObject.questionId + ". </label>" + "\
			<label class='question'>"+ questionObject.questionText + "</label> </span></div> <div class='secondLine'> <span><label class = 'secondLabel'> Posted Date : </label>\
			<label class='secondLabel'>" +  questionObject.postedDate + "</label> <label class = 'secondLabel'> Posted By: </label> <label class='secondLabel'>" + questionObject.postedBy + "</label><label class='secondLabel'>\
			Tags: </label><label class='secondLabel'>"+ questionObject.tags  +  "</label></span></div>";


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

            nodes.push({id: 0, label: "Wolfgang"});
            nodes.push({id: 1, label: "Larry", color:'green'});
            nodes.push({id: 2, label: "Mugen"});

            nodes.push({id: 3, label: "Module", color: "#267326"});
            nodes.push({id: 4, label: "Computability",color:'#8cd98c'});
            nodes.push({id: 11, label: "Sequences", color:'#53c653'});
            nodes.push({id: 12, label: "Turing-machine", color:'#53c653'});

            nodes.push({id: 5, label: "1", color:'#267326'});
            nodes.push({id: 6, label: "2",color:'#2d862d'});
            nodes.push({id: 7, label: "5",color:'#40bf40'});
            nodes.push({id: 8, label: "9",color: '#8cd98c'});

            nodes.push({id: 16, label: "3",color:'#339933'});
            nodes.push({id: 17, label: "4",color:'#39ac39'});
            nodes.push({id: 18, label: "6",color:'#53c653'});
            nodes.push({id: 19, label: "12"});
            nodes.push({id: 20, label: "13"});


            edges.push({from: 0, to: 3, value : 20});
            edges.push({from: 0, to: 4, value : 8});
            edges.push({from: 1, to: 3, value : 20, color:'#267326' });
            edges.push({from: 1, to: 4, value : 12, color:'#53c653'});
            edges.push({from: 2, to: 3, value : 20});
            edges.push({from: 2, to: 4, value : 8});
            edges.push({from: 0, to: 11, value : 20});
            edges.push({from: 0, to: 12, value : 6});
            edges.push({from: 1, to: 12, value : 12, color:'#53c653'});
            edges.push({from: 1, to: 11, value : 6, color:'#8cd98c'});


            edges.push({from: 3, to: 5});
            edges.push({from: 4, to: 6});
            edges.push({from: 11, to: 7});
            edges.push({from: 12, to: 8});
            edges.push({from: 3, to: 17});
            edges.push({from: 4, to: 18});
            edges.push({from: 11, to: 19});
            edges.push({from: 12, to: 20});
            edges.push({from: 11, to: 16});

            nodes[0]["level"] = 0;
            nodes[1]["level"] = 0;
            nodes[2]["level"] = 0;

            nodes[3]["level"] = 1;
            nodes[4]["level"] = 1;
            nodes[5]["level"] = 1;
            nodes[6]["level"] = 1;

            nodes[7]["level"] = 2;
            nodes[8]["level"] = 2;
            nodes[9]["level"] = 2;
            nodes[10]["level"] = 2;
            nodes[11]["level"] = 2;
            nodes[12]["level"] = 2;
            nodes[13]["level"] = 2;
            nodes[14]["level"] = 2;
            nodes[15]["level"] = 2;
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