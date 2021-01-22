const Vector2 = require('./vector2.js')


const speed = 200;
const angle_speed = 200;
const hit_radius = 10;
const start_health = 3;

class Player {

    constructor(pos,color,name,id) {

        this.pos = pos;
        this.angle = 0;
        this.keys = [];

        this.color = color;
        this.name = name;
        this.id = id;

        this.health = start_health;
        this.points = 0;
        
        this.dead = false;
        
    }

    setPressedKeys(keys){
        this.keys = keys;
    }

    set(pos,angle){
        this.pos = pos;
        this.angle = angle;
    }

    foreward(updateFrequency){
        let v = new Vector2(0,-speed * updateFrequency);
        v = v.rotate(this.angle);

        this.pos = this.pos.add(v);

        if(this.pos.x < 0){
            this.pos.x += 600;
        }

        if(this.pos.y < 0){
            this.pos.y += 600;
        }

        if(this.pos.x > 600){
            this.pos.x -= 600;
        }

        if(this.pos.y > 600){
            this.pos.y -= 600;
        }
    }

    rotateLeft(updateFrequency){
        this.angle -= angle_speed * updateFrequency;

    }
    
    rotateRight(updateFrequency){
        this.angle += angle_speed * updateFrequency;
    }

    isHitByBullet(bullet){
        var distance = this.pos.getDistanceSquared(bullet.pos);
        var hit_radius_squared = hit_radius * hit_radius;
        if(distance < hit_radius_squared){
            this.health --;
            if(this.health == 0){
                this.dead = true;
            }
            return true;
        }
        return false;
    }

    getJson(){
        return {
            "x": this.pos.x,
            "y": this.pos.y,
            "a": this.angle,
            "c": this.color,
            "n": this.name,
        }
    }

    getFullJson(){
        return {
            "x": this.pos.x,
            "y": this.pos.y,
            "a": this.angle,
            "c": this.color,
            "n": this.name,
            "h": this.health,
            "p": this.points,
            "d": this.dead
        }
    }
}

module.exports = Player