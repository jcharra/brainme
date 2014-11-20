Meteor.subscribe("games");
Meteor.subscribe("questions");

var SESSIONKEY_CURRENT_GAME = "currgame";

Router.route('/', function () {
    this.render('startpage');
});

Template.startpage.helpers({
    yourgames: function () {
        if (!Meteor.userId()) {
            return [];
        } else {
            var user = Meteor.user().username;
            return Games.find({
                $or: [
                    {player1: user},
                    {player2: user}
                ]});
        }
    }
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
    if (game.player1 == Meteor.user().username) {
        return game.answersP2.length % 3 == 0 && game.answersP1.length - game.answersP2.length <= 3;
    } else if (game.player2 == Meteor.user().username) {
        return game.answersP1.length % 3 == 0 && game.answersP1.length > game.answersP2.length;
    } else {
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
            var game_id = this.params._gameid;
            var game = Games.findOne({gameNumber: parseInt(game_id)});

            if (game && isPlayersTurn(game)) {
                var num_questions_answered;

                if (Meteor.user().username == game.player1) {
                    num_questions_answered = game.answersP1.length;
                    // insert dummy answer to disallow trying again by browser back/forward
                    game.answersP1.push(null);
                } else if (Meteor.user().username == game.player2) {
                    num_questions_answered = game.answersP2.length;
                    // same here, insert dummy
                    game.answersP2.push(null);
                } else {
                    throw new Meteor.Error("not-authorized");
                }

                Session.set(SESSIONKEY_CURRENT_GAME, game_id);

                return game.questions[num_questions_answered];
            } else {
                return {};
            }
        }
    });
});

Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});

Template.play.events({
        "click .answer": function (event) {
            var game_id = Session.get(SESSIONKEY_CURRENT_GAME);
            Meteor.call("setAnswer", game_id, Meteor.userId(), this.idx, event.target.text);
        }
});