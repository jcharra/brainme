Games = new Mongo.Collection("games");
Questions = new Mongo.Collection("questions");
Category = new Mongo.Collection("categories");


Meteor.methods({
    maxQID: function () {
        // Y u no work?!
        // var q = Questions.find({}, {sort: {"idx": -1}, limit: 1}).fetch();
        // return q.idx;
        return 6;
    }
});

