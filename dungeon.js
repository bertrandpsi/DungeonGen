var ctx;
const smoothSize = 8;
const sizeVariation = 0.7;
const disturbationFactor = 2;
var perimeters = [];

function DrawOddCircle(x, y, radius)
{
    ctx.fillStyle = "rgba(255,0,0)";
    ctx.beginPath();
    var sizes = [];
    for (var i = 0; i < 80; i++)
        sizes.push(Math.random() * sizeVariation * 2 + (1 - sizeVariation));
    var smooth = [];
    for (var i = 0; i < sizes.length; i++)
    {
        var values = [];
        for (var j = -smoothSize; j < smoothSize; j++)
            values.push(sizes[(i + j + sizes.length) % sizes.length]);
        smooth.push(values.reduce(function (a, b) { return a + b; }, 0) / values.length);
    }

    var fx = Math.random() * sizeVariation + (1 - sizeVariation / 2);
    var fy = Math.random() * sizeVariation + (1 - sizeVariation / 2);

    var a = Math.random() * Math.PI * 2;
    var ca = Math.cos(a);
    var sa = Math.sin(a);

    for (var i = 0; i < sizes.length; i++)
    {
        var a = i * 2 * Math.PI / sizes.length;

        var cx = radius * smooth[i] * fx * Math.cos(a);
        var cy = radius * smooth[i] * fy * Math.sin(a);
        cx += (Math.sin(cy / 5) + Math.cos(cy / 7) + Math.sin(cx / 15)) * disturbationFactor;

        var nx = cx * ca - cy * sa + x;
        var ny = cx * sa + cy * ca + y;

        perimeters.push({ x: nx, y: ny });

        if (i == 0)
            ctx.moveTo(nx, ny);
        else
            ctx.lineTo(nx, ny);
    }
    ctx.closePath();
    ctx.fill();
}

function MakeChamber(x,y)
{
    perimeters = [];
    DrawOddCircle(x, y, 20);
    for (var j = 0; j < 30; j++)
    {
        var usablePerimeters = perimeters.slice();
        perimeters = [];
        for (var i = 0; i < 15; i++)
        {
            var p = Math.ceil(Math.random() * usablePerimeters.length-1);
            DrawOddCircle(usablePerimeters[p].x, usablePerimeters[p].y, 10 * Math.random() + 10);
        }
    }    
}

function Init()
{
    ctx = document.getElementById("map").getContext("2d");
    MakeChamber(500,500);
    /*for(var i=0;i < 20;i++)
    {
        Math.ceil(Math.random() * usablePerimeters.length-1);
        MakeChamber(250+Math.round(Math.random()*100)*10,250+Math.round(Math.random()*100)*10);
    }*/
}
// On document ready 
document.addEventListener("DOMContentLoaded", Init);