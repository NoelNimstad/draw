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