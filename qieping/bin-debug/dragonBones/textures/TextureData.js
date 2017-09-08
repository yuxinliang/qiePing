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
     * 贴图集数据。
     * @version DragonBones 3.0
     */
    var TextureAtlasData = (function (_super) {
        __extends(TextureAtlasData, _super);
        /**
         * @private
         */
        function TextureAtlasData() {
            var _this = _super.call(this) || this;
            /**
             * @private
             */
            _this.textures = {};
            return _this;
        }
        /**
         * @inheritDoc
         */
        TextureAtlasData.prototype._onClear = function () {
            this.autoSearch = false;
            this.scale = 1;
            this.name = null;
            this.imagePath = null;
            for (var i in this.textures) {
                this.textures[i].returnToPool();
                delete this.textures[i];
            }
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeDragonBonesData()
         */
        TextureAtlasData.prototype.dispose = function () {
            this.returnToPool();
        };
        /**
         * @private
         */
        TextureAtlasData.prototype.addTexture = function (value) {
            if (value && value.name && !this.textures[value.name]) {
                this.textures[value.name] = value;
                value.parent = this;
            }
            else {
            }
        };
        /**
         * @private
         */
        TextureAtlasData.prototype.getTexture = function (name) {
            return this.textures[name];
        };
        return TextureAtlasData;
    }(dragonBones.BaseObject));
    dragonBones.TextureAtlasData = TextureAtlasData;
    __reflect(TextureAtlasData.prototype, "dragonBones.TextureAtlasData");
    /**
     * @private
     */
    var TextureData = (function (_super) {
        __extends(TextureData, _super);
        function TextureData() {
            var _this = _super.call(this) || this;
            _this.region = new dragonBones.Rectangle();
            return _this;
        }
        TextureData.generateRectangle = function () {
            return new dragonBones.Rectangle();
        };
        /**
         * @inheritDoc
         */
        TextureData.prototype._onClear = function () {
            this.rotated = false;
            this.name = null;
            this.frame = null;
            this.parent = null;
            this.region.clear();
        };
        return TextureData;
    }(dragonBones.BaseObject));
    dragonBones.TextureData = TextureData;
    __reflect(TextureData.prototype, "dragonBones.TextureData");
})(dragonBones || (dragonBones = {}));
//# sourceMappingURL=TextureData.js.map