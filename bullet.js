const Vector2 = require('./vector2.js')

const speed = 400;

class Bullet{

    constructor(pos,angle){
        this.pos = pos;

        this.dir = new Vector2(0,-1).rotate(angle);
        this.angle = angle;
        
        this.livetime = Date.now();
    }
    
    foreward(updateFrequency){
        
        var v = this.dir.withFactor(updateFrequency*speed);
        //console.log(this.dir);

        this.pos = this.pos.add(v);

        if(this.pos.x < 0 || this.pos.x > 600){
            this.dir.x = -this.dir.x;
        }

        if(this.pos.y < 0 | this.pos.y > 600){
            this.dir.y = -this.dir.y;
        }
        
    }

    isLivetimeOver(){
        return this.livetime + 5000 < Date.now();
    }

    isActive(){
        return this.livetime + 150 < Date.now();
    }

    getJson(){
        return {
            "x": this.pos.x,
            "y": this.pos.y,
        }
    }

}

module.exports = Bullet