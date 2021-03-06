ConcertParis = new Mongo.Collection('concertParis');


if (Meteor.isClient) {

  Meteor.call('getConcert', function (error, result1, result2) {
    if (error) {
      console.log("error", error);
    };
  });


  Template.concertParis.helpers({
    concertParis : function () {
      return ConcertParis.find().fetch();
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var cheerio = Meteor.npmRequire('cheerio');

    Meteor.methods({    
      getConcert: function () {
        var now = new Date();
        var annee   = now.getFullYear();
        var mois    = ('0'+(now.getMonth()+1)).slice(-2);
        var jour    = ('0'+(now.getDate())).slice(-2);

        result1 = Meteor.http.get("https://www.parisbouge.com/search?type=event&category=concert&date_start="+annee+"-"+mois+"-"+jour+"&date_end="+annee+"-"+mois+"-"+jour+"&page=1");
        $ = cheerio.load(result1.content);

        //Détermination du nombre de pages
        var nombreCarrés = $('#pb-main > div > div.col-xs-12.col-md-8.col-lg-8 > nav > ul.pagination.hidden-xs').children().length;
        var nombrePages;
        if (nombreCarrés === 4) {
          nombrePages = 2;
        } else if (nombreCarrés === 5) {
          nombrePages = 3;
        } else if (nombreCarrés === 6) {
          nombrePages = 4;
        } else if (nombreCarrés === 0) {
          nombrePages = 1;
        } else {
          nombrePages = $('#pb-main > div > div.col-xs-12.col-md-8.col-lg-8 > nav > ul.pagination.hidden-xs > li:nth-child(6) > a').text();
        }


        ConcertParis.remove({});

        for (var i = 1; i<= nombrePages; i++) {
          result2 = Meteor.http.get("https://www.parisbouge.com/search?type=event&category=concert&date_start="+annee+"-"+mois+"-"+jour+"&date_end="+annee+"-"+mois+"-"+jour+"&page="+i);
          $ = cheerio.load(result2.content);

          var nomConcert = [];
          var dates = [];
          var lieu = [];
          var genre =[];
          var image = [];
  

          $('div > div > h4 > a').each(function(j, elem) {
            nomConcert[j] = $(this).text().toUpperCase();
            $('div > div > ul > li.hidden-xs-').each(function(j, elem) {
              dates[j] = $(this).text();
            });
            $('div > div > ul > li:nth-child(3)').each(function(j, elem) {
              lieu[j] = $(this).text();
            });
            $('div > div > ul > li:nth-child(2) > span').each(function(j, elem) {
              genre [j] = $(this).text();
            });
            $('div > figure > a > img').each(function(j, elem) {
              image[j] = $(this).attr('src'); 
            });

            var row = {};
            row["nomConcert"] = nomConcert [j];
            row["dates"] = dates [j];
            row["lieu"] = lieu [j];
            row["genre"] = genre [j];
            row["image"] = image [j];
            ConcertParis.insert(row);
          });
        }

        return nomConcert;
      }
    })
  });
}
