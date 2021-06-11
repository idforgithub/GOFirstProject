let canvas = document.querySelector("canvas")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let c = canvas.getContext('2d')

const image = new Image()
image.src = "assets/mika.jpg"

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

    constructor(x = 0, y = 0, radius = 0, colorMethod = 'stroke'){
        this.x = x
        this.y = y
        this.radius = radius
        this.prevRadius = radius
        this.colorMethod = colorMethod
        this.opacity = 1

        this.#fixPosition()
        this.randomSpeed(false)
    }

    randomSpeed(isRandom = true){
        this.#speedX = (isRandom ? Math.random().toFixed(1) : 1) * (Math.random() < 0.5 ? this.tick : -this.tick)
        this.#speedY = (isRandom ? Math.random().toFixed(1) : 1) * (Math.random() < 0.5 ? this.tick : -this.tick)
    }

    setColorMethod(method = ''){
        if(method == '')
            return
        
        this.colorMethod = method
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
        c.save()
        c.lineWidth = this.strokeThickness
        c.globalAlpha = this.opacity
        c.globalCompositeOperation = 'source-over'
        switch (this.colorMethod.toLowerCase().replace(" ", "")) {
            case "fill+stroke":
                c.fillStyle = "white"
                c.strokeStyle = "white"
                c.stroke()
                c.fill()
                break

            case "stroke+fill":
                c.strokeStyle = "white"
                c.fillStyle = "white"
                c.stroke()
                c.fill()
                break
            
            case "fill":
                c.fillStyle = "white"
                c.fill()
                break

            default:
                c.strokeStyle = "white"
                c.stroke()
        }
        c.restore()
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

function instantiate(target = 10) {
    for (let i = 0; i < target; i++) {
        let rngRadius = randomNumber(5, 20, true);
    
        let circle = new Circle(
            Math.random() * innerWidth , // X
            Math.random() * innerHeight, // Y
            rngRadius, // Radius
        )
        circle.strokeThickness = randomNumber(.2, 2)
        circle.opacity = randomNumber(.2, .8)
        circle.tick = randomNumber(-.9, .9)
        circle.randomSpeed()
        circle.setColorMethod(
            randomString([
                "fill",
                "stroke",
                "stroke+fill"
            ]),
        )
        circles.push(circle)
    }
}

function animation() {
    requestAnimationFrame(animation)
    c.clearRect(0, 0, innerWidth, innerHeight)

    for (let i = 0; i < circles.length; i++) {
        circles[i].update(10)
    }
    c.globalCompositeOperation = 'source-out'
    c.drawImage(image, 0, 0, canvas.width, canvas.height)
}

instantiate(target = 200)

animation()
