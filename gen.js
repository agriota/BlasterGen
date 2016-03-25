  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext('2d');
  canvas.width = 800;
  canvas.height = 800;
  document.body.appendChild(canvas);


function showGen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  //Generate 4 mine positions
  //possible mine spawns in polar coordinates
  var mines = (function() {
    var minespawns = [[0,0],[100,22.5],[100,67.5],[100,112.5],[100,157.5],[100,202.5],[100,247.5],
    [100,292.5],[100,337.5], [200.0,22.5],[200.0,67.5],[200.0,112.5],[200.0,157.5],[200.0,202.5],
    [200.0,247.5],[200.0,292.5],[200.0,337.5]]

    var spots = []
    while (spots.length < 4) {
      var sp = Math.floor(Math.random() * 17)
      if (spots.indexOf(sp) === -1)
        spots.push(sp);
    }

    return spots.map(function(spot) {
      var p = minespawns[spot]
      var point = coords(p[0], p[1]);
      return [point[0] + 400, point[1] + 400]
    });
  })();
  // Generate 5 player positions (since melee are always on boss) that aren't too
  // close to each other or the mines
  var players = (function() {
    var list = []
    while (list.length < 5) {
      var pos = coords(Math.random() * 280, Math.random() * 360);
      pos = [pos[0]+400, pos[1]+400];

      if (mines.every(function(mine){return dist(mine, pos) > 150}) && list.every(function(player){return dist(player, pos) > 100}))
        list.push(pos);
    }
    return list;
  })();

  //compute lines between each player
  //Draw everything
  //arena
  ctx.beginPath();
  ctx.arc(400,400,300,0, 2*Math.PI);
  ctx.closePath();
  ctx.stroke();

  //mines
  var mcolor = true;
  mines.forEach(function(mine) {
    ctx.beginPath();
    ctx.arc(mine[0],mine[1],75,0,2*Math.PI);
    ctx.closePath();
    ctx.stroke();

    if (mcolor)
      ctx.fillStyle = "rgba(255,0,0,0.5)";
    else
      ctx.fillStyle = "rgba(0,0,255,0.5)";

    mcolor = !mcolor;
    ctx.fill();
  });

  //player lines
  ctx.lineWidth = "35"
  ctx.strokeStyle = "rgba(255,50,100,0.75)"
  for(var i = 0; i < 5; i++) {
    p1 = players[i]

    for (var j = i; j < 5; j++) {
      var p2 = players[j];
      //calculate start point?
      var ps = [p1,p2].sort();
      var m = (ps[1][1] - ps[0][1]) / (ps[1][0] - ps[0][0]);
      var b = p1[1] - p1[0] * m;
      ctx.beginPath();
      ctx.moveTo(0, b);
      ctx.lineTo(800, 800 * m + b)
      ctx.closePath();
      ctx.stroke();
    }
  }

  ctx.fillStyle = "rgba(0,200,0,1)"
  ctx.lineWidth = "1"
  ctx.strokeStyle = "black"

  players.forEach(function(p1) {
    ctx.beginPath();
    ctx.arc(p1[0],p1[1],20,0,2*Math.PI);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  });

  //erase outside the circle
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(400,400,300,0,Math.PI*2, false);
  ctx.arc(400,400,1000,0,Math.PI*2,true);
  ctx.closePath();
  ctx.fill();


  //conversion from polar to rectangular coordinates
  function coords(r, th) {
    theta = Math.PI * th / 180.
    x = Math.round(r * Math.cos(theta))
    y = Math.round(r * Math.sin(theta))
    return [x,y]
  }

  function dist(p1, p2) {
    var difx = p1[0] - p2[0];
    var dify = p1[1] - p2[1];
    return Math.sqrt(Math.pow(difx, 2) + Math.pow(dify, 2));
  }
}

showGen();
