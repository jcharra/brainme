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
        return 8;
    },

    /*
    Set answer appends the given answer to the player's array of answers
    for the game's questions.
    Returns a boolean indicating the correctness of the answer.
     */
    setAnswer: function(game_id, player_name, question_id, answer) {
        if (!Meteor.user() || Meteor.user().username != player_name) {
            throw new Meteor.Error("not-authorized");
        } else {
            // alert("Answer set in game "+game_id+" for player "+player_name+" in question "+question_id+" to '"+answer+"'");
            var game = Games.findOne(game_id);
            var answers = (player_name == game.player1) ? game.answersP1 : game.answersP2;

            // this relies on the last answer being set to null. Cf. client "play" view:
            // a placeholder value is immediately inserted into the "answers" array, to
            // mark this question as attempted. Later, this placeholder must be replaced
            // with the actual answer.
            var placeholder = answers.pop();
            if (placeholder) {
                console.error("Popped an answer which must not be null: "+placeholder);
            } else {
                answers.push(answer);
                // A little inefficient ... must find question with given ID first.
                for (var i = 0; i < 4; i++) {
                    if (game.questions[i].idx == question_id) {
                        // Found the question => since the first answer is always the
                        // correct one by convention, return whether it corresponds
                        // to the given one.
                        return game.questions[i].answers[0] == answer;
                    }
                }
                console.error("Game ID "+game_id+" does not contain question with ID "+question_id);
                return false;
            }
        }
    }
});

