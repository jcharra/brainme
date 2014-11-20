
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

Questions.insert({
    idx: 8,
    text: 'Welches ist das "most-awesome" JavaScript-Framework?',
    answers: ["<?php >", "HL-ActionFramework", "Ember.js", "Meteor"],
    correct: 4,
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
