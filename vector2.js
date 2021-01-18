


class Vector2 {
    
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    add(v){
        return new Vector2(this.x + v.x,this.y + v.y);
    }

    substract(v){
        return new Vector2(this.x - v.x,this.y - v.y);
    }

    withFactor(f){
        return new Vector2(this.x * f,this.y* f);  
    }

    rotate(theta){

        theta *= 0.0174533;

        let cs = Math.cos(theta);
        let sn = Math.sin(theta);
        let px = this.x * cs - this.y * sn; 
        let py = this.x * sn + this.y * cs;

        return new Vector2(px,py);
    }

    getDistance(v){

        var delta_x = this.x - v.x;
        var delta_y = this.y - v.y;
        return Math.sqrt(delta_x*delta_x + delta_y*delta_y);

    }

    getDistanceSquared(v){

        var delta_x = this.x - v.x;
        var delta_y = this.y - v.y;
        return delta_x*delta_x + delta_y*delta_y;

    }
}

module.exports = Vector2