// base html5 canvas widget

/**
 * A two dimensional vertex.
 */
class Point2D {
    /**
     * @constructor
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return new Point2D(this.x, this.y);
    }

    static zero() {
        return new Point2D(0,0);
    }
}

/**
 * A basic widget, having an id, position, size, and parent widget.
 */
class Widget {
    /**
     * @constructor
     * @param {string} id
     * @param {Point2D} position, relative to parent position
     * @param {Point2D} size (absolute width and height of widget)
     */
    constructor(id, position, size) {
        this.id = id;
        this.position = position.clone();
        this.size = size.clone();
        this.children = {};
    }

    /**
     * Add a child widget.
     * @param {Widget} w
     */
    addChild(w) {
        this.children[w.id] = w;
    }

    /**
     * Remove a child widget by id.
     * @param {string} id
     */
    removeChildById(id) {
        if (this.children.hasOwnProperty(id)) {
            delete this.children[id];
        }
    }

    /**
     * Remove a child widget.
     * @param {Widget} w
     */
    removeChild(w) {
        this.removeChildById(w.id);
    }

    /**
     * Get child by id.
     * @param {string} id
     */
    getChildById(id) {
        return this.children.hasOwnProperty(id) ? this.children[id] : null;
    }

    /**
     * Render a widget graph - must be overridden in derivation & derivation must call super.render().
     * @parm {Point2D} position
     * @parm {Context???} context canvas render context
     */
    render(position, context) {
        // enumerate children and trigger render()
        const relativeToPosition = new Point2D(position.x + this.position.x, position.y + this.position.y);
        const children = this.children;
        for (const child in children) {
            if (children.hasOwnProperty(child)) {
                const w = children[child];
                w.render(new Point2D(relativeToPosition.x + w.position.x, relativeToPosition.y + w.position.y), context);
            }
        }
    }
}

class ListItem extends Widget {
    /**
     * @constructor
     * @param {string} id
     * @param {Point2D} position, relative to parent position
     * @param {Point2D} size (absolute width and height of widget)
     * @param {*} item to display: has a getImage(), a getTitle(), a getDescription()
     */
    constructor(id, position, size, item) {
        super(id, position, size);
        this.item = item;
    }

    render(position, context) {
        const img = this.item.getImage();
        if (img) {
            context.drawImage(img, position.x, position.y);
        } else {
            context.strokeStyle = "#FFFFFF";
            context.strokeWidth = 1;
            context.strokeRect(position.x, position.y, this.size.x, this.size.y);
        }
        context.font = "10px Arial";
        context.fillStyle = "white";
    }

    renderSelected(position, context) {
        const img = this.item.getImage();
        if (img) {
            context.shadowColor = 'black';
            context.shadowBlur = 10;
            context.fillStyle = 'white';
            context.fillRect(position.x, position.y, this.size.x *1.25, this.size.y * 1.25);
            context.drawImage(img, position.x, position.y, this.size.x * 1.25, this.size.y * 1.25);
        } else {
            context.strokeStyle = "#FFFFFF";
            context.lineWidth = 1;
            context.strokeRect(position.x, position.y, this.size.x * 1.25, this.size.y * 1.25);
        }
        context.font = "30px Arial";
        context.fillStyle = "white";
        context.fillText(this.item.getTitle(), position.x, position.y - 10);
        context.font = "20px Arial";
        // TODO use image size???
        context.fillText(this.item.getDescription(), position.x, position.y + (this.size.y * 1.25) + 30);
    }
}

class ListWidget extends Widget {

    /**
     * @constructor
     * @param {string} id
     * @param {Point2D} position
     * @param {Point2D} size
     * @param {Point2D} itemSize size of each item
     * @param {[]} list array of 'items'
     * @param {number} gap number of pixels between items
     */
    constructor(id, position, size, itemSize, list, gap) {
        super(id, position, size);
        this.itemWidth = itemSize.x + gap;
        this.list = list;
        this.selected = 0; // the currently selected item

        let p = Point2D.zero().clone(); // TODO compute position by percentage/configuration
        for (let index = 0, len = list.length; index < len; ++index) {
            this.addChild(new ListItem('item' + index, p, itemSize, list[index]));
            p.x += this.itemWidth;
        }

    }

    next() {
        this.selected = this.selected < this.list.length - 1 ? this.selected + 1 : this.selected;
    }

    previous() {
        this.selected = this.selected > 0 ? this.selected - 1 : 0;
    }

    /**
     * @param {Point2D} position
     * @param context
     */
    render(position, context) {
        const offset = new Point2D(position.x - (this.selected * this.itemWidth), position.y);
        super.render(offset, context);
        // render selected item, scaled
        const selected = this.getChildById('item' + this.selected);
        const selectedPosition = new Point2D(position.x + this.position.x, position.y + this.position.y);
        if (selected) { selected.renderSelected(selectedPosition, context); }
    }

}

class Controller {
    constructor(eventContext, renderContext, widget, repeatInterval) {
        this.eventContext = eventContext; // the source of input events
        this.renderContext = renderContext;
        this.widget = widget;
        this.inputState = {};
        this.updateDelta = 99999;
        this.origin = Point2D.zero();
        this.size = widget.size;
        this.nextDelta = 0;
        this.previousDelta = 0;
        this.repeatInterval = repeatInterval;

        this.lastUpdate = Date.now();

        // bind events
        eventContext.addEventListener('keydown', this);
        eventContext.addEventListener('keyup', this);

        const t = this;
        // bind tick event @ ~30Hz
        this.updateTimer = eventContext.setInterval(function () {
            const now = Date.now();
            t.update(now - t.lastUpdate);
            t.render(t.renderContext);
            t.lastUpdate = now;
        }, 33.33);
    }

    //noinspection JSUnusedGlobalSymbols
    handleEvent(event) {
        switch (event.type) {
            case 'keydown': this.inputState[event.keyCode] = true; break;
            case 'keyup': delete this.inputState[event.keyCode]; break;
        }
        event.preventDefault(); // needed?
    }

    /**
     * Monitor inputs and update selected accordingly.
     * @param delta milliseconds since last update
     */
    update(delta) {
        this.updateDelta += delta;
        if (39 in this.inputState) {
            if (this.nextDelta == 0) { this.widget.next(); }
            this.nextDelta += delta;
            if (this.nextDelta >= this.repeatInterval) { this.nextDelta = 0; }
        } else { this.nextDelta = 0;}
        if (37 in this.inputState) {
            if (this.previousDelta == 0) { this.widget.previous(); }
            this.previousDelta += delta;
            if (this.previousDelta >= this.repeatInterval) { this.previousDelta = 0; }
        } else { this.previousDelta = 0; }
    }

    render(context) {
        context.clearRect(this.origin.x, this.origin.y, this.size.x, this.size.y);
        this.widget.render(this.origin, context);
    }
}