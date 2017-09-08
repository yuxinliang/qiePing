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
     * 骨架，是骨骼动画系统的核心，由显示容器、骨骼、插槽、动画、事件系统构成。
     * @see dragonBones.ArmatureData
     * @see dragonBones.Bone
     * @see dragonBones.Slot
     * @see dragonBones.Animation
     * @see dragonBones.IArmatureDisplayContainer
     * @version DragonBones 3.0
     */
    var Armature = (function (_super) {
        __extends(Armature, _super);
        /**
         * @private
         */
        function Armature() {
            var _this = _super.call(this) || this;
            /**
             * @private Store bones based on bones' hierarchy (From root to leaf)
             */
            _this._bones = [];
            /**
             * @private Store slots based on slots' zOrder (From low to high)
             */
            _this._slots = [];
            /**
             * @private
             */
            _this._actions = [];
            /**
             * @private
             */
            _this._events = [];
            /**
             * @deprecated
             * @see #cacheFrameRate
             */
            _this.enableCache = false;
            return _this;
        }
        /**
         * @private
         */
        Armature.toString = function () {
            return "[class dragonBones.Armature]";
        };
        /**
         * @inheritDoc
         */
        Armature.prototype._onClear = function () {
            this.userData = null;
            this._bonesDirty = false;
            this._cacheFrameIndex = -1;
            this._armatureData = null;
            this._skinData = null;
            if (this._animation) {
                this._animation.returnToPool();
                this._animation = null;
            }
            if (this._display) {
                this._display._onClear();
                this._display = null;
            }
            this._parent = null;
            this._replacedTexture = null;
            this._delayDispose = false;
            this._lockDispose = false;
            this._slotsDirty = false;
            if (this._bones.length) {
                for (var i = 0, l = this._bones.length; i < l; ++i) {
                    this._bones[i].returnToPool();
                }
                this._bones.length = 0;
            }
            if (this._slots.length) {
                for (var i = 0, l = this._slots.length; i < l; ++i) {
                    this._slots[i].returnToPool();
                }
                this._slots.length = 0;
            }
            if (this._actions.length) {
                for (var i = 0, l = this._actions.length; i < l; ++i) {
                    this._actions[i].returnToPool();
                }
                this._actions.length = 0;
            }
            if (this._events.length) {
                for (var i = 0, l = this._events.length; i < l; ++i) {
                    this._events[i].returnToPool();
                }
                this._events.length = 0;
            }
        };
        /**
         * @private
         */
        Armature.prototype._sortBones = function () {
            var total = this._bones.length;
            if (!total) {
                return;
            }
            var sortHelper = this._bones.concat();
            var index = 0;
            var count = 0;
            this._bones.length = 0;
            while (count < total) {
                var bone = sortHelper[index++];
                if (index >= total) {
                    index = 0;
                }
                if (this._bones.indexOf(bone) >= 0) {
                    continue;
                }
                if (bone.parent && this._bones.indexOf(bone.parent) < 0) {
                    continue;
                }
                if (bone.ik && this._bones.indexOf(bone.ik) < 0) {
                    continue;
                }
                if (bone.ik && bone.ikChain > 0 && bone.ikChainIndex == bone.ikChain) {
                    this._bones.splice(this._bones.indexOf(bone.parent) + 1, 0, bone); // ik, parent, bone, children
                }
                else {
                    this._bones.push(bone);
                }
                count++;
            }
        };
        /**
         * @private
         */
        Armature.prototype._sortSlots = function () {
        };
        /**
         * @private
         */
        Armature.prototype._doAction = function (value) {
            switch (value.type) {
                case 0 /* Play */:
                    this._animation.play(value.data[0], value.data[1]);
                    break;
                case 1 /* Stop */:
                    this._animation.stop(value.data[0]);
                    break;
                case 2 /* GotoAndPlay */:
                    this._animation.gotoAndPlayByTime(value.data[0], value.data[1], value.data[2]);
                    break;
                case 3 /* GotoAndStop */:
                    this._animation.gotoAndStopByTime(value.data[0], value.data[1]);
                    break;
                case 4 /* FadeIn */:
                    this._animation.fadeIn(value.data[0], value.data[1], value.data[2]);
                    break;
                case 5 /* FadeOut */:
                    // TODO fade out
                    break;
            }
        };
        /**
         * @private
         */
        Armature.prototype._addBoneToBoneList = function (value) {
            if (this._bones.indexOf(value) < 0) {
                this._bonesDirty = true;
                this._bones[this._bones.length] = value;
                this._animation._timelineStateDirty = true;
            }
        };
        /**
         * @private
         */
        Armature.prototype._removeBoneFromBoneList = function (value) {
            var index = this._bones.indexOf(value);
            if (index >= 0) {
                this._bones.splice(index, 1);
                this._animation._timelineStateDirty = true;
            }
        };
        /**
         * @private
         */
        Armature.prototype._addSlotToSlotList = function (value) {
            if (this._slots.indexOf(value) < 0) {
                this._slotsDirty = true;
                this._slots[this._slots.length] = value;
                this._animation._timelineStateDirty = true;
            }
        };
        /**
         * @private
         */
        Armature.prototype._removeSlotFromSlotList = function (value) {
            var index = this._slots.indexOf(value);
            if (index >= 0) {
                this._slots.splice(index, 1);
                this._animation._timelineStateDirty = true;
            }
        };
        /**
         * @private
         */
        Armature.prototype._bufferAction = function (value) {
            this._actions.push(value);
        };
        /**
         * @private
         */
        Armature.prototype._bufferEvent = function (value, type) {
            value.type = type;
            value.armature = this;
            this._events.push(value);
        };
        /**
         * @language zh_CN
         * 释放骨架。 (会回收到内存池)
         * @version DragonBones 3.0
         */
        Armature.prototype.dispose = function () {
            this._delayDispose = true;
            if (!this._lockDispose) {
                this.returnToPool();
            }
        };
        /**
         * @language zh_CN
         * 更新骨架和动画。 (可以使用时钟实例或显示容器来更新)
         * @param passedTime 两帧之前的时间间隔。 (以秒为单位)
         * @see dragonBones.IAnimateble
         * @see dragonBones.WorldClock
         * @see dragonBones.IArmatureDisplay
         * @version DragonBones 3.0
         */
        Armature.prototype.advanceTime = function (passedTime) {
            var self = this;
            if (!self._lockDispose) {
                self._lockDispose = true;
                var scaledPassedTime = passedTime * self._animation.timeScale;
                // Animations.
                self._animation._advanceTime(scaledPassedTime);
                // Bones and slots.
                if (self._bonesDirty) {
                    self._bonesDirty = false;
                    self._sortBones();
                }
                if (self._slotsDirty) {
                    self._slotsDirty = false;
                    self._sortSlots();
                }
                for (var i = 0, l = self._bones.length; i < l; ++i) {
                    self._bones[i]._update(self._cacheFrameIndex);
                }
                for (var i = 0, l = self._slots.length; i < l; ++i) {
                    var slot = self._slots[i];
                    slot._update(self._cacheFrameIndex);
                    var childArmature = slot._childArmature;
                    if (childArmature) {
                        if (slot.inheritAnimation) {
                            childArmature.advanceTime(scaledPassedTime);
                        }
                        else {
                            childArmature.advanceTime(passedTime);
                        }
                    }
                }
                if (dragonBones.DragonBones.debugDraw) {
                    self._display._debugDraw();
                }
                // Actions and events.
                if (self._events.length > 0) {
                    for (var i = 0, l = self._events.length; i < l; ++i) {
                        var event_1 = self._events[i];
                        if (dragonBones.EventObject._soundEventManager && event_1.type == dragonBones.EventObject.SOUND_EVENT) {
                            dragonBones.EventObject._soundEventManager._dispatchEvent(event_1);
                        }
                        else {
                            self._display._dispatchEvent(event_1);
                        }
                        event_1.returnToPool();
                    }
                    self._events.length = 0;
                }
                if (self._actions.length > 0) {
                    for (var i = 0, l = self._actions.length; i < l; ++i) {
                        var action = self._actions[i];
                        if (action.slot) {
                            var slot = self.getSlot(action.slot.name);
                            if (slot) {
                                var childArmature = slot._childArmature;
                                if (childArmature) {
                                    childArmature._doAction(action);
                                }
                            }
                        }
                        else if (action.bone) {
                            for (var i_1 = 0, l_1 = self._slots.length; i_1 < l_1; ++i_1) {
                                var childArmature = self._slots[i_1]._childArmature;
                                if (childArmature) {
                                    childArmature._doAction(action);
                                }
                            }
                        }
                        else {
                            this._doAction(action);
                        }
                    }
                    self._actions.length = 0;
                }
                self._lockDispose = false;
            }
            if (self._delayDispose) {
                self.returnToPool();
            }
        };
        /**
         * @language zh_CN
         * 更新骨骼和插槽的变换。 (当骨骼没有动画状态或动画状态播放完成时，骨骼将不在更新)
         * @param boneName 指定的骨骼名称，如果未设置，将更新所有骨骼。
         * @param updateSlotDisplay 是否更新插槽的显示对象。
         * @see dragonBones.Bone
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        Armature.prototype.invalidUpdate = function (boneName, updateSlotDisplay) {
            if (boneName === void 0) { boneName = null; }
            if (updateSlotDisplay === void 0) { updateSlotDisplay = false; }
            if (boneName) {
                var bone = this.getBone(boneName);
                if (bone) {
                    bone.invalidUpdate();
                    if (updateSlotDisplay) {
                        for (var i = 0, l = this._slots.length; i < l; ++i) {
                            var slot = this._slots[i];
                            if (slot.parent == bone) {
                                slot.invalidUpdate();
                            }
                        }
                    }
                }
            }
            else {
                for (var i = 0, l = this._bones.length; i < l; ++i) {
                    this._bones[i].invalidUpdate();
                }
                if (updateSlotDisplay) {
                    for (var i = 0, l = this._slots.length; i < l; ++i) {
                        this._slots[i].invalidUpdate();
                    }
                }
            }
        };
        /**
         * @language zh_CN
         * 获取指定名称的插槽。
         * @param name 插槽的名称。
         * @returns 插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        Armature.prototype.getSlot = function (name) {
            for (var i = 0, l = this._slots.length; i < l; ++i) {
                var slot = this._slots[i];
                if (slot.name == name) {
                    return slot;
                }
            }
            return null;
        };
        /**
         * @language zh_CN
         * 通过显示对象获取插槽。
         * @param display 显示对象。
         * @returns 包含这个显示对象的插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        Armature.prototype.getSlotByDisplay = function (display) {
            if (display) {
                for (var i = 0, l = this._slots.length; i < l; ++i) {
                    var slot = this._slots[i];
                    if (slot.display == display) {
                        return slot;
                    }
                }
            }
            return null;
        };
        /**
         * @language zh_CN
         * 将一个指定的插槽添加到骨架中。
         * @param value 需要添加的插槽。
         * @param parentName 需要添加到的父骨骼名称。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        Armature.prototype.addSlot = function (value, parentName) {
            var bone = this.getBone(parentName);
            if (bone) {
                value._setArmature(this);
                value._setParent(bone);
            }
            else {
                throw new Error();
            }
        };
        /**
         * @language zh_CN
         * 将一个指定的插槽从骨架中移除。
         * @param value 需要移除的插槽
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        Armature.prototype.removeSlot = function (value) {
            if (value && value.armature == this) {
                value._setParent(null);
                value._setArmature(null);
            }
            else {
                throw new Error();
            }
        };
        /**
         * @language zh_CN
         * 获取指定名称的骨骼。
         * @param name 骨骼的名称。
         * @returns 骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        Armature.prototype.getBone = function (name) {
            for (var i = 0, l = this._bones.length; i < l; ++i) {
                var bone = this._bones[i];
                if (bone.name == name) {
                    return bone;
                }
            }
            return null;
        };
        /**
         * @language zh_CN
         * 通过显示对象获取骨骼。
         * @param display 显示对象。
         * @returns 包含这个显示对象的骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        Armature.prototype.getBoneByDisplay = function (display) {
            var slot = this.getSlotByDisplay(display);
            return slot ? slot.parent : null;
        };
        /**
         * @language zh_CN
         * 将一个指定的骨骼添加到骨架中。
         * @param value 需要添加的骨骼。
         * @param parentName 需要添加到父骨骼的名称，如果未设置，则添加到骨架根部。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        Armature.prototype.addBone = function (value, parentName) {
            if (parentName === void 0) { parentName = null; }
            if (value) {
                value._setArmature(this);
                value._setParent(parentName ? this.getBone(parentName) : null);
            }
            else {
                throw new Error();
            }
        };
        /**
         * @language zh_CN
         * 将一个指定的骨骼从骨架中移除。
         * @param value 需要移除的骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        Armature.prototype.removeBone = function (value) {
            if (value && value.armature == this) {
                value._setParent(null);
                value._setArmature(null);
            }
            else {
                throw new Error();
            }
        };
        /**
         * @language zh_CN
         * 替换骨架的主贴图，根据渲染引擎的不同，提供不同的贴图数据。
         * @param texture 用来替换的贴图，根据渲染平台的不同，类型会有所不同，一般是 Texture 类型。
         * @version DragonBones 4.5
         */
        Armature.prototype.replaceTexture = function (texture) {
            this._replacedTexture = texture;
            for (var i = 0, l = this._slots.length; i < l; ++i) {
                this._slots[i].invalidUpdate();
            }
        };
        /**
         * @language zh_CN
         * 获取所有骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        Armature.prototype.getBones = function () {
            return this._bones;
        };
        /**
         * @language zh_CN
         * 获取所有插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        Armature.prototype.getSlots = function () {
            return this._slots;
        };
        Object.defineProperty(Armature.prototype, "name", {
            /**
             * @language zh_CN
             * 骨架名称。
             * @see dragonBones.ArmatureData#name
             * @version DragonBones 3.0
             */
            get: function () {
                return this._armatureData ? this._armatureData.name : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Armature.prototype, "armatureData", {
            /**
             * @language zh_CN
             * 获取骨架数据。
             * @see dragonBones.ArmatureData
             * @version DragonBones 4.5
             */
            get: function () {
                return this._armatureData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Armature.prototype, "animation", {
            /**
             * @language zh_CN
             * 获得动画控制器。
             * @see dragonBones.Animation
             * @version DragonBones 3.0
             */
            get: function () {
                return this._animation;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Armature.prototype, "display", {
            /**
             * @language zh_CN
             * 获取显示容器，插槽的显示对象都会以此显示容器为父级，根据渲染平台的不同，类型会不同，通常是 DisplayObjectContainer 类型。
             * @version DragonBones 3.0
             */
            get: function () {
                return this._display;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Armature.prototype, "parent", {
            /**
             * @language zh_CN
             * 获取父插槽。 (当此骨架是某个骨架的子骨架时，可以通过此属性向上查找从属关系)
             * @see dragonBones.Slot
             * @version DragonBones 4.5
             */
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Armature.prototype, "cacheFrameRate", {
            /**
             * @language zh_CN
             * 动画缓存的帧率，当设置一个大于 0 的帧率时，将会开启动画缓存。
             * 通过将动画数据缓存在内存中来提高运行性能，会有一定的内存开销。
             * 帧率不宜设置的过高，通常跟动画的帧率相当且低于程序运行的帧率。
             * 开启动画缓存后，某些功能将会失效，比如 Bone 和 Slot 的 offset 属性等。
             * @see dragonBones.DragonBonesData#frameRate
             * @see dragonBones.ArmatureData#frameRate
             * @version DragonBones 4.5
             */
            get: function () {
                return this._armatureData.cacheFrameRate;
            },
            set: function (value) {
                if (this._armatureData.cacheFrameRate != value) {
                    this._armatureData.cacheFrames(value);
                    // Set child armature frameRate.
                    for (var i = 0, l = this._slots.length; i < l; ++i) {
                        var slot = this._slots[i];
                        var childArmature = slot.childArmature;
                        if (childArmature) {
                            childArmature.cacheFrameRate = value;
                        }
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @language zh_CN
         * 开启动画缓存。
         * @param frameRate 动画缓存的帧率
         * @see #cacheFrameRate
         * @version DragonBones 4.5
         */
        Armature.prototype.enableAnimationCache = function (frameRate) {
            this.cacheFrameRate = frameRate;
        };
        /**
         * @language zh_CN
         * 是否包含指定类型的事件。
         * @param type 事件类型。
         * @returns  [true: 包含, false: 不包含]
         * @version DragonBones 3.0
         */
        Armature.prototype.hasEventListener = function (type) {
            this._display.hasEvent(type);
        };
        /**
         * @language zh_CN
         * 添加事件。
         * @param type 事件类型。
         * @param listener 事件回调。
         * @version DragonBones 3.0
         */
        Armature.prototype.addEventListener = function (type, listener, target) {
            this._display.addEvent(type, listener, target);
        };
        /**
         * @language zh_CN
         * 移除事件。
         * @param type 事件类型。
         * @param listener 事件回调。
         * @version DragonBones 3.0
         */
        Armature.prototype.removeEventListener = function (type, listener, target) {
            this._display.removeEvent(type, listener, target);
        };
        /**
         * @deprecated
         * @see #display
         */
        Armature.prototype.getDisplay = function () {
            return this._display;
        };
        return Armature;
    }(dragonBones.BaseObject));
    dragonBones.Armature = Armature;
    __reflect(Armature.prototype, "dragonBones.Armature", ["dragonBones.IAnimateble"]);
})(dragonBones || (dragonBones = {}));
//# sourceMappingURL=Armature.js.map