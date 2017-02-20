// debug flag
const debug = true;
const demoSrc = 'http://gdx.mlb.com/components/game/mlb/year_2016/month_05/day_20/master_scoreboard.json';

// create canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

const windowSizeAsPoint2D = function() {
    return new Point2D(window.innerWidth, window.innerHeight);
};

let windowSize = windowSizeAsPoint2D();
let controller = null;
let scoreboard = null;
let scoreboardList = null;

/**
 * Provide scoreboard data binding to rendered ListItem.
 */
class ScoreItem {
    constructor(data) {
        this.data = data;
        this.img = null;
        this.title = data.away_team_name + ' vs ' + data.home_team_name;
        this.description = data.location + ', ' + data.venue + ', ' + data.time;
        const imgPending = new Image();
        const t = this;
        imgPending.onload = function () {
            t.img = imgPending;
            console.log('loaded: ' + t.data.video_thumbnail);
        };
        imgPending.src = data.video_thumbnail;
    }
    getImage() { return this.img; }
    getTitle() { return this.title; }
    getDescription() { return this.description; }
}

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
    if (controller) { controller.render(ctx); }
};

const bindController = function (sb) {
    const itemSize = new Point2D(124, 70);
    const itemGap = 8;
    const origin = new Point2D(150, 150);
    controller = new Controller(window, ctx,
        new ListWidget('list', origin, windowSize, itemSize, sb, itemGap),
        100 // repeat interval
    );
};

const onResize = function() {
    windowSize = windowSizeAsPoint2D();
    resizeCanvas(windowSize.x, windowSize.y);
    if (scoreboardList) { bindController(scoreboardList); }
    renderCanvas();
};

const getJson = function(src, onLoad, onError, onTimeout) {
    const request = new XMLHttpRequest();
    request.ontimeout = function() { onTimeout(request); };
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            onLoad(JSON.parse(request.responseText)); // ??? may fail on parsing
        } else {
            onError(request);
        }
    };
    request.onerror = onError;
    request.open('GET', src, true);
    request.send(null);
};

const onScoreboard = function (sb) {
    // !!! update widget bindings
    console.debug(sb);
    scoreboard = sb;
    const x = [];
    const gameArray = sb.data.games.game;
    const len = gameArray.length;
    for (let index = 0; index < len; index++) {
        x.push(new ScoreItem(gameArray[index]));
    }
    scoreboardList = x;
    bindController(scoreboardList);
    renderCanvas();
};

const onFail = function (request) {
    // TODO render pop-up on failure to load
    console.error("request failed: " + request.status);
};

const onTimeout = function (request) {
    // TODO render pop-up on timeout
    console.error("request timed out:" + request.status);
};

const getScoreboard = function(dayOffset) {
    getJson(demoSrc, onScoreboard, onFail, onTimeout);
};

window.addEventListener('resize', onResize, false);
getScoreboard(0);
onResize();
