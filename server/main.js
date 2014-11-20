
Games.remove({});
Questions.remove({});

var players = ["Joe", "Pete", "Mary", "Alice", "Mike", "Sue"];

Questions.insert({
    idx: 1,
    text: "Was ist die Hauptstadt von Deutschland?",
    answers: ["Berlin", "Prag", "Bonn", "Denzlingen"],
    category: "geography"
});

Questions.insert({
    idx: 2,
    text: "Was ist die Hauptstadt der Schweiz?",
    answers: ["Bern", "Paris", "Basel", "Prag"],
    category: "geography"
});

Questions.insert({
    idx: 3,
    text: "Was ist die Hauptstadt von Frankreich?",
    answers: ["Paris", "Bordeaux", "Cannes", "Marseille"],
    category: "geography"
});

Questions.insert({
    idx: 4,
    text: "Was ist die Hauptstadt von England?",
    answers: ["London", "Prag", "Berlin", "Bonn"],
    category: "geography"
});

Questions.insert({
    idx: 5,
    text: "Was ist die Hauptstadt von Spanien?",
    answers: ["Madrid", "Bonn", "Denzlingen", "Prag"],
    category: "geography"
});

Questions.insert({
    idx: 6,
    text: "Was ist die Hauptstadt von Argentinien?",
    answers: ["Buenos Aires", "Prag", "Madrid", "Denzlingen"],
    category: "geography"
});

Questions.insert({
    idx: 7,
    text: "Was ist ein beliebtes Getränk unter Schachspielern?",
    answers: ["Gespritzte Halbe", "Gestrecktes Achtel", "Geschenktes Viertel", "Gelungene Ganze"],
    category: "chess"
});

Questions.insert({
    idx: 8,
    text: 'Welches ist das "most-awesome" JavaScript-Framework?',
    answers: ["Meteor", "<?php >", "HL-ActionFramework", "Ember.js"],
    category: "programming"
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
