var quizMaster = (function () {
    var name;
	var data;
	var displayDom;
	var successCbAlias;

	function nextHandler(e) {
                  
        var keuze = e.attr('qvalue');
		var status = getUserStatus();

		if(status.question >= 0) {
            if(keuze == 1 || keuze == 2 || keuze == 3 || keuze == 0){
                status.answers[status.question] = keuze;
                storeUserStatus(status);

                var current = getQuiz();
                var introHTML = "<div class='answer-info'><div class='answer-info-title'><div class='answer-info-button'>" + e.attr('lvalue') + "</div><div class='answer-info-text'>" + e.text() +
                    "</div></div><img src='images/vraag_overlay.png' class='overlay' />" +
                    "<img src='images/vraag1_image.png' /></div><div class='text'><div class='text-header'>" + current.question.infoheader + "</div>" +
                    "<p>" + current.question.infotext + "</p><a href='#' class='quizMasterNext blue-button'>Volgende vraag</a></div>";
                $("#contentkaart").html(introHTML);
                $( ".quizMasterNext" ).each(function(index) {
                    $(this).on("click", function(){
                        nextHandler($(this));
                    });
                });

            }else{
                status.question++;
                storeUserStatus(status);
                displayQuiz(successCbAlias);
            }
		}

        if(keuze == "start"){
            status.question++;
            storeUserStatus(status);
            displayQuiz(successCbAlias);
        }
	}

	function displayQuiz(successCb) {

		successCbAlias = successCb;
		var current = getQuiz();
		var html;
        var introHTML;

		if(current.state === "introduction") {
            console.log('introduction');
            introHTML = "<div class='text'><p id='introduction'>" + current.introduction + "</p>" + nextButton("Start quiz") +  "</div>"
            $("#contentkaart").html(introHTML);
//            displayDom.trigger('create');

		} else if(current.state === "inprogress") {
            console.log('inprogress');

            introHTML = "<div class='text question-text'>" + current.question.text +
                "</div> <div class='question-title'>" + current.question.question + "</div><div class='answers-box'>";
            for(var i=0; i<current.question.answers.length; i++) {
                introHTML += "<a class='answer' href='#'><div class='answer-button'>" + String.fromCharCode(i + 97) + "</div><div qvalue='" + [i] + "'  lvalue='" + String.fromCharCode(i + 97) + "'class='quizMasterNext answer-title'>" + current.question.answers[i] + "</div></a>";
            }
            introHTML += "</div>";
            $("#contentkaart").html(introHTML);
//            displayDom.trigger('create');

		} else if(current.state === "complete") {
            console.log('complete');

            introHTML = "<div class='answer-info'><img src='images/score_image.png' /></div><div class='text'><div class='text-header'>Uw score is " + current.correct + " van de " + data.questions.length+  "</div><p>U bent bewust bezig met de gezondheid van uw kind!</p><div class='text-header'>Scores van anderen</div><div class='scores-other'><div class='scores-other-single'><ul id='bars'><li><div data-percentage='56' class='bar'></div><span>56%</span></li></ul></div><div class='scores-other-single'><ul id='bars'><li><div data-percentage='77' class='bar'></div><span>77%</span></li></ul></div></div><div class='scores-other'><div class='scores-other-single'><span class='subtitle'>Bewust</span></div><div class='scores-other-single'><span class='subtitle'>Minder bewust</span></div></div></div>";
            $("#contentkaart").html(introHTML);
            $("#bars li .bar").each( function( key, bar ) {
                var percentage = $(this).data('percentage');

                $(this).animate({
                    'height' : percentage + '%'
                }, 1000);
            });
			//displayDom.html(html).trigger('create');
			removeUserStatus();
			successCb(current);
		}

        $( ".quizMasterNext" ).each(function(index) {
            $(this).on("click", function(){
                nextHandler($(this));
            });
        });
	}
	
	function getKey() {
		return "quizMaster_"+name;	
	}
	
	function getQuestion(x) {
		return data.questions[x];	
	}
	
	function getQuiz() {
		//Were we taking the quiz already?
		var status = getUserStatus();
		if(!status) {
			status = {question:-1,answers:[]};
			storeUserStatus(status);
		}
		//If a quiz doesn't have an intro, just go right to the question
		if(status.question === -1 && !data.introduction) {
			status.question = 0;
			storeUserStatus(status);
		}

		var result = {
			currentQuestionNumber:status.question
		};
		
		if(status.question == -1) {
			result.state = "introduction";
			result.introduction = data.introduction;	
		} else if(status.question < data.questions.length) {
			result.state = "inprogress";
			result.question = getQuestion(status.question);	
		} else {
			result.state = "complete";
			result.correct = 0;
			for(var i=0; i < data.questions.length; i++) {
				if(data.questions[i].correct == status.answers[i]) {
					result.correct++;	
				}
			}
		}
		return result;
	}
	
	function getUserStatus() {
		var existing = window.sessionStorage.getItem(getKey());
		if(existing) {
			return JSON.parse(existing);
		} else {
			return null;
		}
	}
	
	function nextButton(text) {
        if(text != "")
        {
            return "<a qvalue='start' class='quizMasterNext blue-button'>" + text + "</a>";
        }else{
            return "<a qvalue='start' class='quizMasterNext blue-button'>Volgende</a>";
        }
    }
	function removeUserStatus(s) {
		window.sessionStorage.removeItem(getKey());	
	}
	
	function storeUserStatus(s) {
		window.sessionStorage.setItem(getKey(), JSON.stringify(s));
	}
	
	return {
		execute: function( url, dom, cb ) {

            $.get(url, function(res, code) {
                //Possibly do validation here to ensure basic stuff is present
                name = url;
                data = res;
                displayDom = $(dom);
                //console.dir(res);
                displayQuiz(cb);
            });
		}
	};
}());