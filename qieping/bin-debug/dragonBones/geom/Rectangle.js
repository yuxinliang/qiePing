var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    var Rectangle = (function () {
        function Rectangle(x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        Rectangle.prototype.copyFrom = function (value) {
            this.x = value.x;
            this.y = value.y;
            this.width = value.width;
            this.height = value.height;
        };
        Rectangle.prototype.clear = function () {
            this.x = this.y = 0;
            this.width = this.height = 0;
        };
        return Rectangle;
    }());
    dragonBones.Rectangle = Rectangle;
    __reflect(Rectangle.prototype, "dragonBones.Rectangle");
})(dragonBones || (dragonBones = {}));
//# sourceMappingURL=Rectangle.js.map