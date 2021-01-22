
var express = require('express');
var http = require('http');
var uuid = require('uuid');

const Player = require('./player.js')
const Vector2 = require('./vector2.js')
const Bullet = require('./bullet.js');
const { exit } = require('process');

var app = express();
var server = http.createServer(app);
var loopFrequency = 1 / 60; // in Hz

var io = require('socket.io')(server,  {
  cors: {
    origins: ['http://localhost:*']
  }
});


var colors = ["#E52B50","#FFBF00","#9966CC","#6c4bbf","#50C878"];

io.on('connection', (socket) => {
  
  var player;
  updatePlayerInfo();

  socket.on('join', (name) => {

    var pos = new Vector2(300,300)
    var color = colors[players.length % colors.length];
    var id = uuid.v1();

    player = new Player(pos,color,name,id);
    socket.join(id);

    players.push(player);
  
    updatePlayerInfo();
    console.log("new user  --> #player: " + players.length.toString())
  
  });

  socket.on('disconnect', () => {
    const index = players.indexOf(player);
    if (index > -1) {
      players.splice(index, 1);
    }
    updatePlayerInfo();


    console.log("user left --> #player: " + players.length.toString())
  });

  socket.on('key_change', function(pressed_keys){
    if(player != undefined){
      player.setPressedKeys(pressed_keys);
    }
  });

  socket.on('shoot', () => {
    if(player != undefined){
      var bullet = new Bullet(player);
      bullets.push(bullet);
    }
  });

});

function getPlayerById(id){

  for(var i = 0; i < players.length; i++){
    if(players[i].id === id){
      return players[i]
    }
  }

  return null;
}

setInterval(loop, loopFrequency * 1000);

server.listen(3500, () => {
  console.log('Server listening on:3500');
});


var players = [];
var bullets = [];

function updatePlayerInfo(){
  players_json = [];

  players.forEach(function(player){
    players_json.push(player.getFullJson());
  });

  console.log(players_json);

  io.emit('player_info',players_json);
}

function loop(){

  players_json = [];

  // update player 

  players.forEach(function(player){
    var keys = player.keys;

    keys.forEach(function(key){
      if(key == "w"){
        player.foreward(loopFrequency);
      }
  
      if(key == "a"){
        player.rotateLeft(loopFrequency);
      }
  
      if(key == "d"){
        player.rotateRight(loopFrequency);
      }
    });

    players_json.push(player.getJson());
  });

  // update bullets

  bullets_json = [];
  bullets_to_remove = [];

  players_to_remove = [];

  bullets.forEach(function(bullet){
    if(bullet.isLivetimeOver()){
      bullets_to_remove.push(bullet);
    }
    else if(bullet.isActive()){
      players.forEach(function(player){
        if(player.isHitByBullet(bullet)){
          bullets_to_remove.push(bullet);
          if(player.dead){
            playerKiller = getPlayerById(bullet.playerId);
            if(player.id != playerKiller.id){
              playerKiller.points += 1;
            }

            players_to_remove.push(player);
            io.in(player.id).emit("dead",true);
            

          }

          updatePlayerInfo();

        }
      });
    }

    bullet.foreward(loopFrequency)
    bullets_json.push(bullet.getJson())
  });

  bullets_to_remove.forEach(function(bullet_to_remove){
    const index = bullets.indexOf(bullet_to_remove);
    if (index > -1) {
      bullets.splice(index, 1);
    }
  });

  players_to_remove.forEach(function(player_to_remove){
    const index = players.indexOf(player_to_remove);
    if (index > -1) {
      players.splice(index, 1);
    }
    updatePlayerInfo();
  });

  var position_json = {
    "players": players_json,
    "bullets": bullets_json
  }
  //console.log(position_json);
  io.emit('position_message',position_json);
}
