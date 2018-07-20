console.log('Bot is starting');

var Twit = require('twit');
var config = require('./config');

//sets up twit and stream with API keys in config
var T = new Twit(config);
var stream = T.stream('user');

//sends a tweet
function tweet(msg){
  var message = ''+msg;
  T.post('statuses/update',{status: message}, function(err, data, response) {
  console.log('-')
  console.log(data)
})};

//latest tweet with #banter is sent a tweet
function tweetOfTheDay(){
  T.get('search/tweets', { q: '#banter', count: 1 }, function(err, data, response) {
  var tweets = data.statuses;
  var target = tweets[0].user.screen_name;
  tweet('@'+target+' is the banterous lord of the day!');
})}

//when someone follows, sends a reply and follows them
function whenFollowed(followEvent){
  var handle = followEvent.source.screen_name;
  if(handle != 'BotMort'){
    tweet('@'+handle+' is my new best friend');
  }
  var target = followEvent.source.id_str;
  T.post('friendships/create', { id: target }, function(err,data,response){
    console.log(data)
  });
}

tweetOfTheDay();

//sends tweetOfTheDay once a day
setInterval(tweetOfTheDay,1000*60*60*24);

//when someone follows; execute whenFollowed
stream.on('follow',whenFollowed);
