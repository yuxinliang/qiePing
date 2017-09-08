var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 2D 矩阵。
     * @version DragonBones 3.0
     */
    var Matrix = (function () {
        function Matrix(a, b, c, d, tx, ty) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 1; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }
        /**
         * @language zh_CN
         * 复制矩阵。
         * @param value 需要复制的矩阵。
         * @version DragonBones 3.0
         */
        Matrix.prototype.copyFrom = function (value) {
            this.a = value.a;
            this.b = value.b;
            this.c = value.c;
            this.d = value.d;
            this.tx = value.tx;
            this.ty = value.ty;
        };
        /**
         * @language zh_CN
         * 转换为恒等矩阵。
         * @version DragonBones 3.0
         */
        Matrix.prototype.identity = function () {
            this.a = this.d = 1;
            this.b = this.c = 0;
            this.tx = this.ty = 0;
        };
        /**
         * @language zh_CN
         * 将当前矩阵与另一个矩阵相乘。
         * @param value 需要相乘的矩阵。
         * @version DragonBones 3.0
         */
        Matrix.prototype.concat = function (value) {
            var aA = this.a;
            var bA = this.b;
            var cA = this.c;
            var dA = this.d;
            var txA = this.tx;
            var tyA = this.ty;
            var aB = value.a;
            var bB = value.b;
            var cB = value.c;
            var dB = value.d;
            var txB = value.tx;
            var tyB = value.ty;
            this.a = aA * aB + bA * cB;
            this.b = aA * bB + bA * dB;
            this.c = cA * aB + dA * cB;
            this.d = cA * bB + dA * dB;
            this.tx = aB * txA + cB * tyA + txB;
            this.ty = dB * tyA + bB * txA + tyB;
            /*
            [
                this.a,
                this.b,
                this.c,
                this.d,
                this.tx,
                this.ty
            ] = [
                this.a * value.a + this.b * value.c,
                this.a * value.b + this.b * value.d,
                this.c * value.a + this.d * value.c,
                this.c * value.b + this.d * value.d,
                value.a * this.tx + value.c * this.tx + value.tx,
                value.d * this.ty + value.b * this.ty + value.ty
            ];
            */
        };
        /**
         * @language zh_CN
         * 转换为逆矩阵。
         * @version DragonBones 3.0
         */
        Matrix.prototype.invert = function () {
            var aA = this.a;
            var bA = this.b;
            var cA = this.c;
            var dA = this.d;
            var txA = this.tx;
            var tyA = this.ty;
            var n = aA * dA - bA * cA;
            this.a = dA / n;
            this.b = -bA / n;
            this.c = -cA / n;
            this.d = aA / n;
            this.tx = (cA * tyA - dA * txA) / n;
            this.ty = -(aA * tyA - bA * txA) / n;
        };
        /**
         * @language zh_CN
         * 将矩阵转换应用于指定点。
         * @param x 横坐标。
         * @param y 纵坐标。
         * @param result 应用转换之后的坐标。
         * @params delta 是否忽略 tx，ty 对坐标的转换。
         * @version DragonBones 3.0
         */
        Matrix.prototype.transformPoint = function (x, y, result, delta) {
            if (delta === void 0) { delta = false; }
            result.x = this.a * x + this.c * y;
            result.y = this.b * x + this.d * y;
            if (!delta) {
                result.x += this.tx;
                result.y += this.ty;
            }
        };
        return Matrix;
    }());
    dragonBones.Matrix = Matrix;
    __reflect(Matrix.prototype, "dragonBones.Matrix");
})(dragonBones || (dragonBones = {}));
//# sourceMappingURL=Matrix.js.map