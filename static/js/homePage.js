$("document").ready(function(){

	$("#difficulty").on("change", function(event){

		var newValue = event.currentTarget.value;
		$("#difficultyValue").html(newValue);

		alert(newValue);


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

	var userId = $('#userId').value;
	var topicRecommenderJSON = {
		userId  : 01,
		topics : ["Eclipse", "Java"]

	};

    var getUrl = "http://localhost:5000/users/";
    getUrl = getUrl + "51";

	$.ajax({
			url:getUrl,
			success: function(result){

                result = JSON.parse(result);

                var userId = $("<div id='userIdContainer'><span><label>User ID: </label> <input id = 'userId' value='51' type = 'text'></input></span></div>");
	            container.append(userId);

                var difficulty = $("<div id='difficultyContainer'><span><label>Difficulty: </label> <input id = 'difficulty' \
                    type = 'range' min = '0' max= '1' step= '0.1' value = '0.5'></input> <label id ='difficultyValue'>0.5</label></span></div>");
                container.append(difficulty);

                var time = $("<div id='timeContainer'><span><label>Time: </label> <input id = 'time' type = 'range' min = '0' max= '1' value = '0.5' step= '0.1'></input>\
                    <label id ='timeValue'>0.5</label></span></div>");

                container.append(time);

                var topicSelector = "<div id= 'topicSelector'> <label> Topic:</label><input list='topics' name='topicName' > <datalist id='topics'>";

                var topicsList = result.topics.split(" ");
	            for(var i = 0; i < topicsList.length; i++){
		            topicSelector = topicSelector + "<option value = '" + topicsList[i]+ "'>"
	            }

                topicSelector = topicSelector + "</datalist> </input></div>";

                container.append(topicSelector);

                var submitButton = "<div id='submitButtonContainer' ><input id='submitButton' type='button' value='Submit'></input></div>";
                container.append(submitButton);

			},
			error: function(result){
                alert(result);
			}
	});




}

function buildMiddlePane(container){

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

function buildRightPane(container){

	return "Right Pane";
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