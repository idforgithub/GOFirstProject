let canvas = document.querySelector("canvas")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let c = canvas.getContext('2d')

/*
c.fillStyle = "grey"
c.fillRect(100, 100, 100, 100)
c.fillRect(400, 100, 100, 100)
c.fillRect(300, 300, 100, 100)


// This is my line
c.beginPath()
c.moveTo(50, 300)
c.lineTo(300, 100)
c.lineTo(400, 300)
c.strokeStyle = "purple"
c.stroke()
// end my line


for (let i = 0; i < 100; i++) {
    let x = Math.random() * windowWidth
    let y = Math.random() * windowHeight

    c.beginPath()
    c.arc(x, y, 30, 0, Math.PI * 2, false)
    c.strokeStyle = "red"
    c.stroke()
}
*/

window.addEventListener('mousemove', function (event) {
    mouseVector.x = event.x
    mouseVector.y = event.y
})
window.addEventListener('mouseout', function () {
    mouseVector.x = undefined
    mouseVector.y = undefined
})
window.addEventListener('resize', function () {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
})

let mouseVector = {
    x: undefined,
    y: undefined
}

class Circle{

    strokeThickness = 1

    color2 = undefined

    tick = 1
    #maxRadius = 75;
    #speedX = undefined
    #speedY = undefined

    constructor(x = 0, y = 0, radius = 0, colorMethod = 'fill', color = 'black'){
        this.x = x
        this.y = y
        this.radius = radius
        this.prevRadius = radius
        this.colorMethod = colorMethod
        this.color = color

        this.#fixPosition()
        this.randomSpeed(false)
    }

    randomSpeed(isRandom = true){
        this.#speedX = (isRandom ? Math.random().toFixed(1) : 1) * (Math.random() < 0.5 ? this.tick : -this.tick)
        this.#speedY = (isRandom ? Math.random().toFixed(1) : 1) * (Math.random() < 0.5 ? this.tick : -this.tick)
    }

    setColorMethod(method = '', color1 = '', color2 = 'black'){
        if(method == '' || color1 == '')
            return
        
        this.colorMethod = method
        this.color = color1
        this.color2 = color2
    }

    #fixPosition(){
        if( (this.x + this.radius) > innerWidth){
            this.x = (this.x - this.radius) * 2
        }
        if( (this.x - this.radius)  < 0){
            this.x = (this.x + this.radius) * 2
        }
        if(this.y + this.radius > innerHeight){
            this.y = (this.y - this.radius) * 2
        }
        if( (this.y - this.radius) < 0){
            this.y = (this.y + this.radius) * 2
        }
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        c.lineWidth = this.strokeThickness
        switch (this.colorMethod.toLowerCase().replace(" ", "")) {
            case "fill+stroke":
                c.fillStyle = this.color
                c.strokeStyle = this.color2
                c.stroke()
                c.fill()
                break

            case "stroke+fill":
                c.strokeStyle = this.color
                c.fillStyle = this.color2
                c.stroke()
                c.fill()
                break
            
            case "fill":
                c.fillStyle = this.color
                c.fill()
                break

            default:
                c.strokeStyle = this.color
                c.stroke()
        }
        c.closePath()
    }

    update(interactRadius = 1){
        if( this.x + this.radius > innerWidth || this.x - this.radius < 0)
            this.#speedX = -this.#speedX
        

        if( this.y + this.radius > innerHeight || this.y - this.radius < 0)
            this.#speedY = -this.#speedY
        
        this.x += this.#speedX
        this.y += this.#speedY

        if( mouseVector.x - this.x < (interactRadius*3) && mouseVector.x - this.x > -(interactRadius*3) && 
            mouseVector.y - this.y < (interactRadius*3) && mouseVector.y - this.y > -(interactRadius*3)){
            this.radius += interactRadius/2
            this.radius = this.radius > (this.prevRadius * interactRadius) ? (this.prevRadius * interactRadius) : this.radius
            this.radius = this.radius > this.#maxRadius ? this.#maxRadius : this.radius
        } else if(this.radius > this.prevRadius)
            this.radius -= interactRadius/2
        
        this.draw()
    }
}


function randomNumber(number1 = 0, number2 = 0, rounding = false){
    return rounding ? 
        Math.round( randomNumber(number1, number2, false) ) : 
        Math.random() * (number2 - number1) + number1
}

function randomString(strs = [""]){
    return strs[Math.floor(Math.random() * strs.length)];
}

function strColorRGB(red = 0, green = 0, blue = 0, alpha = 1){
    return "rgba("+red+", "+green+", "+blue+", "+alpha+")"
}

let circles = []
for (let i = 0; i < 1500; i++) {

    let rngRadius = randomNumber(5, 20, true);

    let circle = new Circle(
        Math.random() * innerWidth , // X
        Math.random() * innerHeight, // Y
        rngRadius, // Radius
        "", // Color Method : stroke (by default) / fill / fill+stroke [setMethodColor for set color in fill and stroke]
        "", // Color
    )
    circle.strokeThickness = randomNumber(.2, 2)
    circle.tick = randomNumber(.2, 2)
    circle.randomSpeed()
    circle.setColorMethod(
        randomString([
            "fill",
            "stroke",
            "stroke+fill"
        ]),
        strColorRGB(
            Math.floor( Math.random() * 255), 
            Math.floor( Math.random() * 255), 
            Math.floor( Math.random() * 255),
            randomNumber(.2, .8)
        ), 
        strColorRGB(
            Math.floor( Math.random() * 255), 
            Math.floor( Math.random() * 255), 
            Math.floor( Math.random() * 255),
            randomNumber(.2, .8)
        )
    )
    circles.push(circle)
}

function animation() {
    requestAnimationFrame(animation)
    c.clearRect(0, 0, innerWidth, innerHeight)

    for (let i = 0; i < circles.length; i++) {
        circles[i].update(10)
    }
}
animation()