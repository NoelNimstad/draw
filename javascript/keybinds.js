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