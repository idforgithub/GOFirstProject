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

let temp = false
addEventListener('mousedown', function () {
    if(temp){
        temp = false
        imageGlobalComposition  = 'overlay'
    } else {
        temp = true
        imageGlobalComposition  = 'source-atop'
    }
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
    opacity = 1
    #speedX = undefined
    #speedY = undefined

    color1 = "white"
    color2 = undefined

    constructor(x = 0, y = 0, radius = 0, colorMethod = 'stroke'){
        this.x = x
        this.y = y
        this.radius = radius
        this.prevRadius = radius
        this.colorMethod = colorMethod

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
        this.color1 = color1
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
        c.save()
        c.lineWidth = this.strokeThickness
        c.globalAlpha = this.opacity
        c.globalCompositeOperation = circleGlobalComposition
        switch (this.colorMethod.toLowerCase().replace(" ", "")) {
            case "fill+stroke":
                c.fillStyle = this.color1
                c.strokeStyle = this.color2
                c.stroke()
                c.fill()
                break

            case "stroke+fill":
                c.strokeStyle = this.color1
                c.fillStyle = this.color2
                c.stroke()
                c.fill()
                break
            
            case "fill":
                c.fillStyle = this.color1
                c.fill()
                break

            default:
                c.strokeStyle = this.color1
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

const circles = []
let radius = {
    min: 0,
    max: 0
}
function requestRadius(min = 10, max = 100) {
    radius = {
        min: min,
        max: max
    }
}

let tick = {
    min: 0,
    max: 0
}
function requestTick(min = .2, max = 2) {
    tick = {
        min: min,
        max: max
    }
}

function instantiate(target = 10) {
    for (let i = 0; i < target; i++) {
        let rngRadius = randomNumber(radius.min, radius.max, true);
    
        let circle = new Circle(
            Math.random() * innerWidth , // X
            Math.random() * innerHeight, // Y
            rngRadius, // Radius
        )
        circle.strokeThickness = randomNumber(.2, 2)
        circle.opacity = randomNumber(.2, .8)
        circle.tick = randomNumber(tick.min, tick.max)
        circle.randomSpeed()
        circle.setColorMethod(
            randomString([
                "fill",
                "stroke",
                "stroke+fill"
            ]),
            strColorRGB(
                randomNumber(0, 255, true),
                randomNumber(0, 255, true),
                randomNumber(0, 255, true),
                randomNumber(.2, .9)
            ),
            strColorRGB(
                randomNumber(0, 255, true),
                randomNumber(0, 255, true),
                randomNumber(0, 255, true),
                randomNumber(.2, .9)
            )
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

    c.drawImage(image, 0, 0, canvas.width, canvas.height)
    c.globalCompositeOperation = imageGlobalComposition
}

// set circle type of composition
// for more detail https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
circleGlobalComposition = 'overlay'

// set image background type of composition
// for more detail https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
imageGlobalComposition  = 'overlay'

// set velocity of circle, by default min = 0.2 and max = 2
requestTick(.2, 1.2)

// set radius of circle, by default min = 10 and max = 100
requestRadius(10, 20)

// target = (how much circle to instantiate)
instantiate(target = 500)

// run animation
animation()

