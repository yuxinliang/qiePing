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
     * @private
     */
    var TimelineData = (function (_super) {
        __extends(TimelineData, _super);
        function TimelineData() {
            var _this = _super.call(this) || this;
            /**
             * @private
             */
            _this.frames = [];
            return _this;
        }
        /**
         * @inheritDoc
         */
        TimelineData.prototype._onClear = function () {
            this.scale = 1;
            this.offset = 0;
            if (this.frames.length) {
                var prevFrame = null;
                for (var i = 0, l = this.frames.length; i < l; ++i) {
                    var frame = this.frames[i];
                    if (prevFrame && frame != prevFrame) {
                        prevFrame.returnToPool();
                    }
                    prevFrame = frame;
                }
                this.frames.length = 0;
            }
        };
        return TimelineData;
    }(dragonBones.BaseObject));
    dragonBones.TimelineData = TimelineData;
    __reflect(TimelineData.prototype, "dragonBones.TimelineData");
    /**
     * @private
     */
    var BoneTimelineData = (function (_super) {
        __extends(BoneTimelineData, _super);
        function BoneTimelineData() {
            var _this = _super.call(this) || this;
            _this.bone = null;
            _this.originTransform = new dragonBones.Transform();
            _this.cachedFrames = [];
            return _this;
        }
        BoneTimelineData.cacheFrame = function (cacheFrames, cacheFrameIndex, globalTransformMatrix) {
            var cacheMatrix = cacheFrames[cacheFrameIndex] = new dragonBones.Matrix();
            cacheMatrix.copyFrom(globalTransformMatrix);
            return cacheMatrix;
        };
        BoneTimelineData.toString = function () {
            return "[class dragonBones.BoneTimelineData]";
        };
        /**
         * @inheritDoc
         */
        BoneTimelineData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.bone = null;
            this.originTransform.identity();
            if (this.cachedFrames.length) {
                this.cachedFrames.length = 0;
            }
        };
        BoneTimelineData.prototype.cacheFrames = function (cacheFrameCount) {
            this.cachedFrames.length = 0;
            this.cachedFrames.length = cacheFrameCount;
        };
        return BoneTimelineData;
    }(TimelineData));
    dragonBones.BoneTimelineData = BoneTimelineData;
    __reflect(BoneTimelineData.prototype, "dragonBones.BoneTimelineData");
    /**
     * @private
     */
    var SlotTimelineData = (function (_super) {
        __extends(SlotTimelineData, _super);
        function SlotTimelineData() {
            var _this = _super.call(this) || this;
            _this.slot = null;
            _this.cachedFrames = [];
            return _this;
        }
        SlotTimelineData.cacheFrame = function (cacheFrames, cacheFrameIndex, globalTransformMatrix) {
            var cacheMatrix = cacheFrames[cacheFrameIndex] = new dragonBones.Matrix();
            cacheMatrix.copyFrom(globalTransformMatrix);
            return cacheMatrix;
        };
        SlotTimelineData.toString = function () {
            return "[class dragonBones.SlotTimelineData]";
        };
        /**
         * @inheritDoc
         */
        SlotTimelineData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.slot = null;
            if (this.cachedFrames.length) {
                this.cachedFrames.length = 0;
            }
        };
        SlotTimelineData.prototype.cacheFrames = function (cacheFrameCount) {
            this.cachedFrames.length = 0;
            this.cachedFrames.length = cacheFrameCount;
        };
        return SlotTimelineData;
    }(TimelineData));
    dragonBones.SlotTimelineData = SlotTimelineData;
    __reflect(SlotTimelineData.prototype, "dragonBones.SlotTimelineData");
    /**
     * @private
     */
    var FFDTimelineData = (function (_super) {
        __extends(FFDTimelineData, _super);
        function FFDTimelineData() {
            var _this = _super.call(this) || this;
            _this.displayIndex = 0;
            _this.skin = null;
            _this.slot = null;
            return _this;
        }
        FFDTimelineData.toString = function () {
            return "[class dragonBones.FFDTimelineData]";
        };
        /**
         * @inheritDoc
         */
        FFDTimelineData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.displayIndex = 0;
            this.skin = null;
            this.slot = null;
        };
        return FFDTimelineData;
    }(TimelineData));
    dragonBones.FFDTimelineData = FFDTimelineData;
    __reflect(FFDTimelineData.prototype, "dragonBones.FFDTimelineData");
})(dragonBones || (dragonBones = {}));
//# sourceMappingURL=TimelineData.js.map