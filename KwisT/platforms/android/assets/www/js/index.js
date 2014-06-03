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
        console.log('ONTVANGEN EVENT: ' + id);

        quizMaster.execute("http://ferdiduisters.nl/q1.json", ".quizdisplay", function(result) {
            console.log("SUCESS CB");
            console.dir(result);
        });
    }
};
