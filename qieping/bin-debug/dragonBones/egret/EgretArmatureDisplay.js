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
     * Egret 事件。
     * @version DragonBones 4.5
     */
    var EgretEvent = (function (_super) {
        __extends(EgretEvent, _super);
        /**
         * @private
         */
        function EgretEvent(type, bubbles, cancelable, data) {
            return _super.call(this, type, bubbles, cancelable, data) || this;
        }
        Object.defineProperty(EgretEvent.prototype, "eventObject", {
            /**
             * @language zh_CN
             * 事件对象。
             * @version DragonBones 4.5
             */
            get: function () {
                return this.data;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretEvent.prototype, "frameLabel", {
            /**
             * @see dragonBones.EventObject#name
             */
            get: function () {
                return this.eventObject.name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretEvent.prototype, "sound", {
            /**
             * @see dragonBones.EventObject#name
             */
            get: function () {
                return this.eventObject.name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretEvent.prototype, "animationName", {
            /**
             * @see dragonBones.EventObject#animationName
             */
            get: function () {
                return this.eventObject.animationState.name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretEvent.prototype, "armature", {
            /**
             * @see dragonBones.EventObject#armature
             */
            get: function () {
                return this.eventObject.armature;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretEvent.prototype, "bone", {
            /**
             * @see dragonBones.EventObject#bone
             */
            get: function () {
                return this.eventObject.bone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretEvent.prototype, "slot", {
            /**
             * @see dragonBones.EventObject#slot
             */
            get: function () {
                return this.eventObject.slot;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretEvent.prototype, "animationState", {
            /**
             * @see dragonBones.EventObject#animationState
             */
            get: function () {
                return this.eventObject.animationState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretEvent.prototype, "movementID", {
            /**
             * @deprecated
             * @see #animationName
             */
            get: function () {
                return this.animationName;
            },
            enumerable: true,
            configurable: true
        });
        return EgretEvent;
    }(egret.Event));
    /**
     * @see dragonBones.EventObject.START
     */
    EgretEvent.START = dragonBones.EventObject.START;
    /**
     * @see dragonBones.EventObject.LOOP_COMPLETE
     */
    EgretEvent.LOOP_COMPLETE = dragonBones.EventObject.LOOP_COMPLETE;
    /**
     * @see dragonBones.EventObject.COMPLETE
     */
    EgretEvent.COMPLETE = dragonBones.EventObject.COMPLETE;
    /**
     * @see dragonBones.EventObject.FADE_IN
     */
    EgretEvent.FADE_IN = dragonBones.EventObject.FADE_IN;
    /**
     * @see dragonBones.EventObject.FADE_IN_COMPLETE
     */
    EgretEvent.FADE_IN_COMPLETE = dragonBones.EventObject.FADE_IN_COMPLETE;
    /**
     * @see dragonBones.EventObject.FADE_OUT
     */
    EgretEvent.FADE_OUT = dragonBones.EventObject.FADE_OUT;
    /**
     * @see dragonBones.EventObject.FADE_OUT_COMPLETE
     */
    EgretEvent.FADE_OUT_COMPLETE = dragonBones.EventObject.FADE_OUT_COMPLETE;
    /**
     * @see dragonBones.EventObject.FRAME_EVENT
     */
    EgretEvent.FRAME_EVENT = dragonBones.EventObject.FRAME_EVENT;
    /**
     * @see dragonBones.EventObject.SOUND_EVENT
     */
    EgretEvent.SOUND_EVENT = dragonBones.EventObject.SOUND_EVENT;
    /**
     * @deprecated
     * @see dragonBones.EventObject.FRAME_EVENT
     */
    EgretEvent.ANIMATION_FRAME_EVENT = dragonBones.EventObject.FRAME_EVENT;
    /**
     * @deprecated
     * @see dragonBones.EventObject.FRAME_EVENT
     */
    EgretEvent.BONE_FRAME_EVENT = dragonBones.EventObject.FRAME_EVENT;
    /**
     * @deprecated
     * @see dragonBones.EventObject.FRAME_EVENT
     */
    EgretEvent.MOVEMENT_FRAME_EVENT = dragonBones.EventObject.FRAME_EVENT;
    /**
     * @deprecated
     * @see dragonBones.EventObject.SOUND_EVENT
     */
    EgretEvent.SOUND = dragonBones.EventObject.SOUND_EVENT;
    dragonBones.EgretEvent = EgretEvent;
    __reflect(EgretEvent.prototype, "dragonBones.EgretEvent");
    /**
     * @inheritDoc
     */
    var EgretArmatureDisplay = (function (_super) {
        __extends(EgretArmatureDisplay, _super);
        /**
         * @private
         */
        function EgretArmatureDisplay() {
            var _this = _super.call(this) || this;
            if (!EgretArmatureDisplay._clock) {
                EgretArmatureDisplay._clock = new dragonBones.WorldClock();
                EgretArmatureDisplay._clock.time = egret.getTimer() * 0.001;
                egret.startTick(EgretArmatureDisplay._clockHandler, EgretArmatureDisplay);
            }
            return _this;
        }
        EgretArmatureDisplay._clockHandler = function (time) {
            time *= 0.001;
            var passedTime = EgretArmatureDisplay.passTime > 0 ? EgretArmatureDisplay.passTime : (time - EgretArmatureDisplay._clock.time);
            EgretArmatureDisplay._clock.advanceTime(passedTime);
            EgretArmatureDisplay._clock.time = time;
            return false;
        };
        /**
         * @inheritDoc
         */
        EgretArmatureDisplay.prototype._onClear = function () {
            this._armature = null;
            this._debugDrawer = null;
        };
        /**
         * @inheritDoc
         */
        EgretArmatureDisplay.prototype._dispatchEvent = function (eventObject) {
            var event = egret.Event.create(EgretEvent, eventObject.type);
            event.data = eventObject;
            this.dispatchEvent(event);
            egret.Event.release(event);
        };
        /**
         * @inheritDoc
         */
        EgretArmatureDisplay.prototype._debugDraw = function () {
            if (!this._debugDrawer) {
                this._debugDrawer = new egret.Shape();
            }
            this.addChild(this._debugDrawer);
            this._debugDrawer.graphics.clear();
            var bones = this._armature.getBones();
            for (var i = 0, l = bones.length; i < l; ++i) {
                var bone = bones[i];
                var boneLength = Math.max(bone.length, 5);
                var startX = bone.globalTransformMatrix.tx;
                var startY = bone.globalTransformMatrix.ty;
                var endX = startX + bone.globalTransformMatrix.a * boneLength;
                var endY = startY + bone.globalTransformMatrix.b * boneLength;
                this._debugDrawer.graphics.lineStyle(1, bone.ik ? 0xFF0000 : 0x00FF00, 0.5);
                this._debugDrawer.graphics.moveTo(startX, startY);
                this._debugDrawer.graphics.lineTo(endX, endY);
            }
        };
        /**
         * @inheritDoc
         */
        EgretArmatureDisplay.prototype.hasEvent = function (type) {
            return this.hasEventListener(type);
        };
        /**
         * @inheritDoc
         */
        EgretArmatureDisplay.prototype.addEvent = function (type, listener, target) {
            this.addEventListener(type, listener, target);
        };
        /**
         * @inheritDoc
         */
        EgretArmatureDisplay.prototype.removeEvent = function (type, listener, target) {
            this.removeEventListener(type, listener, target);
        };
        /**
         * @inheritDoc
         */
        EgretArmatureDisplay.prototype.advanceTimeBySelf = function (on) {
            if (on) {
                EgretArmatureDisplay._clock.add(this._armature);
            }
            else {
                EgretArmatureDisplay._clock.remove(this._armature);
            }
        };
        /**
         * @inheritDoc
         */
        EgretArmatureDisplay.prototype.dispose = function () {
            if (this._armature) {
                this.advanceTimeBySelf(false);
                this._armature.dispose();
                this._armature = null;
            }
        };
        Object.defineProperty(EgretArmatureDisplay.prototype, "armature", {
            /**
             * @inheritDoc
             */
            get: function () {
                return this._armature;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretArmatureDisplay.prototype, "animation", {
            /**
             * @inheritDoc
             */
            get: function () {
                return this._armature.animation;
            },
            enumerable: true,
            configurable: true
        });
        return EgretArmatureDisplay;
    }(egret.DisplayObjectContainer));
    EgretArmatureDisplay.passTime = 0;
    EgretArmatureDisplay._clock = null;
    dragonBones.EgretArmatureDisplay = EgretArmatureDisplay;
    __reflect(EgretArmatureDisplay.prototype, "dragonBones.EgretArmatureDisplay", ["dragonBones.IArmatureDisplay", "dragonBones.IEventDispatcher"]);
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    var AnimationEvent = (function (_super) {
        __extends(AnimationEvent, _super);
        function AnimationEvent() {
            return _super.apply(this, arguments) || this;
        }
        return AnimationEvent;
    }(EgretEvent));
    dragonBones.AnimationEvent = AnimationEvent;
    __reflect(AnimationEvent.prototype, "dragonBones.AnimationEvent");
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    var FrameEvent = (function (_super) {
        __extends(FrameEvent, _super);
        function FrameEvent() {
            return _super.apply(this, arguments) || this;
        }
        return FrameEvent;
    }(EgretEvent));
    dragonBones.FrameEvent = FrameEvent;
    __reflect(FrameEvent.prototype, "dragonBones.FrameEvent");
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    var SoundEvent = (function (_super) {
        __extends(SoundEvent, _super);
        function SoundEvent() {
            return _super.apply(this, arguments) || this;
        }
        return SoundEvent;
    }(EgretEvent));
    dragonBones.SoundEvent = SoundEvent;
    __reflect(SoundEvent.prototype, "dragonBones.SoundEvent");
    /**
     * @deprecated
     * @see dragonBones.EgretTextureAtlasData
     */
    var EgretTextureAtlas = (function (_super) {
        __extends(EgretTextureAtlas, _super);
        function EgretTextureAtlas(texture, rawData, scale) {
            if (scale === void 0) { scale = 1; }
            var _this = _super.call(this) || this;
            _this._onClear();
            _this.texture = texture;
            dragonBones.ObjectDataParser.getInstance().parseTextureAtlasData(rawData, _this, scale);
            return _this;
        }
        /**
         * @private
         */
        EgretTextureAtlas.toString = function () {
            return "[class dragonBones.EgretTextureAtlas]";
        };
        return EgretTextureAtlas;
    }(dragonBones.EgretTextureAtlasData));
    dragonBones.EgretTextureAtlas = EgretTextureAtlas;
    __reflect(EgretTextureAtlas.prototype, "dragonBones.EgretTextureAtlas");
    /**
     * @deprecated
     * @see dragonBones.EgretTextureAtlasData
     */
    var EgretSheetAtlas = (function (_super) {
        __extends(EgretSheetAtlas, _super);
        function EgretSheetAtlas() {
            return _super.apply(this, arguments) || this;
        }
        return EgretSheetAtlas;
    }(EgretTextureAtlas));
    dragonBones.EgretSheetAtlas = EgretSheetAtlas;
    __reflect(EgretSheetAtlas.prototype, "dragonBones.EgretSheetAtlas");
    /**
     * @deprecated
     * @see dragonBones.EgretFactory#soundEventManater
     */
    var SoundEventManager = (function () {
        function SoundEventManager() {
        }
        /**
         * @deprecated
         * @see dragonBones.EgretFactory#soundEventManater
         */
        SoundEventManager.getInstance = function () {
            return dragonBones.EventObject._soundEventManager;
        };
        return SoundEventManager;
    }());
    dragonBones.SoundEventManager = SoundEventManager;
    __reflect(SoundEventManager.prototype, "dragonBones.SoundEventManager");
    /**
     * @deprecated
     * @see dragonBones.Armature#cacheFrameRate
     * @see dragonBones.Armature#enableAnimationCache()
     */
    var AnimationCacheManager = (function () {
        function AnimationCacheManager() {
        }
        return AnimationCacheManager;
    }());
    dragonBones.AnimationCacheManager = AnimationCacheManager;
    __reflect(AnimationCacheManager.prototype, "dragonBones.AnimationCacheManager");
})(dragonBones || (dragonBones = {}));
//# sourceMappingURL=EgretArmatureDisplay.js.map