var g = 300


function bound(theta) {
    let newtheta = 0
    if(theta < 0) {
	newtheta = theta % (-1 * 2 * Math.PI)
    } else {
	newtheta = theta % (2 * Math.PI)
    }
    return newtheta
}
    


class DoublePendulum {
    constructor(ctx, l1, l2, theta1, theta2) {
	this.ctx = ctx
	this.m1 = 50
	this.m2 = 50
	this.l1 = l1
	this.l2 = l2
	this.theta1 = theta1
	this.theta2 = theta2
	this.width  = 5
	this.pos1 = {x:canvas.width/2, y:canvas.height/4}
	this.pos2 = this.otherEnd(this.pos1, l1, -theta1)
	this.end1 = this.pos2
	this.end2 = this.otherEnd(this.end1, l2, -theta2)
	this.trail1 = []
	this.trail2 = []
	this.oldTheta1 = this.theta1
	this.oldTheta2 = this.theta2
	this.omega1 = 0
	this.omega2 = 0
    }

    draw() {
	// Draw first pendulum
	this.ctx.fillStyle = 'black'
	this.ctx.translate(this.pos1.x+(this.width/2), this.pos1.y+(this.width/2))
	this.ctx.rotate(-this.theta1)
	this.ctx.fillRect(-1*this.width/2, -1*this.width/2, this.width, this.l1)
	this.ctx.setTransform(1, 0, 0, 1, 0, 0);

	// Draw second pendulum
	this.ctx.translate(this.pos2.x+(this.width/2), this.pos2.y+(this.width/2))
	this.ctx.rotate(-this.theta2)
	this.ctx.fillRect(-1*this.width/2, -1*this.width/2, this.width, this.l2)
	this.ctx.setTransform(1, 0, 0, 1, 0, 0);

	this.drawTrail()
    }


    clear() {
	this.ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    drawTrail() {
	this.ctx.beginPath()
	this.ctx.strokeStyle = 'blue';
	this.trail1.map((pos) => {this.ctx.lineTo(pos.x, pos.y);this.ctx.moveTo(pos.x, pos.y)})
	this.ctx.stroke()
	this.ctx.closePath()

	this.ctx.beginPath()
	this.ctx.strokeStyle = 'red';
	this.trail2.map((pos) => {this.ctx.lineTo(pos.x, pos.y);this.ctx.moveTo(pos.x, pos.y)})
	this.ctx.stroke()
	this.ctx.closePath()
    }


    update(dt) {
	this.updateThetas(dt)

	this.updatePos2()
	this.updateTrail()

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
	let newOmega1 = this.rungeKutta(this.AngAcc1.bind(this), this.omega1, dt)
	let newOmega2 = this.rungeKutta(this.AngAcc2.bind(this), this.omega2, dt)
    	this.theta1 += dt*newOmega1
    	this.theta2 += dt*newOmega2

	this.theta1 = bound(this.theta1)
	this.theta2 = bound(this.theta2)
	
	this.omega1 = newOmega1
	this.omega2 = newOmega2
    }

    setTheta1(newtheta) {
	this.theta1 = bound(newtheta)
    }

    setTheta2(newtheta) {
	this.theta2 = bound(newtheta)
    }

    rungeKutta(f, x, h) {
	let a = f(x)
	let b = f(x+((h/2)*a))
	let c = f(x+((h/2)*b))
	let d = f(x+(h*c))
	return x + ((h/6) * (a + 2*b + 2*c + d))
    }

    AngAcc1(omega1){
	let num = -1*g*(2*this.m1+this.m2)*Math.sin(this.theta1)
	num -= this.m2*g*Math.sin(this.theta1-2*this.theta2)
	num -= 2*Math.sin(this.theta1-this.theta2)*this.m2*(Math.pow(this.omega2,2)*this.l2+Math.pow(omega1,2)*this.l1*Math.cos(this.theta1-this.theta2))
	let den = this.l1*(2*this.m1+this.m2-this.m2*Math.cos(2*this.theta1-2*this.theta2))
	return den != 0 ? num/den : 0
    }

    AngAcc2(omega2){
	let num1 = 2*Math.sin(this.theta1-this.theta2)
	let num2 = (Math.pow(this.omega1,2)*this.l1*(this.m1+this.m2))
	num2 += g*(this.m1+this.m2)*Math.cos(this.theta1)
	num2 += Math.pow(omega2,2)*this.l2*this.m2*Math.cos(this.theta1-this.theta2)
	let num = num1 * num2
	let den = this.l2*(2*this.m1+this.m2-this.m2*Math.cos(2*this.theta1-2*this.theta2))
	return den != 0 ? num/den : 0
    }

    updatePos2() {
	this.pos2 = this.otherEnd(this.pos1, this.l1, -this.theta1)
    }
    
    updateTrail() {
	this.trail1.push(this.end1)
	this.trail2.push(this.end2)

	let maxLen = 200

	if(this.trail1.length > maxLen)
	    this.trail1.shift()

	if(this.trail2.length > maxLen)
	    this.trail2.shift()
	
	this.end1 = this.pos2
	this.end2 = this.otherEnd(this.end1, this.l2, -this.theta2)
    }

    otherEnd(pos, l, theta) {
	let x = pos.x-(l*Math.sin(theta))
	let y = pos.y+(l*Math.cos(theta))
	return {x:x, y:y}
    }

}

let pendulum = null
let canvas = null

function init() {
    canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = "black"

    let lengths = Math.min(canvas.width, canvas.height)
    lengths /= 5

    pendulum = new DoublePendulum(ctx, lengths, lengths, 3*Math.PI, Math.PI/4)




    frame()

}

let d = new Date()
let time = d.getTime()
let oldTime = time
let draw = true
let mouse = {x:0, y:0}

function frame() {
    let d = new Date()
    time = d.getTime()
    let diff = (time-oldTime)/1000
    diff = diff < 0.1 ? diff : 0.016

    if(draw) {
	pendulum.frame(diff)
    }

    oldTime = time
    requestAnimationFrame(frame)

}


window.onload = init
window.addEventListener("mousedown", mouseDown)
window.addEventListener("mousemove", mouseMove)
window.addEventListener("mouseup", mouseUp)

function inPend1() {
    let pos = pendulum.pos1
    let l = pendulum.l1

    return dist(mouse, pos) < l
}

function dist(p1, p2) {
    return Math.sqrt((p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y))
}

function mouseDown(event) {
    draw = false
}

function mouseMove(event) {
    if(!draw) {
	let oldmouse = mouse
	mouse = {x:event.clientX, y:event.clientY}
	let dx = mouse.x - oldmouse.x
	let dtheta = -dx/100
	if(inPend1()) {
	    pendulum.setTheta1(pendulum.theta1 + dtheta)
	    pendulum.pos2 = pendulum.otherEnd(pendulum.pos1, pendulum.l1, -pendulum.theta1)
	} else {
	    pendulum.setTheta2(pendulum.theta2 + dtheta)
	}
	pendulum.omega1 = 0
	pendulum.omega2 = 0
	pendulum.clear()
	pendulum.draw()
    } else {
	mouse = {x:event.clientX, y:event.clientY}
    }
}

function mouseUp(event) {
    draw = true
}
