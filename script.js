(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  let running = true;
  let score = 0;
  let speed = 4;

  const player = { x: 50, y: H - 40, w: 44, h: 44, vy: 0, grounded: true };
  const gravity = 0.8;

  const cacti = [];
  let spawnTimer = 0;

  function reset(){
    running = true;
    score = 0;
    speed = 4;
    player.y = H - 40;
    player.vy = 0;
    player.grounded = true;
    cacti.length = 0;
    spawnTimer = 0;
  }

  function spawnCactus(){
    const h = 30 + Math.random()*30;
    cacti.push({ x: W + 20, y: H - h - 10, w: 18, h: h });
  }

  function update(){
    if(!running) return;
    // physics
    player.vy += gravity;
    player.y += player.vy;
    if(player.y >= H - player.h - 10){ player.y = H - player.h - 10; player.vy = 0; player.grounded = true; }

    // spawn
    spawnTimer -= 1;
    if(spawnTimer <= 0){ spawnCactus(); spawnTimer = 60 + Math.random()*80; }

    // move cacti
    for(let i=cacti.length-1;i>=0;i--){
      const c = cacti[i];
      c.x -= speed;
      if(c.x + c.w < 0) cacti.splice(i,1);
      // collision
      if(rectIntersect(player.x, player.y, player.w, player.h, c.x, c.y, c.w, c.h)){
        running = false;
      }
    }

    // difficulty
    score += 0.1;
    if(Math.floor(score) % 100 === 0) speed = 4 + Math.floor(score/100);
  }

  function rectIntersect(x1,y1,w1,h1,x2,y2,w2,h2){
    return x1 < x2+w2 && x1+w1 > x2 && y1 < y2+h2 && y1+h1 > y2;
  }

  function draw(){
    // background
    ctx.clearRect(0,0,W,H);
    // ground
    ctx.fillStyle = '#f2f2f2';
    ctx.fillRect(0,H-10,W,10);

    // player (simple dino)
    ctx.fillStyle = '#2b2b2b';
    ctx.fillRect(player.x, player.y, player.w, player.h);
    // eye
    ctx.fillStyle = '#fff'; ctx.fillRect(player.x+30, player.y+12, 6, 6);

    // cacti
    ctx.fillStyle = '#2b2b2b';
    cacti.forEach(c=> ctx.fillRect(c.x, c.y, c.w, c.h));

    // score
    ctx.fillStyle = '#666'; ctx.font = '14px Arial';
    ctx.fillText('Punkte: ' + Math.floor(score), W - 120, 20);

    if(!running){
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0,0,W,H);
      ctx.fillStyle = '#fff'; ctx.font='20px Arial';
      ctx.fillText('Spiel beendet - R zum Neustart', 30, H/2);
    }
  }

  function loop(){
    update();
    draw();
    requestAnimationFrame(loop);
  }

  document.addEventListener('keydown', (e)=>{
    if(e.code === 'Space'){ if(player.grounded){ player.vy = -14; player.grounded = false; } e.preventDefault(); }
    if(e.key === 'r' || e.key === 'R'){ reset(); }
  });

  // touch
  canvas.addEventListener('touchstart', (e)=>{ if(player.grounded){ player.vy = -14; player.grounded = false; } e.preventDefault(); });

  // start
  reset();
  loop();

})();
