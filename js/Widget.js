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
        this.position = position;
        this.size = size;
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
     * Render a widget graph - must be overridden in derivation & derivation must call super.render().
     * @parm {Point2D} position
     * @parm {Context???} context canvas render context
     */
    render(position, context) {
        // enumerate children and trigger render()
        const relativeToParent = new Point2D(position.x + this.x, position.y + this.y);
        Object.entries(this.children).forEach(([id, w]) => {
            w.render(relativeToParent, context);
        });
    }
}
