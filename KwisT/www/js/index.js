var app = {
    initialize: function() {
        console.log(' test');
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

        quizMaster.execute("q1.json", ".quizdisplay", function(result) {
            console.log("SUCESS CB");
            console.dir(result);
        });
    }
};
