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
     * 龙骨数据，包含多个骨架数据。
     * @see dragonBones.ArmatureData
     * @version DragonBones 3.0
     */
    var DragonBonesData = (function (_super) {
        __extends(DragonBonesData, _super);
        /**
         * @private
         */
        function DragonBonesData() {
            var _this = _super.call(this) || this;
            /**
             * @language zh_CN
             * 所有的骨架数据。
             * @see dragonBones.ArmatureData
             * @version DragonBones 3.0
             */
            _this.armatures = {};
            _this._armatureNames = [];
            return _this;
        }
        /**
         * @private
         */
        DragonBonesData.toString = function () {
            return "[class dragonBones.DragonBonesData]";
        };
        /**
         * @inheritDoc
         */
        DragonBonesData.prototype._onClear = function () {
            this.autoSearch = false;
            this.frameRate = 0;
            this.name = null;
            this.userData = null;
            for (var i in this.armatures) {
                this.armatures[i].returnToPool();
                delete this.armatures[i];
            }
            if (this._armatureNames.length) {
                this._armatureNames.length = 0;
            }
        };
        /**
         * @language zh_CN
         * 获取指定名称的骨架。
         * @param name 骨架数据骨架名称。
         * @see dragonBones.ArmatureData
         * @version DragonBones 3.0
         */
        DragonBonesData.prototype.getArmature = function (name) {
            return this.armatures[name];
        };
        /**
         * @private
         */
        DragonBonesData.prototype.addArmature = function (value) {
            if (value && value.name && !this.armatures[value.name]) {
                this.armatures[value.name] = value;
                this._armatureNames.push(value.name);
                value.parent = this;
            }
            else {
                throw new Error();
            }
        };
        Object.defineProperty(DragonBonesData.prototype, "armatureNames", {
            /**
             * @language zh_CN
             * 所有的骨架数据名称。
             * @see #armatures
             * @version DragonBones 3.0
             */
            get: function () {
                return this._armatureNames;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeDragonBonesData()
         */
        DragonBonesData.prototype.dispose = function () {
            this.returnToPool();
        };
        return DragonBonesData;
    }(dragonBones.BaseObject));
    dragonBones.DragonBonesData = DragonBonesData;
    __reflect(DragonBonesData.prototype, "dragonBones.DragonBonesData");
})(dragonBones || (dragonBones = {}));
//# sourceMappingURL=DragonBonesData.js.map