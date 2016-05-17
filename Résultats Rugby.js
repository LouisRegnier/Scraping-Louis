ResultatsRugby = new Mongo.Collection('resultatsRugby');


if (Meteor.isClient) {

  Meteor.call('getRugby', function (error, result) {
    if (error) {
      console.log("error", error);
    };
  });


  Template.resultatsRugby.helpers({
    resultatsRugby : function () {
      return ResultatsRugby.find().fetch();
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var cheerio = Meteor.npmRequire('cheerio');

    Meteor.methods({    
      getRugby: function () {
       
        result = Meteor.http.get("http://www.lequipe.fr/Rugby/Directs  ");
        $ = cheerio.load(result.content);

        var logoClub1 = [];
        var logoClub2 = [];
        var nomClub1 = [];
        var nomClub2 = [];
        var scoreClub1 = [];
        var scoreClub2 = [];
        var temps = [];

        ResultatsRugby.remove({});


              $('div:nth-child(2) > div.concurr.ek1 > div.nom').each(function(i, elem) {
                nomClub1[i] = $(this).text();
                $('div:nth-child(2) > div.concurr.ek1 > div.logo > img').each(function(i, elem) {
                  logoClub1[i] = $(this).attr('src');
                });
                $('div:nth-child(4) > div.concurr.ek2 > div.nom').each(function(i, elem) {
                  nomClub2[i] = $(this).text();
                });
                $('div:nth-child(2) > div.concurr.ek1 > div.logo > img').each(function(i, elem) {
                  logoClub2[i] = $(this).attr('src');
                });
                $('div.sco > div.sc1').each(function(i, elem) {
                  scoreClub1[i] = $(this).text();
                });
                $('div.sco > div.sc2').each(function(i, elem) {
                  scoreClub2[i] = $(this).text();
                });
                $('div.sco > div.min').each(function(i, elem) {
                  temps[i] = $(this).text();
                });

          var row = {};

          row["nomClub1"] = nomClub1 [i];
          row["nomClub2"] = nomClub2 [i];
          row["logoClub1"] = logoClub1 [i];
          row["logoClub2"] = logoClub2 [i];
          row["scoreClub1"] = scoreClub1 [i];
          row["scoreClub2"] = scoreClub2 [i];
          row["temps"] = temps [i];
          ResultatsRugby.insert(row);
            });

        return nomClub1;
      }
    })
  });
}