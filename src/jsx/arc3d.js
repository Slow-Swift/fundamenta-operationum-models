import JXG from "jsxgraph";

console.log(JXG.Geometry);

JXG.Arc3D = function (view, center, start, end, attributes) {
    var that;

    this.constructor(
        view.board,
        attributes,
        Const.OBJECT_TYPE_CURVE3D,
        Const.OBJECT_CLASS_3D
    ); 

    this.constructor3D(view, "arc3d");

    this.center = this.board.select(center);
    this.start = this.board.select(start);
    this.end = this.board.select(end);

    this.frame1 = [0, 1, 0, 0];
    this.frame2 = [0, 0, 1, 0];

    this.radius = 0;
    this.arcAngle = 0;

    if (Type.exists(this.center))

    this.center.addChild(this);
    this.start.addChild(this);
    this.end.addChild(this);

    this.updateGeometry();

    that = this;

    this.curve = view.create(
        "curve3d",
        [
            function (t) {
                var s = Math.sin(t),
                    c = Math.cos(t);

                return [
                    that.center.coords[1] +
                        that.radius *
                            (c * that.frame1[1] +
                                s * that.frame2[1]),

                    that.center.coords[2] +
                        that.radius *
                            (c * that.frame1[2] +
                                s * that.frame2[2]),

                    that.center.coords[3] +
                        that.radius *
                            (c * that.frame1[3] +
                                s * that.frame2[3])
                ];
            },

            function () {
                return [0, that.arcAngle];
            }
        ],
        attributes
    );
};

JXG.Arc3D.prototype = new JXG.GeometryElement();

Type.copyPrototypeMethods(
    JXG.Arc3D,
    JXG.GeometryElement3D,
    "constructor3D"
);

JXG.extend(JXG.Arc3D.prototype, {

    updateGeometry: function () {

        var c = [
                this.center.coords[1],
                this.center.coords[2],
                this.center.coords[3]
            ],

            s = [
                this.start.coords[1],
                this.start.coords[2],
                this.start.coords[3]
            ],

            e = [
                this.end.coords[1],
                this.end.coords[2],
                this.end.coords[3]
            ],

            r1,
            r2,
            n,
            len,
            dot,
            det;

        r1 = [
            s[0] - c[0],
            s[1] - c[1],
            s[2] - c[2]
        ];

        r2 = [
            e[0] - c[0],
            e[1] - c[1],
            e[2] - c[2]
        ];

        this.radius = Mat.norm(r1);

        if (this.radius < 1e-12) {
            return this;
        }

        for (let i = 0; i < 3; i++) {
            r1[i] /= this.radius;
        }

        len = Mat.norm(r2);

        if (len < 1e-12) {
            return this;
        }

        for (let i = 0; i < 3; i++) {
            r2[i] /= len;
        }

        n = Mat.crossProduct(r1, r2);

        len = Mat.norm(n);

        if (len < 1e-12) {
            return this;
        }

        for (let i = 0; i < 3; i++) {
            n[i] /= len;
        }

        this.frame1 = [
            0,
            r1[0],
            r1[1],
            r1[2]
        ];

        this.frame2 = Mat.crossProduct(
            n,
            r1
        );

        this.frame2.unshift(0);

        dot =
            r1[0] * r2[0] +
            r1[1] * r2[1] +
            r1[2] * r2[2];

        det =
            n[0] *
                (r1[1] * r2[2] -
                    r1[2] * r2[1]) +
            n[1] *
                (r1[2] * r2[0] -
                    r1[0] * r2[2]) +
            n[2] *
                (r1[0] * r2[1] -
                    r1[1] * r2[0]);

        this.arcAngle = Math.atan2(det, dot);

        if (this.arcAngle < 0) {
            this.arcAngle +=
                2 * Math.PI;
        }

        return this;
    },

    update: function () {

        if (this.needsUpdate) {
            this.updateGeometry();
        }

        return this;
    },

    updateRenderer: function () {
        this.needsUpdate = false;
        return this;
    },

    projectCoords: function (p, params) {
        return this.curve.projectCoords(
            p,
            params
        );
    }

});
