ResultatsFoot = new Mongo.Collection('resultatsFoot');


if (Meteor.isClient) {

  Meteor.call('getFoot', function (error, result) {
    if (error) {
      console.log("error", error);
    };
  });


  Template.resultatsFoot.helpers({
    resultatsFoot : function () {
      return ResultatsFoot.find().fetch();
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var cheerio = Meteor.npmRequire('cheerio');

    Meteor.methods({    
      getFoot: function () {
       
        result = Meteor.http.get("http://www.lequipe.fr/Football/Directs  ");
        $ = cheerio.load(result.content);


        // var nomChampionnat = [];
        // var drapeauChampionnat = [];
        // var numeroJournee = [];
        var logoClub1 = [];
        var logoClub2 = [];
        var nomClub1 = [];
        var nomClub2 = [];
        var scoreClub1 = [];
        var scoreClub2 = [];
        var temps = [];

        ResultatsFoot.remove({});

          // $('div.event__logo > img').each(function(i, elem) {
          //   drapeauChampionnat[i] = $(this).Image();
          // });
          // $('span').each(function(i, elem) {
          //     nomChampionnat[i] = $(this).text();
          //     $('a').each(function(i, elem) {
          //       numeroJournee[i] = $(this).text();
          //     });

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
          //row["Drapeau Championnat"] = greve [i];
          //row["numeroJournee"] = numeroJournee [i];
          row["nomClub1"] = nomClub1 [i];
          row["nomClub2"] = nomClub2 [i];
          row["logoClub1"] = logoClub1 [i];
          row["logoClub2"] = logoClub2 [i];
          row["scoreClub1"] = scoreClub1 [i];
          row["scoreClub2"] = scoreClub2 [i];
          ResultatsFoot.insert(row);
            });

        return nomClub1;
      }
    })
  });
}