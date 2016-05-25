
var fs = require('fs');
var express = require('express');
//var Client = require('node-rest-client').Client;
var MongoClient = require('mongodb').MongoClient;

var connectionString = "mongodb://52.40.11.174," +
    "52.39.141.85," +
    "52.26.169.163" +
    "/part2finals" +
    "?readPreference=secondary&" +
    "w=2&" +
    "wtimeoutMS=2000&" +
    "connectTimeoutMS=5000&" +
    "replicaSet=kjCluster";

var app = express();
var assert = require("assert");
var options = {server: {reconnectInterval:50, reconnectTries:5}};

app.use(express.bodyParser());
app.use("/images", express.static(__dirname + '/images'));

var all_get = function (req, res) {
    console.log( "Get: ..." ) ;

    body = fs.readFileSync('./index.html');
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    console.log("request data")
    
    MongoClient.connect(connectionString, options, function(err, db) {
        assert.equal(null, err);
        assert.ok(db != null);

        db.collection("part2finals").find().limit(1).toArray(function(err, docs) {
            assert.equal(null, err);
            assert.equal(1, docs.length);

            console.log(docs);
            data = docs[0];
            db.close();

            message = data.msg
            console.log( " message is = " + message) ;

            var html_body = "" + body ;
            var html_body = html_body.replace("{message}", "Hello world" );

            res.end( html_body );
        });
    });
};

app.set('port', (process.env.PORT || 3000));

//app.post("*", handle_post );
app.get( "*", all_get ) ;

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
