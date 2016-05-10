Velibs_Paris = new Mongo.Collection('velibs');

if (Meteor.isClient) {

  Meteor.call('getVelibs', function (error, result) {
    if (error) {
      console.log("error", error);
    };
  });

  Template.velibs.helpers({
    velibs: function () {
      return Velibs_Paris.find();
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var cheerio = Meteor.npmRequire('cheerio');

    Meteor.methods({    
      getVelibs: function () {       

        result = Meteor.http.get("http://opendata.paris.fr/explore/dataset/stations-velib-disponibilites-en-temps-reel/table/?dataChart=eyJxdWVyaWVzIjpbeyJjb25maWciOnsiZGF0YXNldCI6InN0YXRpb25zLXZlbGliLWRpc3BvbmliaWxpdGVzLWVuLXRlbXBzLXJlZWwiLCJvcHRpb25zIjp7fX0sImNoYXJ0cyI6W3sidHlwZSI6ImxpbmUiLCJmdW5jIjoiQVZHIiwieUF4aXMiOiJudW1iZXIiLCJjb2xvciI6InJhbmdlLUFjY2VudCJ9XSwieEF4aXMiOiJsYXN0X3VwZGF0ZSIsIm1heHBvaW50cyI6IiIsInRpbWVzY2FsZSI6InllYXIiLCJzb3J0IjoiIiwic2VyaWVzQnJlYWtkb3duIjoibnVtYmVyIn1dLCJ0aW1lc2NhbGUiOiJ5ZWFyIn0%3D&location=11,48.86082,2.35083");
        $ = cheerio.load(result.content);       

        var nomStation = [];
        var adresseStation = [];
        var locationStation = [];
        var statuts = [];
        var rangements = [];
        var rangementsDispo = [];
        var velibsDispo = [];

        Velibs_Paris.remove({});


        $('td:nth-child(3) > div').each(function(i, elem) {
        	nomStation[i] = $(this).text();
            $('td:nth-child(4) > div').each(function(i, elem) {
            	adresseStation[i] = $(this).text();
            });
            $('td:nth-child(5) > div').each(function(i, elem) {
            	locationStation[i] = $(this).text();
            });
           	$('td:nth-child(8) > div').each(function(i, elem) {
               	statuts[i] = $(this).text();
            });
            $('td:nth-child(10) > div').each(function(i, elem) {
                rangements[i] = $(this).text();
            });
            $('td:nth-child(11) > div').each(function(i, elem) {
                rangementsDispo[i] = $(this).text();
            });
            $('td:nth-child(12) > div').each(function(i, elem) {
                velibsDispo[i] = $(this).text();
            });

          	var row = {};

          	row["nomStation"] = nomStation [i];
          	row["adresseStation"] = adresseStation [i];
          	row["locationStation"] = locationStation [i];
          	row["statuts"] = statuts [i];
          	row["rangements"] = rangements [i];
          	row["rangementsDispo"] = rangementsDispo [i];
          	row["velibsDispo"] = velibsDispo [i];
          	Velibs_Paris.insert(row);
        });

        return nomStation;
      }
    })
  });
}