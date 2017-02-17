// debug flag
var debug = true;

// create canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

var resizeCanvas = function (w, h) {
    canvas.width = w;
    canvas.height = h;
};

var renderTest = function() {
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = '5';
    ctx.strokeRect(1, 1, canvas.width -1, canvas.height-1);
};

var renderCanvas = function() {
    if (debug) { renderTest(); }
};

var onResize = function() {
    resizeCanvas(window.innerWidth, window.innerHeight);
    renderCanvas();
};

var init = function() {
    window.addEventListener('resize', onResize, false);
    onResize();
};

// resizeCanvas(window.innerWidth, window.innerHeight);
init();
