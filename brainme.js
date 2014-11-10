Games = new Mongo.Collection("games");
Questions = new Mongo.Collection("questions");
Category = new Mongo.Collection("categories");

if (Meteor.isClient) {
    Meteor.subscribe("games");
    Meteor.subscribe("questions");

    Router.route('/', function () {
        this.render('startpage', {
            data: function() {
                if (!Meteor.userId()) {
                    return [];
                } else {
                    // TODO: restrict to logged-in player
                    return Games.find({});
                }
            }
        });
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

    var isPlayersTurn = function (game) {
        console.error("Game is " + game);
        if (game.player1 == Meteor.user().username) {
            console.error("player 1: "+ (game.answersP2.length % 3 == 0 && game.answersP1.length - game.answersP2.length <= 3));
            return game.answersP2.length % 3 == 0 && game.answersP1.length - game.answersP2.length <= 3;
        } else if (game.player2 == Meteor.user().username) {
            console.error("player 2");
            return game.answersP1.length % 3 == 0 && game.answersP1.length > game.answersP2.length;
        } else {
            console.error("NO player");
            return false;
        }
    };


    Template.game.helpers({
        yourturn: function () {
            return isPlayersTurn(this);
        }
    });

    Router.route('/game/:_gameid/play', function () {
        this.render('play', {
            data: function () {
                var game = Games.findOne({gameNumber: parseInt(this.params._gameid)});
                console.error("Game is "+ game);
                if (game && isPlayersTurn(game)) {
                    var num_questions_answered;
                    if (Meteor.user().username == game.player1) {
                        num_questions_answered = game.answersP1.length;
                    } else if (Meteor.user().username == game.player2) {
                        num_questions_answered = game.answersP2.length;
                    } else {
                        throw new Meteor.Error("not-authorized");
                    }
                    return game.questions[num_questions_answered];
                } else {
                    return {};
                }
            }
        });
    });

    Template.startpage.helpers({
        games: function () {
            if (Meteor.userId()) {
                return Games.find({player1: Meteor.user().username});
            } else {
                return {};
            }
        }
    });

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
}

Meteor.methods({
    maxQID: function () {
        // Y u no work?!
        // var q = Questions.find({}, {sort: {"idx": -1}, limit: 1}).fetch();
        // return q.idx;
        return 6;
    }
});

if (Meteor.isServer) {
    Games.remove({});
    Questions.remove({});

    var players = ["Joe", "Pete", "Mary", "Alice", "Mike", "Sue"];

    Questions.insert({
        idx: 1,
        text: "Was ist die Hauptstadt von Deutschland?",
        answers: ["Prag", "Berlin", "Bonn", "Denzlingen"],
        correct: 1,
        category: "geography"
    });

    Questions.insert({
        idx: 2,
        text: "Was ist die Hauptstadt der Schweiz?",
        answers: ["Prag", "Bern", "Paris", "Basel"],
        correct: 1,
        category: "geography"
    });

    Questions.insert({
        idx: 3,
        text: "Was ist die Hauptstadt von Frankreich?",
        answers: ["Paris", "Bordeaux", "Cannes", "Marseille"],
        correct: 0,
        category: "geography"
    });

    Questions.insert({
        idx: 4,
        text: "Was ist die Hauptstadt von England?",
        answers: ["Prag", "Berlin", "Bonn", "London"],
        correct: 3,
        category: "geography"
    });

    Questions.insert({
        idx: 5,
        text: "Was ist die Hauptstadt von Spanien?",
        answers: ["Prag", "Madrid", "Bonn", "Denzlingen"],
        correct: 1,
        category: "geography"
    });

    Questions.insert({
        idx: 6,
        text: "Was ist die Hauptstadt von Argentinien?",
        answers: ["Prag", "Madrid", "Buenos Aires", "Denzlingen"],
        correct: 2,
        category: "geography"
    });

    Questions.insert({
        idx: 7,
        text: "Was ist ein beliebtes Getränk unter Schachspielern?",
        answers: ["Gestrecktes Achtel", "Geschenktes Viertel", "Gespritzte Halbe", "Gelungene Ganze"],
        correct: 2,
        category: "chess"
    });


    var num_questions = Meteor.call("maxQID");

    var selectQuestions = function (amount) {
        var qs = [];
        for (var i = 0; i < Math.min(amount, num_questions); i++) {
            while (true) {
                var qid = Math.ceil(Math.random() * num_questions);
                var q = Questions.findOne({"idx": qid});
                if (q && qs.indexOf(q) == -1) {
                    qs.push(q);
                    break;
                }
            }
        }
        return qs;
    };

    var gameID = 0;

    for (var i = 0; i < players.length - 1; i++) {
        for (var j = i + 1; j < players.length; j++) {
            Games.insert({
                player1: players[i],
                player2: players[j],
                started: new Date(),
                questions: selectQuestions(6),
                answersP1: [],
                answersP2: [],
                gameNumber: gameID++
            })
        }
    }


    Meteor.publish("games", function () {
        return Games.find({});
    });

    Meteor.publish("questions", function () {
        return Questions.find({});
    });
}