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


                var flare = {
  "name": "Topic",
  "children": [
    {
      "name": "Eclipse",
      "children": [
        {
          "name": "Java",
          "size": 50
        },
        {
          "name": "Java1",
          "size": 50
        },
        {
          "name": "Java2",
          "size": 50
        }
      ]
    },
    {
      "name": "Android",
      "children": [
        {
          "name": "a1",
          "size": 50
        },
        {
          "name": "a2",
          "size": 50
        },
        {
          "name": "a3",
          "size": 50
        },
        {
          "name": "a4",
          "size": 50
        }
      ]
    }
  ]
};

function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}


  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 60; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", click);

  nodeEnter.append("circle")
      .attr("r", 1e-6)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter.append("text")
      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
      .attr("r", 4.5)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      });

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

    var margin = {top: 20, right: 0, bottom: 20, left: 40},
    width = 250 - margin.right - margin.left,
    height = 400 - margin.top - margin.bottom;

var i = 0,
    duration = 750,
    root;

var tree = d3.layout.tree()
    .size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("#chartPane").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



root = flare;
root.x0 = height / 2;
root.y0 = 0;
root.children.forEach(collapse);
update(root);

d3.select(self.frameElement).style("height", "800px");

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