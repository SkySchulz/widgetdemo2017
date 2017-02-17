describe("Point2D", function () {
    it("constructs correctly", function () {
        const sample = new Point2D(1138, 2017);
        expect(sample.x).toEqual(1138);
        expect(sample.y).toEqual(2017);
    });

    it("clones correctly", function () {
        const original = new Point2D(1138, 1977);
        const copy = original.clone();
        expect(copy).toEqual(original);
        copy.x = 1;
        expect(copy.x).toEqual(1);
        expect(original.x).toEqual(1138);

        //noinspection UnnecessaryLocalVariableJS
        const secondReference = copy;
        secondReference.x = 10;
        expect(copy.x).toEqual(10);
    });
});

describe("Widget", function () {
    const zeroPoint = new Point2D(0, 0);
    const position = new Point2D(0, 0);
    const size = new Point2D(10, 10);
    it("constructs", function () {
        const widget = new Widget('test', position, size);
        expect(widget.position).toEqual(position);
        expect(widget.size).toEqual(size);
        expect(widget.id).toEqual('test');
        expect(widget.children).toEqual({});
    });
    const parent = new Widget('parent', position, size);

    let didRender = false;
    class RenderWidgetTest extends Widget {
        render(position, context) {
            didRender = true;
        }
    }

    const child = new RenderWidgetTest('rwt', position, size);
    it("adds a child", function () {
        parent.addChild(child);
        expect(parent.children.hasOwnProperty('rwt')).toEqual(true);
    });

    it("renders a child", function () {
        parent.render(zeroPoint, null);
        expect(didRender).toEqual(true);
    });

    it("removes a child", function () {
        parent.removeChild(child);
        expect(parent.children.hasOwnProperty('rwt')).toEqual(false);
    });
});
