Games = new Mongo.Collection("games");
Questions = new Mongo.Collection("questions");
Category = new Mongo.Collection("categories");

if (Meteor.isClient) {
    Meteor.subscribe("games");

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

    Template.game.helpers({
        yourturn: function () {
            if (this.player1 == Meteor.user().username) {
                return this.answers2.length % 3 == 0 && this.answers1.length - this.answers2.length <= 3;
            } else {
                return this.answers1.length % 3 == 0 && this.answers1.length > this.answers2.length;
            }
        }
    });

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
}

if (Meteor.isServer) {
    Games.remove({});
    Questions.remove({});

    var players = ["Joe", "Pete", "Mary", "Alice", "Mike", "Sue"];
    var gameID = 0;

    for (var i = 0; i < players.length - 1; i++) {
        for (var j = i + 1; j < players.length; j++) {
            Games.insert({
                player1: players[i],
                player2: players[j],
                started: new Date(),
                questions: [],
                answersP1: [],
                answersP2: [],
                gameNumber: gameID++
            })
        }
    }

    Questions.insert({
        text: "Was ist die Hauptstadt von Deutschland?",
        answers: ["Prag", "Berlin", "Bonn", "Denzlingen"],
        correct: 1,
        category: "geography"
    });

    Questions.insert({
        text: "Was ist die Hauptstadt der Schweiz?",
        answers: ["Prag", "Bern", "Paris", "Basel"],
        correct: 1,
        category: "geography"
    });

    Questions.insert({
        text: "Was ist die Hauptstadt von Frankreich?",
        answers: ["Paris", "Bordeaux", "Cannes", "Marseille"],
        correct: 0,
        category: "geography"
    });

    Questions.insert({
        text: "Was ist die Hauptstadt von England?",
        answers: ["Prag", "Berlin", "Bonn", "London"],
        correct: 3,
        category: "geography"
    });

    Questions.insert({
        text: "Was ist die Hauptstadt von Spanien?",
        answers: ["Prag", "Madrid", "Bonn", "Denzlingen"],
        correct: 1,
        category: "geography"
    });

    Meteor.publish("games", function () {
        return Games.find({});
    });

    Meteor.publish("questions", function () {
        return Questions.find({});
    });
}