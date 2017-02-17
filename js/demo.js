// debug flag
const debug = true;
const demoSrc = 'http://gdx.mlb.com/components/game/mlb/year_2016/month_05/day_20/master_scoreboard.json';

// create canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

const resizeCanvas = function (w, h) {
    canvas.width = w;
    canvas.height = h;
};

const renderTest = function() {
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = '5';
    ctx.strokeRect(1, 1, canvas.width -1, canvas.height-1);
};

const renderCanvas = function() {
    if (debug) { renderTest(); }
};

const onResize = function() {
    resizeCanvas(window.innerWidth, window.innerHeight);
    renderCanvas();
};

const getJson = function(src, onLoad, onFail, onTimeout) {
    const request = new XMLHttpRequest();
    request.ontimeout = function() { onTimeout(request); };
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            onLoad(JSON.parse(request.responseText)); // ??? may fail on parsing
        } else {
            onFail(request);
        }
    };
    request.onerror = onFail;
    request.open('GET', src, true);
    request.send(null);
};

// /////////////////////////////////////////////
// let images = {};
// const imageSource = [];
// const loadImages = function () {
//     for (let src of imageSource) {
//         const img = new Image();
//         img.onload = function();
//     }
// };
/////////////////////////////////////////////

const onScoreboard = function (sb) {
    // !!! update widget bindings
    console.debug(sb);
    renderCanvas();
};

const onFail = function (request) {
    // !!! render pop-up on failure to load
    console.error("request failed: " + request.status);
};

const onTimeout = function () {
    // !!! render pop-up on timeout
};

const getScoreboard = function(dayOffset) {
    getJson(demoSrc, onScoreboard, onFail, onTimeout);
};

const init = function() {
    window.addEventListener('resize', onResize, false);
    getScoreboard(0);
    onResize();
};

// resizeCanvas(window.innerWidth, window.innerHeight);
init();
