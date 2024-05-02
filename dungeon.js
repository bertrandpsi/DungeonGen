var ctx;
const smoothSize = 8;
const sizeVariation = 0.7;
const disturbationFactor = 2;
var perimeters = [];

function DrawOddCircle(x, y, radius)
{
    ctx.fillStyle = "rgba(180,180,180)";
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

function MakeChamber(x, y)
{
    perimeters = [];
    DrawOddCircle(x, y, 20);
    for (var j = 0; j < 30; j++)
    {
        var usablePerimeters = perimeters.slice();
        perimeters = [];
        for (var i = 0; i < 15; i++)
        {
            var p = Math.ceil(Math.random() * usablePerimeters.length - 1);
            DrawOddCircle(usablePerimeters[p].x, usablePerimeters[p].y, 10 * Math.random() + 10);
        }
    }
}


function FindEdgePoints()
{
    var results = [];
    // Get the image data
    var imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Vertical edges
    for (var x = 0; x < ctx.canvas.width; x += 50)
    {
        // From top to bottom
        for (var y = 0; y < ctx.canvas.height; y += 10)
        {
            if (imageData.data[(y * ctx.canvas.width + x) * 4] == 180)
            {
                results.push({ x: x, y: y });
                break;
            }
        }

        // From bottom to top
        for (var y = ctx.canvas.height-1; y >= 0 ; y -= 10)
        {
            if (imageData.data[(y * ctx.canvas.width + x) * 4] == 180)
            {
                results.push({ x: x, y: y });
                break;
            }
        }
    }

    // Horizontal edges
    for (var y = 0; y < ctx.canvas.height; y += 50)
    {
        // From left to right
        for (var x = 0; x < ctx.canvas.width; x += 10)
        {
            if (imageData.data[(y * ctx.canvas.width + x) * 4] == 180)
            {
                results.push({ x: x, y: y });
                break;
            }
        }

        // From right to left
        for (var x = ctx.canvas.width-1; x >= 0 ; x -= 10)
        {
            if (imageData.data[(y * ctx.canvas.width + x) * 4] == 180)
            {
                results.push({ x: x, y: y });
                break;
            }
        }
    }
    results = results.filter(function (item)
    {
        return item.x > 200 && item.y > 200 && item.x < 2800 && item.y < 2800;
    });
    return results;
}

function Init()
{
    ctx = document.getElementById("map").getContext("2d");
    Generate();
}

function Generate()
{
    // clear the canvas
    ctx.fillStyle = "rgba(0,0,0)";
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    document.getElementById("calculating").style.display = "block";
    setTimeout(function ()
    {
        MakeChamber(1500, 1500);
        for (var i = 0; i < 80; i++)
        {
            var edges = FindEdgePoints();
            var p = Math.ceil(Math.random() * edges.length - 1);
            MakeChamber(edges[p].x, edges[p].y);
        }
        document.getElementById("calculating").style.display = "none";
    }, 10);
}
// On document ready 
document.addEventListener("DOMContentLoaded", Init);