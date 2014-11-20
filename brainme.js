Games = new Mongo.Collection("games");
Questions = new Mongo.Collection("questions");
Category = new Mongo.Collection("categories");


var isPlayersTurn = function (game) {
    if (game.player1 == Meteor.user().username) {
        return game.answersP2.length % 3 == 0 && game.answersP1.length - game.answersP2.length <= 3;
    } else if (game.player2 == Meteor.user().username) {
        return game.answersP1.length % 3 == 0 && game.answersP1.length > game.answersP2.length;
    } else {
        return false;
    }
};

Meteor.methods({
    maxQID: function () {
        // Y u no work?!
        // var q = Questions.find({}, {sort: {"idx": -1}, limit: 1}).fetch();
        // return q.idx;
        return 6;
    },
    setAnswer: function(game_id, player_id, question_id, answer) {
        var game = Games.findOne(game_id);
        alert("Answer set in game "+game_id+" for player "+player_id+" in question "+question_id+" to '"+answer+"'");
    }
});

