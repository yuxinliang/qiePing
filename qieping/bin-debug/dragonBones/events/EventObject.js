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
     * 事件数据。
     * @version DragonBones 4.5
     */
    var EventObject = (function (_super) {
        __extends(EventObject, _super);
        /**
         * @private
         */
        function EventObject() {
            return _super.call(this) || this;
        }
        /**
         * @private
         */
        EventObject.toString = function () {
            return "[class dragonBones.EventObject]";
        };
        /**
         * @inheritDoc
         */
        EventObject.prototype._onClear = function () {
            this.type = null;
            this.name = null;
            this.data = null;
            this.armature = null;
            this.bone = null;
            this.slot = null;
            this.animationState = null;
            this.frame = null;
            this.userData = null;
        };
        Object.defineProperty(EventObject.prototype, "animationName", {
            /**
             * @see #animationState
             */
            get: function () {
                return this.animationState.name;
            },
            enumerable: true,
            configurable: true
        });
        return EventObject;
    }(dragonBones.BaseObject));
    /**
     * @language zh_CN
     * 动画开始。
     * @version DragonBones 4.5
     */
    EventObject.START = "start";
    /**
     * @language zh_CN
     * 动画循环播放一次完成。
     * @version DragonBones 4.5
     */
    EventObject.LOOP_COMPLETE = "loopComplete";
    /**
     * @language zh_CN
     * 动画播放完成。
     * @version DragonBones 4.5
     */
    EventObject.COMPLETE = "complete";
    /**
     * @language zh_CN
     * 动画淡入开始。
     * @version DragonBones 4.5
     */
    EventObject.FADE_IN = "fadeIn";
    /**
     * @language zh_CN
     * 动画淡入完成。
     * @version DragonBones 4.5
     */
    EventObject.FADE_IN_COMPLETE = "fadeInComplete";
    /**
     * @language zh_CN
     * 动画淡出开始。
     * @version DragonBones 4.5
     */
    EventObject.FADE_OUT = "fadeOut";
    /**
     * @language zh_CN
     * 动画淡出完成。
     * @version DragonBones 4.5
     */
    EventObject.FADE_OUT_COMPLETE = "fadeOutComplete";
    /**
     * @language zh_CN
     * 动画帧事件。
     * @version DragonBones 4.5
     */
    EventObject.FRAME_EVENT = "frameEvent";
    /**
     * @language zh_CN
     * 动画声音事件。
     * @version DragonBones 4.5
     */
    EventObject.SOUND_EVENT = "soundEvent";
    /**
     * @private
     */
    EventObject._soundEventManager = null;
    dragonBones.EventObject = EventObject;
    __reflect(EventObject.prototype, "dragonBones.EventObject");
})(dragonBones || (dragonBones = {}));
//# sourceMappingURL=EventObject.js.map