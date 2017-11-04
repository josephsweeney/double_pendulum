

class Pendulum {
    constructor(length, ctx) {
	this.mass = 1
	this.length = length
	this.width  = 5
	this.pos = {x:200, y:200}
	this.theta = 0.5
	this.oldTheta = this.theta
	this.ctx = ctx
    }

    draw() {
	this.ctx.translate(this.pos.x+(this.width/2), this.pos.y+(this.width/2))
	this.ctx.rotate(this.theta)

	this.ctx.fillRect(-1*this.width/2, -1*this.width/2, this.width, this.length)
	// Reset to Identity
	this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    clear() {
	this.ctx.translate(this.pos.x+(this.width/2), this.pos.y+(this.width/2))
	this.ctx.rotate(this.oldTheta)

	this.ctx.clearRect((-1*this.width/2)-1, (-1*this.width/2)-1, this.width+2, this.length+2)
	// Reset to Identity
	this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    update(dt) {
	this.theta -= Math.PI / 16
	this.oldTheta = this.theta
    }

    frame(dt) {
	this.clear()
	this.update(dt)
	this.draw()
    }

}

let objects = []

function init() {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = "black"
    
    objects.push(new Pendulum(40, ctx))
    

    frame()

}


function frame() {

    for(let i = 0; i<objects.length; i++) {
	objects[i].frame()
    }
    
    requestAnimationFrame(frame)
    
}


window.onload = init
