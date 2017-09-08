var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * WorldClock 提供时钟的支持，为每个加入到时钟的 IAnimatable 对象更新时间。
     * @see dragonBones.IAnimatable
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    var WorldClock = (function () {
        /**
         * @language zh_CN
         * 创建一个新的 WorldClock 实例。
         * 通常并不需要单独创建 WorldClock 的实例，可以直接使用 WorldClock.clock 静态实例。
         * (创建更多独立的 WorldClock 可以更灵活的为需要更新的 IAnimateble 实例分组，实现不同组不同速度的动画播放)
         * @version DragonBones 3.0
         */
        function WorldClock() {
            /**
             * @language zh_CN
             * 当前的时间。 (以秒为单位)
             * @version DragonBones 3.0
             */
            this.time = new Date().getTime() / dragonBones.DragonBones.SECOND_TO_MILLISECOND;
            /**
             * @language zh_CN
             * 时间流逝的速度，用于实现动画的变速播放。 [0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
             * @default 1
             * @version DragonBones 3.0
             */
            this.timeScale = 1;
            this._animatebles = [];
        }
        Object.defineProperty(WorldClock, "clock", {
            /**
             * @language zh_CN
             * 一个可以直接使用的全局 WorldClock 实例.
             * @version DragonBones 3.0
             */
            get: function () {
                if (!WorldClock._clock) {
                    WorldClock._clock = new WorldClock();
                }
                return WorldClock._clock;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @language zh_CN
         * 为所有的 IAnimatable 实例向前播放一个指定的时间。 (通常这个方法需要在 ENTER_FRAME 事件的响应函数中被调用)
         * @param passedTime 前进的时间。 (以秒为单位，当设置为 -1 时将自动计算当前帧与上一帧的时间差)
         * @version DragonBones 3.0
         */
        WorldClock.prototype.advanceTime = function (passedTime) {
            if (passedTime != passedTime) {
                passedTime = 0;
            }
            if (passedTime < 0) {
                passedTime = new Date().getTime() / dragonBones.DragonBones.SECOND_TO_MILLISECOND - this.time;
            }
            passedTime *= this.timeScale;
            if (passedTime < 0) {
                this.time -= passedTime;
            }
            else {
                this.time += passedTime;
            }
            if (passedTime) {
                var i = 0, r = 0, l = this._animatebles.length;
                for (; i < l; ++i) {
                    var animateble = this._animatebles[i];
                    if (animateble) {
                        if (r > 0) {
                            this._animatebles[i - r] = animateble;
                            this._animatebles[i] = null;
                        }
                        animateble.advanceTime(passedTime);
                    }
                    else {
                        r++;
                    }
                }
                if (r > 0) {
                    l = this._animatebles.length;
                    for (; i < l; ++i) {
                        var animateble = this._animatebles[i];
                        if (animateble) {
                            this._animatebles[i - r] = animateble;
                        }
                        else {
                            r++;
                        }
                    }
                    this._animatebles.length -= r;
                }
            }
        };
        /**
         * 是否包含指定的 IAnimatable 实例
         * @param value 指定的 IAnimatable 实例。
         * @returns  [true: 包含，false: 不包含]。
         * @version DragonBones 3.0
         */
        WorldClock.prototype.contains = function (value) {
            return this._animatebles.indexOf(value) >= 0;
        };
        /**
         * @language zh_CN
         * 添加指定的 IAnimatable 实例。
         * @param value IAnimatable 实例。
         * @version DragonBones 3.0
         */
        WorldClock.prototype.add = function (value) {
            if (value && this._animatebles.indexOf(value) < 0) {
                this._animatebles.push(value);
                if (dragonBones.DragonBones.debug && value instanceof dragonBones.Armature) {
                    dragonBones.DragonBones.addArmature(value);
                }
            }
        };
        /**
         * @language zh_CN
         * 移除指定的 IAnimatable 实例。
         * @param value IAnimatable 实例。
         * @version DragonBones 3.0
         */
        WorldClock.prototype.remove = function (value) {
            var index = this._animatebles.indexOf(value);
            if (index >= 0) {
                this._animatebles[index] = null;
                if (dragonBones.DragonBones.debug && value instanceof dragonBones.Armature) {
                    dragonBones.DragonBones.removeArmature(value);
                }
            }
        };
        /**
         * @language zh_CN
         * 清除所有的 IAnimatable 实例。
         * @version DragonBones 3.0
         */
        WorldClock.prototype.clear = function () {
            for (var i = 0, l = this._animatebles.length; i < l; ++i) {
                this._animatebles[i] = null;
            }
        };
        return WorldClock;
    }());
    WorldClock._clock = null;
    dragonBones.WorldClock = WorldClock;
    __reflect(WorldClock.prototype, "dragonBones.WorldClock", ["dragonBones.IAnimateble"]);
})(dragonBones || (dragonBones = {}));
//# sourceMappingURL=WorldClock.js.map