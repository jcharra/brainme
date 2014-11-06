Games = new Mongo.Collection("games");

if (Meteor.isClient) {
    Router.route('/', function () {
        this.render('startpage');
    });

    Router.route('/findOpponent', function () {
        this.render('searchingOpponent');
    });

    Router.route('/game/:_gameid', function () {
        this.render('game', {
            data: function () {
                return Games.findOne({gameNumber: parseInt(this.params._gameid)});
            }
        });
    });

    Template.startpage.helpers({
        games: function () {
            if (Meteor.userId()) {
                return Games.find({player1: Meteor.user().username});
            }
        }
    });

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
