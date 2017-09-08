var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 基础变换对象。
     * @version DragonBones 4.5
     */
    var TransformObject = (function (_super) {
        __extends(TransformObject, _super);
        /**
         * @private
         */
        function TransformObject() {
            var _this = _super.call(this) || this;
            /**
             * @language zh_CN
             * 相对于骨架坐标系的变换。
             * @see dragonBones.Transform
             * @version DragonBones 3.0
             */
            _this.global = new dragonBones.Transform();
            /**
             * @language zh_CN
             * 相对于骨架或父骨骼坐标系的绑定变换。
             * @see dragonBones.Transform
             * @version DragonBones 3.0
             */
            _this.origin = new dragonBones.Transform();
            /**
             * @language zh_CN
             * 相对于骨架或父骨骼坐标系的偏移变换。
             * @see dragonBones.Transform
             * @version DragonBones 3.0
             */
            _this.offset = new dragonBones.Transform();
            /**
             * @private
             */
            _this._globalTransformMatrix = new dragonBones.Matrix();
            return _this;
        }
        /**
         * @inheritDoc
         */
        TransformObject.prototype._onClear = function () {
            this.userData = null;
            this.name = null;
            this.globalTransformMatrix = this._globalTransformMatrix;
            this.global.identity();
            this.origin.identity();
            this.offset.identity();
            this._armature = null;
            this._parent = null;
            this._globalTransformMatrix.identity();
        };
        /**
         * @private
         */
        TransformObject.prototype._setArmature = function (value) {
            this._armature = value;
        };
        /**
         * @private
         */
        TransformObject.prototype._setParent = function (value) {
            this._parent = value;
        };
        Object.defineProperty(TransformObject.prototype, "armature", {
            /**
             * @language zh_CN
             * 所属的骨架。
             * @see dragonBones.Armature
             * @version DragonBones 3.0
             */
            get: function () {
                return this._armature;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TransformObject.prototype, "parent", {
            /**
             * @language zh_CN
             * 所属的父骨骼。
             * @see dragonBones.Bone
             * @version DragonBones 3.0
             */
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        return TransformObject;
    }(dragonBones.BaseObject));
    dragonBones.TransformObject = TransformObject;
    __reflect(TransformObject.prototype, "dragonBones.TransformObject");
})(dragonBones || (dragonBones = {}));
//# sourceMappingURL=TransformObject.js.map