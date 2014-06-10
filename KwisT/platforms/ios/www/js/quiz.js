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

                if(status.question == 6){
                    var current = getQuiz();
                    var introHTML = "<div class='answer-info'><div class='answer-info-title'><div class='answer-info-button'>" + e.attr('lvalue') + "</div><div class='answer-info-text'>" + e.text() +
                        "</div></div><img src='images/vraag_overlay.png' class='overlay' />" +
                        "<img src='images/vraag"+(parseInt(status.question)+parseInt(1))+"_image.png' /></div><div class='text'><div class='text-header'>" + current.question.infoheader + "</div>" +
                        "<p>" + current.question.infotext + "</p><a href='#' class='quizMasterNext blue-button'>Bekijk mijn score</a></div>";
                    $("#contentkaart").html(introHTML);
                    $( ".quizMasterNext" ).each(function(index) {
                        $(this).on("click", function(){
                            nextHandler($(this));
                        });
                    });
                }else{

                    var current = getQuiz();
                    var introHTML = "<div class='answer-info'><div class='answer-info-title'><div class='answer-info-button'>" + e.attr('lvalue') + "</div><div class='answer-info-text'>" + e.text() +
                        "</div></div><img src='images/vraag_overlay.png' class='overlay' />" +
                        "<img src='images/vraag"+(parseInt(status.question)+parseInt(1))+"_image.png' /></div><div class='text'><div class='text-header'>" + current.question.infoheader + "</div>" +
                        "<p>" + current.question.infotext + "</p><a href='#' class='quizMasterNext blue-button'>Volgende vraag</a></div>";
                    $("#contentkaart").html(introHTML);
                    $( ".quizMasterNext" ).each(function(index) {
                        $(this).on("click", function(){
                            nextHandler($(this));
                        });
                    });
                }

            }else{
                status.question++;
                storeUserStatus(status);
                displayQuiz(successCbAlias);
            }
		}

        if(keuze == "start")
        {
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
            $("header").hide();
            console.log('introduction');
            //introHTML = "<div class='text'><p id='introduction'>" + current.introduction + "</p>" + nextButton("Start quiz") +  "</div>";
            introHTML = "<div class='blue-button-holder'><a qvalue='start' class='quizMasterNext blue-button-intro'>Start Quiz</a>" + "<a class='infoscherm blue-button-intro'>Info</a></div>";

            $(".content").css('background-image', 'url(images/splas.png)');
            $(".content").css('background-size', 'cover');
            $(".content").html(introHTML);
//            displayDom.trigger('create');


		} else if(current.state === "inprogress") {
            $("header").show();
            $(".content").html('<div id="contentkaart" class="card-new"></div>');
            $(".balloon").remove();
            $(".content").css('background-image', '');
            $("body").prepend("<div class='balloon'>Vraag " + (parseInt(getUserStatus().question)+parseInt(1)) + "</div>");

            console.log('inprogress');

            introHTML = "<div class='text question-text'>" + current.question.text +
                "</div> <div class='question-title'>" + current.question.question + "</div><div class='answers-box'>";
            for(var i=0; i<current.question.answers.length; i++) {
                introHTML += "<a class='answer' href='#'><div qvalue='start' class='answer-button'>" + String.fromCharCode(i + 97) + "</div><div qvalue='" + [i] + "'  lvalue='" + String.fromCharCode(i + 97) + "'class='quizMasterNext answer-title'>" + current.question.answers[i] + "</div></a>";
            }
            introHTML += "</div>";
            $("#contentkaart").html(introHTML);
//            displayDom.trigger('create');

		} else if(current.state === "complete") {
            console.log('complete');

            var submitVar = "";
            if(current.correct == data.questions.length){
                submitVar = "bewust";

                //droid
//                var media = new Media('/android_asset/www/resources/audio/clapping.wav');
                //ios
                var media = new Media('resources/audio/clapping.wav');

                media.play();

                vibrate();
            }else{
                submitVar = "onbewust";
            }

            $.ajax({
                type:'GET',
                url: 'http://school.ferdiduisters.nl/IA6mob/score.php',
                data: "action=newscore&score=" + submitVar + "&uuid=" + device.uuid,
                success:function(responseData){
                }
            });

            $.ajax({
                type:'GET',
                url: 'http://school.ferdiduisters.nl/IA6mob/score.php',
                data: "action=getscore",
                success:function(data2){
                    var data2 = data2.split(";");

                    var bewustPct = parseInt(data2[0]) / (parseInt(data2[0]) + parseInt(data2[1])) * 100;
                    var onbewustPct = 100 - parseInt(bewustPct);

                    introHTML = "<div class='answer-info'><img src='images/score_image.png' /></div><div class='text'><div class='text-header'>U heeft " + current.correct + " van de " + data.questions.length + " vragen goed.</div><p>U bent bewust bezig met de gezondheid van uw kind!</p><div class='text-header'>Scores van anderen</div><div class='scores-other'><div class='scores-other-single'><ul id='bars'><li>" +
                        "<div data-percentage='" + bewustPct + "' class='bar'></div><span>" + Math.floor(bewustPct) + "%</span></li></ul></div><div class='scores-other-single'><ul id='bars'><li>" +
                        "<div data-percentage='" + onbewustPct + "' class='bar'></div><span>" + onbewustPct + "%</span></li></ul></div></div><div class='scores-other'><div class='scores-other-single'><span class='subtitle'>Bewust</span></div><div class='scores-other-single'><span class='subtitle'>Minder bewust</span></div></div></div>";
                    $("#contentkaart").html(introHTML);

                    $("header").prepend("<a class='deelbuttonclass btn blue-button pull-right'>Deel</a>");
                    $("header").prepend("<a class='opnieuwButtonClass btn blue-button pull-left'>Opnieuw</a>");

                    $(".deelbuttonclass" ).each(function() {
                        $(this).on("click", function(){
                            window.plugins.socialsharing.share('Ik heb de KwisT Quiz gedaan, echt heel leuk! Ik had ' + current.correct + ' van de ' + data.questions.length + ' vragen goed.');
                        });
                    });

                    $(".opnieuwButtonClass" ).each(function() {
                        $(this).on("click", function(){
                            location.reload();
                        });
                    });

                    $(".balloon").remove();
                    $("body").prepend("<div class='balloon'>Score " + current.correct + "</div>");

                    $("#bars li .bar").each( function( key, bar ) {
                        var percentage = $(this).data('percentage');
                        $(this).animate({
                            'height' : percentage + '%'
                        }, 1000);
                    });


                    var title = "gezondheid";
                    $.getJSON("http://nl.wikipedia.org/w/api.php?action=query&list=search&srprop=timestamp&srsearch="+title+"&format=json&callback=?", function(data) {
                        title = data['query']['search'][0]['title'];
                        $(".text-header:first").append("<p>Lees meer op Wikipedia over: <a onclick='window.open(\"http://nl.wikipedia.org/wiki/"+title+"\", \"_system\");' href='#' target='wikipedia'>"+title+"</a></p>");
                        //title = data['query']['search'][1]['title'];
                        //$("#contentkaart").append("<a href='http://nl.wikipedia.org/wiki/"+title+"' target='wikipedia'>Lees meer op Wikipedia: "+title+"</a>");

                    });
                    //displayDom.html(html).trigger('create');
                    removeUserStatus();
                    successCb(current);
                }
            });

		}

        $( ".quizMasterNext" ).each(function(index) {
            $(this).on("click", function(){
                nextHandler($(this));
            });
        });
        $( ".infoscherm" ).each(function(index) {
            $(this).on("click", function(){
                $("header").show();
            $(".content").html('<div id="contentkaart" class="card-new"></div>');
            $(".balloon").remove();
            $(".content").css('background-image', '');
            introHTML = "<div class='text'><br \><br \><br \>Kwist 't is een quiz om ouders van kinderen bewust te maken van overgewicht bij kinderen. Door een gezonde levensstijl kan overmatig overgewicht voorkomen worden. In deze quiz krijg je vragen over bepaalde situaties. Na elke vraag krijg je suggesties voor een goede levensstijl van je kind. <br \>De antwoorden die je geeft worden anoniem opgeslagen. Er wordt geen data van de gebruiker verzameld. <br \><br \>Kwist 't is gemaakt door Ferdi Duisters, Paul Poos en Bram Kersten, in opdracht van Fontys Hogescholen Eindhoven.<br \></div>";
            $("#contentkaart").html(introHTML);
            $("header").prepend("<a class='opnieuwButtonClass btn blue-button pull-left'>Klaar</a>");
                $(".opnieuwButtonClass" ).each(function() {
                    $(this).on("click", function(){
                        location.reload();
                    });
                });

                $("body").prepend("<div class='balloon'>Info</div>");

            //done
            //location.reload()
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