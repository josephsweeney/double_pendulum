var g = 1000

class Pendulum {
    constructor(length, ctx, parent) {
	this.parent = parent ? parent : null
	this.mass = 1
	this.length = length
	this.width  = 5
	this.pos = {x:200, y:200}
	this.theta = Math.PI/2
	this.thetaOriginal = this.theta
	this.oldTheta = this.theta
	this.ctx = ctx
	this.time = 0
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
	if(this.parent) {
	    this.pos = this.parent.otherEnd()
	    console.log(this.pos)
	}
	
	this.time += dt
	this.theta = this.getTheta()
	this.oldTheta = this.theta
    }

    frame(dt) {
	this.clear()
	this.update(dt)
	this.draw()
    }

    getTheta() {
	let res = this.thetaOriginal * (Math.cos(Math.sqrt((g/this.length))*this.time))
	return res
    }

    otherEnd() {
	let x = this.pos.x-(this.length*Math.sin(this.theta))
	let y = this.pos.y+(this.length*Math.cos(this.theta))
	return {x:x, y:y}
    }

}

let objects = []

function init() {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = "black"

    let original = new Pendulum(50, ctx)
    
    objects.push(original)

    objects.push(new Pendulum(40, ctx, original))
    
    

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
