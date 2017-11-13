var g = 1000


class DoublePendulum {
    constructor(ctx, l1, l2, theta1, theta2) {
	this.ctx = ctx
	this.mass = 1
	this.l1 = l1
	this.l2 = l2
	this.theta1 = theta1
	this.theta2 = theta2
	this.width  = 5
	this.pos1 = {x:200, y:200}
	this.pos2 = this.otherEnd(this.pos1, l1, theta1)
	this.oldTheta1 = this.theta1
	this.oldTheta2 = this.theta2
	this.omega1 = 0
	this.omega2 = 0
    }

    draw() {
	// Draw first pendulum
	this.ctx.translate(this.pos1.x+(this.width/2), this.pos1.y+(this.width/2))
	this.ctx.rotate(this.theta1)
	this.ctx.fillRect(-1*this.width/2, -1*this.width/2, this.width, this.l1)
	this.ctx.setTransform(1, 0, 0, 1, 0, 0);

	// Draw second pendulum
	this.ctx.translate(this.pos2.x+(this.width/2), this.pos2.y+(this.width/2))
	this.ctx.rotate(this.theta2)
	this.ctx.fillRect(-1*this.width/2, -1*this.width/2, this.width, this.l2)
	this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    clear() {
	// Clear first
	this.ctx.translate(this.pos1.x+(this.width/2), this.pos1.y+(this.width/2))
	this.ctx.rotate(this.oldTheta1)
	this.ctx.clearRect((-1*this.width/2)-1, (-1*this.width/2)-1, this.width+2, this.l1+2)
	this.ctx.setTransform(1, 0, 0, 1, 0, 0);
	// Clear second
	this.ctx.translate(this.pos2.x+(this.width/2), this.pos2.y+(this.width/2))
	this.ctx.rotate(this.oldTheta2)
	this.ctx.clearRect((-1*this.width/2)-1, (-1*this.width/2)-1, this.width+2, this.l2+2)
	this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    update(dt) {
	this.updateThetas(dt)
	
	this.updatePos2()
	
	this.oldTheta1 = this.theta1
	this.oldTheta2 = this.theta2
    }

    frame(dt) {
	this.clear()
	this.update(dt)
	this.draw()
    }

    updateThetas(dt) {
	// Implement actual double pendulum equations of motion using Runge-Kutta algorithm
	this.theta1 += dt
	this.theta2 -= dt
    }

    updatePos2() {
	this.pos2 = this.otherEnd(this.pos1, this.l1, this.theta1)
    }

    otherEnd(pos, l, theta) {
	let x = pos.x-(l*Math.sin(theta))
	let y = pos.y+(l*Math.cos(theta))
	return {x:x, y:y}
    }

}

let objects = []

function init() {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = "black"

    let pendulum = new DoublePendulum(ctx, 40, 50, 0, Math.PI/4)
    
    objects.push(pendulum)
    
    

    frame()

}

let d = new Date()
let time = d.getTime()
let oldTime = time
    
function frame() {
    let d = new Date()
    time = d.getTime()
    let diff = (time-oldTime)/1000
    for(let i = 0; i<objects.length; i++) {
	objects[i].frame(diff)
    }

    oldTime = time
    requestAnimationFrame(frame)
    
}


window.onload = init
