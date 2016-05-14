ExposLille = new Mongo.Collection('exposLille');


if (Meteor.isClient) {

  Meteor.call('getExpoLille', function (error, result1, result2) {
    if (error) {
      console.log("error", error);
    };
  });


  Template.exposLille.helpers({
    exposLille : function () {
      return ExposLille.find().fetch();
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var cheerio = Meteor.npmRequire('cheerio');

    Meteor.methods({    
      getExpoLille: function () {
        
        result1 = Meteor.http.get("http://www.lille.fr/Evenements/(when)/today/(type)/538");
        $ = cheerio.load(result1.content);
        var nombreCarrés = $('#skiptocontent > div.content.contentFull > section > div.pagination').children().length;
        var nombrePages;
        if  (nombreCarrés === 0) {
          nombrePages = 1;
        } else if (nombreCarrés === 4) {
          nombrePages = 2;
        } else if (nombreCarrés === 5) {
          nombrePages = 3;
        } else {
          nombrePages = 4;
        } 
        ExposLille.remove({});

        for (var i = 0; i<= (nombrePages-1); i++) {
          result2 = Meteor.http.get("http://www.lille.fr/Evenements/(offset)/"+i+"0/(when)/today/(type)/538");
          $ = cheerio.load(result2.content);

          var nomExpo = [];
          var type = [];
          var description = [];
          var dates = [];
          var lieu = [];
          var image = [];
  

          $('div.right > span.actuTitle > a').each(function(j, elem) {
            nomExpo[j] = $(this).text().toUpperCase();
            $('div.right > p.event-type > strong').each(function(j, elem) {
              type[j] = $(this).text();
            });
            $('div.right > p.innerContent').each(function(j, elem) {
              description[j] = $(this).text();
            });
            $('div.rechercheInfo > div.dateInfo > p').each(function(j, elem) {
              dates[j] = $(this).text();
            });
            $('div.rechercheInfo > div.contactInfo > div > p').each(function(j, elem) {
              lieu[j] = $(this).text();
            });
            $('figure > img').each(function(j, elem) {
              image[j] = $(this).attr('src'); 
            });

            var row = {};
            row["nomExpo"] = nomExpo [j];
            row["type"] = type [j];
            row["description"] = description [j];
            row["dates"] = dates [j];
            row["lieu"] = lieu [j];
            row["image"] = image [j];
            ExposLille.insert(row);
          });
        }

        return nomExpo;
      }
    })
  });
}
