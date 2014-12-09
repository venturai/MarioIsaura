// TODO
game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings){
        this._super(me.Entity, 'init', [x, y, {
                image: "mario",
                spritewidth: "128",
                spriteheight: "128",
                width: 128,
                height: 128,
                getShape: function(){
                    return (new me.Rect(0, 0, 30, 128)).toPolygon();
                }
        }]);
    
        this.renderable.addAnimation("idle", [3]);
        this.renderable.addAnimation("bigIdle", [19]);
        this.renderable.addAnimation("smallWalk", [8, 9, 10, 11, 12, 13], 80);
        this.renderable.addAnimation("bigWalk", [14, 15, 16, 17, 18], 80);
        this.renderable.addAnimation("shrink", [0, 1, 2, 3], 80);
        this.renderable.addAnimation("grow", [4, 5, 6, 7], 80);
        
        
        this.renderable.setCurrentAnimation("idle");
        
        this.big = false;
        this.body.setVelocity(5, 20);
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    },
    
    update: function(delta){
        
        
        if(me.input.isKeyPressed("right")){
            this.body.vel.x += this.body.accel.x * me.timer.tick;
        }
        else if (me.input.isKeyPressed("left")) {
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
        }
        else{
            this.body.vel.x = 0;
        }
        
        this.body.update(delta);
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        
        if(!this.big){
            if(this.body.vel.x !== 0){
                if (!this.renderable.isCurrentAnimation("smallWalk") && !this.renderable.isCurrentAnimation("grow") && !this.renderable.isCurrentAnimation("shrink") ) {
                    this.renderable.setCurrentAnimation("smallWalk");
                    this.renderable.setAnimationFrame();
                }
            }        
        }else{
            this.renderable.setCurrentAnimation("idle");
        }else{
             if(this.body.vel.x !== 0){
                if (!this.renderable.isCurrentAnimation("bigWalk") && !this.renderable.isCurrentAnimation("grow") && !this.renderable.isCurrentAnimation("shrink")) {
                    this.renderable.setCurrentAnimation("bigWalk");
                    this.renderable.setAnimationFrame();
            }
        }else{
            this.renderable.setCurrentAnimation(bigIdle);
        }
    }
         
         
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    
    collideHandler: function(response){
        var ydif = this.pos.y - response.b.pos.y;
        console.log(ydif);
        
        if(responce.b.type === 'badguy'){
            if(ydif <= -115){
                respone.b.alive = false;
            }else{ 
               if(this.big){
                   this.big = false;
                   this.body.vel.y -= this.body.accel.y * me.timer.tick;
                   this.jumping = true;
                   this.renderable.setCurrentAnimation("shrink", "idle");
                   this.renderable.setAnimationFrame();
               }else{
                   me.state.change(me.state.MENU);
               }
       }
        }else if (response.b.type === 'mushroom')
            this.renderable.setCurrentAnimation("grow", "bigIdle");
            this.big = true;
            me.game.world.removeChild(response.b);
        }
    
});

game.LevelTrigger = me.Entity.extend({
    init: function(x, y, settings){
        this._super(me.Entity, 'init', [x, y, settings]);
        this.body.onCollision = this.onCollision.bind(this);
        this.level = settings.level;
        this.xSpawn = settings.xSpawn;
        this.ySpawn = settings.ySpawn;
    },
    
    onCollision: function(){
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        me.levelDirector.loadLevel(this.level);
        me.state.current().resetPlayer(this.xSpawn, this.ySpawn);
    }
    
});

game.BadGuy = me.Entity.extend({
    init: function(x, y, settings){
        this._super(me.Entity, 'init', [x, y, {
                image: "slime",
                spritewidth: "60",
                spriteheight: "28",
                width: 60,
                height: 28,
                getShape: function(){
                    return (new me.Rect(0, 0, 60, 128)).toPolygon();
                }
        }]);
    
    this.spritewidth = 60;
    var width = settings.width;
    x = this.pos.x;
    this.startX = x;
    this.endX = + width - this.spritewidth;
    this.pos.x = x + width -this.spritewidth;
    this.updateBounds();
    
    this.alwaysUpdate = true;
    
    //This line of code tells the badguy which way to walk and if hes alive.//
    
    this.walkLeft = false;
    this.alive = true;
    this.type = "badguy";
    
    //this.renderable.addAnimation("run", [0, 1, 2], 80);
    //this.renderable.setCurrentAnimation("run");
    
    // this line of code tells how fast our guy goes.
    this.body.setVelocity(4, 6);
    
    },
    
    update: function(delta){
        this.body.update(delta);
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        
        if(this.alive){
            if(this.walkLeft && this.pos.x <= this.startX){
                this.walkLeft = false;
            }else if(!this.walkLeft && this.pos.x >= this.endX){
                this.walkLeft = true;
            }
            this.flipX(!this.walkLeft);
            this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timmer.tick;
            
        }else{
            me.game.world.removeChild(this);
        }
        
        
        this._super(me.Enitity,"update", [delta]);
        return true;
    }
    
    collideHandler: function(){
        
    }
});

game.Mushroom = me.Entity.extend({
        innit: function(x, y, settings){
        this._super(me.Entity, 'init', [x, y, {
        image: "mushroom",
                spritewidth: "64",
                spriteheight: "64",
                width: 64,
                height: 64,
                getShape: function(){
                return (new me.Rect(0, 0, 64, 64)).toPolygon();
                }
        }]);
    
        me.collision.check(this);
        this.type = "mushroom";
    }
        
    });