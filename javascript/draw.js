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

    if(line)
    {
        previewContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

        previewContext.beginPath();
        previewContext.moveTo(x, y);
        previewContext.lineTo(e.x, e.y);
        previewContext.stroke();

        return;
    }

    cl++;

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