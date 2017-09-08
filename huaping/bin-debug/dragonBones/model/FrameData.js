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
    var ActionData = (function (_super) {
        __extends(ActionData, _super);
        function ActionData() {
            return _super.call(this) || this;
        }
        ActionData.toString = function () {
            return "[class dragonBones.ActionData]";
        };
        ActionData.prototype._onClear = function () {
            this.type = 0 /* Play */;
            this.data = null;
            this.bone = null;
            this.slot = null;
        };
        return ActionData;
    }(dragonBones.BaseObject));
    dragonBones.ActionData = ActionData;
    __reflect(ActionData.prototype, "dragonBones.ActionData");
    /**
     * @private
     */
    var EventData = (function (_super) {
        __extends(EventData, _super);
        function EventData() {
            return _super.call(this) || this;
        }
        EventData.toString = function () {
            return "[class dragonBones.EventData]";
        };
        EventData.prototype._onClear = function () {
            this.type = 10 /* Frame */;
            this.name = null;
            this.data = null;
            this.bone = null;
            this.slot = null;
        };
        return EventData;
    }(dragonBones.BaseObject));
    dragonBones.EventData = EventData;
    __reflect(EventData.prototype, "dragonBones.EventData");
    /**
     * @private
     */
    var FrameData = (function (_super) {
        __extends(FrameData, _super);
        function FrameData() {
            return _super.call(this) || this;
        }
        /**
         * @inheritDoc
         */
        FrameData.prototype._onClear = function () {
            this.position = 0;
            this.duration = 0;
            this.prev = null;
            this.next = null;
        };
        return FrameData;
    }(dragonBones.BaseObject));
    dragonBones.FrameData = FrameData;
    __reflect(FrameData.prototype, "dragonBones.FrameData");
    /**
     * @private
     */
    var TweenFrameData = (function (_super) {
        __extends(TweenFrameData, _super);
        function TweenFrameData() {
            return _super.call(this) || this;
        }
        TweenFrameData.samplingCurve = function (curve, frameCount) {
            if (curve.length == 0 || frameCount == 0) {
                return null;
            }
            var samplingTimes = frameCount + 2;
            var samplingStep = 1 / samplingTimes;
            var sampling = new Array((samplingTimes - 1) * 2);
            //
            curve = curve.concat();
            curve.unshift(0, 0);
            curve.push(1, 1);
            var stepIndex = 0;
            for (var i = 0; i < samplingTimes - 1; ++i) {
                var step = samplingStep * (i + 1);
                while (curve[stepIndex + 6] < step) {
                    stepIndex += 6; // stepIndex += 3 * 2
                }
                var x1 = curve[stepIndex];
                var x4 = curve[stepIndex + 6];
                var t = (step - x1) / (x4 - x1);
                var l_t = 1 - t;
                var powA = l_t * l_t;
                var powB = t * t;
                var kA = l_t * powA;
                var kB = 3 * t * powA;
                var kC = 3 * l_t * powB;
                var kD = t * powB;
                sampling[i * 2] = kA * x1 + kB * curve[stepIndex + 2] + kC * curve[stepIndex + 4] + kD * x4;
                sampling[i * 2 + 1] = kA * curve[stepIndex + 1] + kB * curve[stepIndex + 3] + kC * curve[stepIndex + 5] + kD * curve[stepIndex + 7];
            }
            return sampling;
        };
        /**
         * @inheritDoc
         */
        TweenFrameData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.tweenEasing = 0;
            this.curve = null;
        };
        return TweenFrameData;
    }(FrameData));
    dragonBones.TweenFrameData = TweenFrameData;
    __reflect(TweenFrameData.prototype, "dragonBones.TweenFrameData");
    /**
     * @private
     */
    var AnimationFrameData = (function (_super) {
        __extends(AnimationFrameData, _super);
        function AnimationFrameData() {
            var _this = _super.call(this) || this;
            _this.actions = [];
            _this.events = [];
            return _this;
        }
        AnimationFrameData.toString = function () {
            return "[class dragonBones.AnimationFrameData]";
        };
        /**
         * @inheritDoc
         */
        AnimationFrameData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            if (this.actions.length) {
                for (var i = 0, l = this.actions.length; i < l; ++i) {
                    this.actions[i].returnToPool();
                }
                this.actions.length = 0;
            }
            if (this.events.length) {
                for (var i = 0, l = this.events.length; i < l; ++i) {
                    this.events[i].returnToPool();
                }
                this.events.length = 0;
            }
        };
        return AnimationFrameData;
    }(FrameData));
    dragonBones.AnimationFrameData = AnimationFrameData;
    __reflect(AnimationFrameData.prototype, "dragonBones.AnimationFrameData");
    /**
     * @private
     */
    var BoneFrameData = (function (_super) {
        __extends(BoneFrameData, _super);
        function BoneFrameData() {
            var _this = _super.call(this) || this;
            _this.transform = new dragonBones.Transform();
            return _this;
        }
        BoneFrameData.toString = function () {
            return "[class dragonBones.BoneFrameData]";
        };
        /**
         * @inheritDoc
         */
        BoneFrameData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.tweenScale = false;
            this.tweenRotate = 0;
            this.transform.identity();
        };
        return BoneFrameData;
    }(TweenFrameData));
    dragonBones.BoneFrameData = BoneFrameData;
    __reflect(BoneFrameData.prototype, "dragonBones.BoneFrameData");
    /**
     * @private
     */
    var SlotFrameData = (function (_super) {
        __extends(SlotFrameData, _super);
        function SlotFrameData() {
            return _super.call(this) || this;
        }
        SlotFrameData.generateColor = function () {
            return new dragonBones.ColorTransform();
        };
        SlotFrameData.toString = function () {
            return "[class dragonBones.SlotFrameData]";
        };
        /**
         * @inheritDoc
         */
        SlotFrameData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.displayIndex = 0;
            this.zOrder = 0;
            this.color = null;
        };
        return SlotFrameData;
    }(TweenFrameData));
    SlotFrameData.DEFAULT_COLOR = new dragonBones.ColorTransform();
    dragonBones.SlotFrameData = SlotFrameData;
    __reflect(SlotFrameData.prototype, "dragonBones.SlotFrameData");
    /**
     * @private
     */
    var ExtensionFrameData = (function (_super) {
        __extends(ExtensionFrameData, _super);
        function ExtensionFrameData() {
            var _this = _super.call(this) || this;
            _this.tweens = [];
            _this.keys = [];
            return _this;
        }
        ExtensionFrameData.toString = function () {
            return "[class dragonBones.ExtensionFrameData]";
        };
        /**
         * @inheritDoc
         */
        ExtensionFrameData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.type = 0 /* FFD */;
            if (this.tweens.length) {
                this.tweens.length = 0;
            }
            if (this.keys.length) {
                this.keys.length = 0;
            }
        };
        return ExtensionFrameData;
    }(TweenFrameData));
    dragonBones.ExtensionFrameData = ExtensionFrameData;
    __reflect(ExtensionFrameData.prototype, "dragonBones.ExtensionFrameData");
})(dragonBones || (dragonBones = {}));
//# sourceMappingURL=FrameData.js.map