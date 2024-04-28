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