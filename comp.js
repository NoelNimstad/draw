// INITIALIZATION
const [canvas, previewCanvas] = [document.createElement("canvas"), document.createElement("canvas")];
[canvas.width, previewCanvas.width] = [window.innerWidth, window.innerWidth];
[canvas.height, previewCanvas.height] = [window.innerHeight, window.innerHeight];

document.body.append(canvas);
document.body.append(previewCanvas);

previewCanvas.classList.add("preview");

const context = canvas.getContext("2d");
const previewContext = previewCanvas.getContext("2d");

let [lines, cl, paths] = [[], 0, []];
window.addEventListener("resize", () => 
{
    [canvas.width, previewCanvas.width] = [window.innerWidth, window.innerWidth];
    [canvas.height, previewCanvas.height] = [window.innerHeight, window.innerHeight];
    redraw();
});

// SETUP
[context.lineCap, previewContext.lineCap] = ["round", "round"];
[context.lineWidth, previewContext.lineWidth] = [3, 3];

let [drawing, x, y, line] = [false, 0, 0, false];

canvas.addEventListener("mousedown", e => 
{
    drawing = true;
    if(e.shiftKey) line = true;

    cl = 0;

    [x, y] = [e.x, e.y]; // initialize mouse coordinates
});

canvas.addEventListener("mouseup", e => 
{
    drawing = false;

    if(line)
    {
        previewContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
        
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(e.x, e.y);
        context.stroke();
        
        line = false;
        
        cl = 1;
        paths.push({ x: x, y: y, ex: e.x, ey: e.y, c: context.strokeStyle, w: context.lineWidth });
    }

    lines.push(cl);
});

canvas.addEventListener("mousemove", e => 
{
    if(!drawing) return;

    cl++;

    if(line)
    {
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
    paths.push({ x: x, y: y, ex: e.x, ey: e.y, c: context.strokeStyle, w: context.lineWidth });

    [x, y] = [e.x, e.y]; // update mouse coordinates
}); 

function undo()
{
    const strokesToRemove = lines.pop();
    paths.splice(-strokesToRemove);
    
    let c = context.strokeStyle;
    redraw();
    context.strokeStyle = c;
}

function redraw()
{
    context.clearRect(0, 0, canvas.width, canvas.height);

    for(let path of paths)
    {
        context.strokeStyle = path.c;
        context.lineWidth = path.w;
        context.beginPath();
        context.moveTo(path.x, path.y);
        context.lineTo(path.ex, path.ey);
        context.stroke();
    }
}

let editing = false;
let fontSize = 1;

document.addEventListener("keydown", e => 
{
    console.log(e.key);

    switch(e.key)
    {
        case "ArrowUp":
            fontSize += 0.1;
            document.body.style.fontSize = fontSize + "rem";
            break;
        case "ArrowDown":
            fontSize -= 0.1;
            document.body.style.fontSize = fontSize + "rem";
            break;
    }

    if(editing) return;

    switch(e.key)
    {
        case "1":
            [context.lineWidth, previewContext.lineWidth] = [1, 1];
            break;
        case "2":
            [context.lineWidth, previewContext.lineWidth] = [2, 2];
            break;
        case "3":
            [context.lineWidth, previewContext.lineWidth] = [3, 3];
            break;
        case "4":
            [context.lineWidth, previewContext.lineWidth] = [4, 4];
            break;
        case "5":
            [context.lineWidth, previewContext.lineWidth] = [5, 5];
            break;
        case "6":
            [context.lineWidth, previewContext.lineWidth] = [6, 6];
            break;
        case "7":
            [context.lineWidth, previewContext.lineWidth] = [7, 7];
            break;
        case "8":
            [context.lineWidth, previewContext.lineWidth] = [8, 8];
            break;
        case "9":
            [context.lineWidth, previewContext.lineWidth] = [9, 9];
            break;
        case "r":
            [context.strokeStyle, previewContext.strokeStyle] = ["#f00", "#f00"];
            break;
        case "g":
            [context.strokeStyle, previewContext.strokeStyle] = ["#0f0", "#0f0"];
            break;
        case "b":
            [context.strokeStyle, previewContext.strokeStyle] = ["#00f", "#00f"];
            break;
        case "s":
            [context.strokeStyle, previewContext.strokeStyle] = ["#000", "#000"];
            break;
        case "q":
            [context.strokeStyle, previewContext.strokeStyle] = ["#aaa", "#aaa"];
            break;
        case "y":
            [context.strokeStyle, previewContext.strokeStyle] = ["#fff200", "#fff200"];
            break;
        case "T":
            const p = document.createElement("p");
            p.contentEditable = true;
            p.draggable = true;
            document.body.append(p);
            p.innerText = "text"
            p.style.top = window.innerHeight / 2 + "px";
            p.style.left = window.innerWidth / 2 + "px";

            // dragging
            {
                let dragging = false;
                let width, height;
                p.addEventListener("mousedown", e => 
                {
                    if(e.shiftKey) 
                    {
                        e.preventDefault(); 
                        dragging = true;
                        let boundingBox = p.getBoundingClientRect();
                        
                        width = boundingBox.width / 2;
                        height = boundingBox.height / 2;
                    };
                });

                p.addEventListener("focus", () => 
                {
                    editing = true;
                });

                p.addEventListener("blur", () => 
                {
                    editing = false;
                }); // unfocus

                p.addEventListener("mouseup", () => 
                {
                    e.preventDefault();
                    dragging = false;
                });

                p.addEventListener("keydown", e => 
                {
                    if(e.key != "Escape") return;
                    editing = false;
                    p.blur();
                });

                document.addEventListener("mousemove", e => 
                {
                    e.preventDefault();
                    if(!dragging) return;
                    
                    p.style.top = e.y - height + "px";
                    p.style.left = e.x - width + "px";
                });
            }
            break;
        case "Z":
            undo();
            break;
    }
});

function screenshot() 
{
    previewContext.fillStyle = "#fff";
    previewContext.fillRect(0, 0, window.innerWidth, window.innerHeight);
    previewContext.fillStyle = "#000";
    previewContext.drawImage(canvas, 0, 0);
    previewContext.font = fontSize * 16 + "px sans-serif";

    const p = document.getElementsByTagName("p");
    for(let element of p)
    {
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