SpectaclesParis = new Mongo.Collection('spectaclesParis');


if (Meteor.isClient) {

  Meteor.call('getSpectacle', function (error, result1, result2) {
    if (error) {
      console.log("error", error);
    };
  });


  Template.spectaclesParis.helpers({
    spectaclesParis : function () {
      return SpectaclesParis.find().fetch();
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var cheerio = Meteor.npmRequire('cheerio');

    Meteor.methods({    
      getSpectacle: function () {
        var now = new Date();
        var annee   = now.getFullYear();
        var mois    = ('0'+(now.getMonth()+1)).slice(-2);
        var jour    = ('0'+(now.getDate())).slice(-2);

        result1 = Meteor.http.get("https://www.parisbouge.com/search?type=event&category=spectacle&date_start="+annee+"-"+mois+"-"+jour+"&date_end="+annee+"-"+mois+"-"+jour+"&page=1");
        $ = cheerio.load(result1.content);
        var nombrePages = $('#pb-main > div > div.col-xs-12.col-md-8.col-lg-8 > nav > ul.pagination.hidden-xs > li:nth-child(6) > a').text();
        SpectaclesParis.remove({});

        for (var i = 1; i<= nombrePages; i++) {
          result2 = Meteor.http.get("https://www.parisbouge.com/search?type=event&category=spectacle&date_start="+annee+"-"+mois+"-"+jour+"&date_end="+annee+"-"+mois+"-"+jour+"&page="+i);
          $ = cheerio.load(result2.content);

          var nomSpectacle = [];
          var dates = [];
          var lieu = [];
          var genre =[];
          var image = [];
  

          $('div > div > h4 > a').each(function(j, elem) {
            nomSpectacle[j] = $(this).text().toUpperCase();
            $('div > div > ul > li.hidden-xs-').each(function(j, elem) {
              dates[j] = $(this).text();
            });
            $('div > div > ul > li:nth-child(3)').each(function(j, elem) {
              lieu[j] = $(this).text();
            });
            $('div > div > ul > li:nth-child(2) > span').each(function(j, elem) {
              genre[j] = $(this).text();
            });
            $('div > figure > a > img').each(function(j, elem) {
              image[j] = $(this).attr('src'); 
            });

            var row = {};
            row["nomSpectacle"] = nomSpectacle [j];
            row["dates"] = dates [j];
            row["lieu"] = lieu [j];
            row["genre"] = genre [j];
            row["image"] = image [j];
            SpectaclesParis.insert(row);
          });
        }

        return nomSpectacle;
      }
    })
  });
}
