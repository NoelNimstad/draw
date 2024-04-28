const createCanvas = (width, height) => {
    const newCanvas = document.createElement("canvas");
    newCanvas.width = width;
    newCanvas.height = height;
    document.body.append(newCanvas);
    return newCanvas;
};

const canvas = createCanvas(window.innerWidth, window.innerHeight);
const previewCanvas = createCanvas(window.innerWidth, window.innerHeight);
previewCanvas.classList.add("preview");

const context = canvas.getContext("2d");
const previewContext = previewCanvas.getContext("2d");

let lines = [];
let cl = 0;
let paths = [];

const setLineWidth = (width) => {
    context.lineWidth = width;
    previewContext.lineWidth = width;
};

const setStrokeStyle = (color) => {
    context.strokeStyle = color;
    previewContext.strokeStyle = color;
};

setLineWidth(3);
setStrokeStyle("#000");
context.lineCap = "round";

let drawing = false;
let x = 0;
let y = 0;
let line = false;

canvas.addEventListener("mousedown", e => {
    drawing = true;
    if (e.shiftKey) line = true;
    cl = 0;
    [x, y] = [e.x, e.y];
});

canvas.addEventListener("mouseup", e => {
    drawing = false;
    if (line) {
        previewContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(e.x, e.y);
        context.stroke();
        line = false;
        cl = 1;
        paths.push({ x, y, ex: e.x, ey: e.y, c: context.strokeStyle, w: context.lineWidth });
    }
    lines.push(cl);
});

canvas.addEventListener("mousemove", e => {
    if (!drawing) return;
    cl++;
    if (line) {
        previewContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
        previewContext.beginPath();
        previewContext.moveTo(x, y);
        previewContext.lineTo(e.x, e.y);
        previewContext.stroke();
        return;
    }
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(e.x, e.y);
    context.stroke();
    paths.push({ x, y, ex: e.x, ey: e.y, c: context.strokeStyle, w: context.lineWidth });
    [x, y] = [e.x, e.y];
});

function undo() {
    const strokesToRemove = lines.pop();
    paths.splice(-strokesToRemove);
    let c = context.strokeStyle;
    redraw();
    context.strokeStyle = c;
}

function redraw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let path of paths) {
        setStrokeStyle(path.c);
        setLineWidth(path.w);
        context.beginPath();
        context.moveTo(path.x, path.y);
        context.lineTo(path.ex, path.ey);
        context.stroke();
    }
}

let editing = false;
let fontSize = 1;

document.addEventListener("keydown", e => {
    switch(e.key) {
        case "ArrowUp":
            fontSize += 0.1;
            document.body.style.fontSize = fontSize + "rem";
            break;
        case "ArrowDown":
            fontSize -= 0.1;
            document.body.style.fontSize = fontSize + "rem";
            break;
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            setLineWidth(parseInt(e.key));
            break;
        case "r":
            setStrokeStyle("#f00");
            break;
        case "g":
            setStrokeStyle("#0f0");
            break;
        case "b":
            setStrokeStyle("#00f");
            break;
        case "s":
            setStrokeStyle("#000");
            break;
        case "q":
            setStrokeStyle("#aaa");
            break;
        case "y":
            setStrokeStyle("#fff200");
            break;
        case "T":
            const p = document.createElement("p");
            p.contentEditable = true;
            p.draggable = true;
            document.body.append(p);
            p.innerText = "text"
            p.style.top = window.innerHeight / 2 + "px";
            p.style.left = window.innerWidth / 2 + "px";
            let dragging = false;
            let width, height;
            p.addEventListener("mousedown", e => {
                if(e.shiftKey) {
                    e.preventDefault(); 
                    dragging = true;
                    let boundingBox = p.getBoundingClientRect();
                    width = boundingBox.width / 2;
                    height = boundingBox.height / 2;
                };
            });
            p.addEventListener("focus", () => editing = true);
            p.addEventListener("blur", () => editing = false);
            p.addEventListener("mouseup", () => dragging = false);
            p.addEventListener("keydown", e => {
                if(e.key == "Escape") {
                    editing = false;
                    p.blur();
                }
            });
            document.addEventListener("mousemove", e => {
                e.preventDefault();
                if(!dragging) return;
                p.style.top = e.y - height + "px";
                p.style.left = e.x - width + "px";
            });
            break;
        case "Z":
            undo();
            break;
    }
});

function screenshot() {
    previewContext.fillStyle = "#fff";
    previewContext.fillRect(0, 0, window.innerWidth, window.innerHeight);
    previewContext.fillStyle = "#000";
    previewContext.drawImage(canvas, 0, 0);
    previewContext.font = fontSize * 16 + "px sans-serif";
    const p = document.getElementsByTagName("p");
    for (let element of p) {
        const boundingBox = element.getBoundingClientRect();
        previewContext.fillText(element.innerText, parseInt(element.style.left), parseInt(element.style.top) + boundingBox.height * 0.817);
    }
    const a = document.createElement("a");
    a.href = previewCanvas.toDataURL();
    a.target = "_blank"
    document.body.append(a);
    a.click();
    a.remove();
    previewContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
}