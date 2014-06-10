var app = {
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    receivedEvent: function(id) {

        if (hasConnection())
        {
            quizMaster.execute("http://school.ferdiduisters.nl/IA6mob/jsongenerator.json", ".quizdisplay", function(result) {
                console.log("SUCESS CB");
                console.dir(result);
            });
        }
        else
        {
            vibrate();

            $(".balloon").remove();
            $("body").prepend("<div class='balloon'>Error</div>");

            $("#contentkaart").html("<div class='text question-text'><p>U heeft geen werkende internetverbinding.</p>" +
                "<p>Start de app opnieuw op met een werkende internetverbinding om verder te gaan.</p>" +
                "<a class='btn blue-button' onclick='location.reload()'>Herladen</a>" +
                "</div>");

        }

    }
};

function vibrate()
{
    navigator.notification.vibrate();
}

function hasConnection() {
    var networkState = navigator.connection.type;

    if (networkState == 'none')
    {
        return false;
    }
    else
    {
        return true;
    }
}
