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
     * 骨架数据。
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    var ArmatureData = (function (_super) {
        __extends(ArmatureData, _super);
        /**
         * @private
         */
        function ArmatureData() {
            var _this = _super.call(this) || this;
            /**
             * @private
             */
            _this.aabb = new dragonBones.Rectangle();
            /**
             * @language zh_CN
             * 所有的骨骼数据。
             * @see dragonBones.BoneData
             * @version DragonBones 3.0
             */
            _this.bones = {};
            /**
             * @language zh_CN
             * 所有的插槽数据。
             * @see dragonBones.SlotData
             * @version DragonBones 3.0
             */
            _this.slots = {};
            /**
             * @language zh_CN
             * 所有的皮肤数据。
             * @see dragonBones.SkinData
             * @version DragonBones 3.0
             */
            _this.skins = {};
            /**
             * @language zh_CN
             * 所有的动画数据。
             * @see dragonBones.AnimationData
             * @version DragonBones 3.0
             */
            _this.animations = {};
            /**
             * @private
             */
            _this.actions = [];
            _this._sortedBones = [];
            _this._sortedSlots = [];
            _this._bonesChildren = {};
            return _this;
        }
        ArmatureData._onSortSlots = function (a, b) {
            return a.zOrder > b.zOrder ? 1 : -1;
        };
        /**
         * @private
         */
        ArmatureData.toString = function () {
            return "[class dragonBones.ArmatureData]";
        };
        /**
         * @inheritDoc
         */
        ArmatureData.prototype._onClear = function () {
            this.frameRate = 0;
            this.cacheFrameRate = 0;
            this.type = 0 /* Armature */;
            this.name = null;
            this.parent = null;
            this.userData = null;
            this.aabb.clear();
            for (var i in this.bones) {
                this.bones[i].returnToPool();
                delete this.bones[i];
            }
            for (var i in this.slots) {
                this.slots[i].returnToPool();
                delete this.slots[i];
            }
            for (var i in this.skins) {
                this.skins[i].returnToPool();
                delete this.skins[i];
            }
            for (var i in this.animations) {
                this.animations[i].returnToPool();
                delete this.animations[i];
            }
            if (this.actions.length) {
                for (var i = 0, l = this.actions.length; i < l; ++i) {
                    this.actions[i].returnToPool();
                }
                this.actions.length = 0;
            }
            this._boneDirty = false;
            this._slotDirty = false;
            this._defaultSkin = null;
            this._defaultAnimation = null;
            if (this._sortedBones.length) {
                this._sortedBones.length = 0;
            }
            if (this._sortedSlots.length) {
                this._sortedSlots.length = 0;
            }
            for (var i in this._bonesChildren) {
                delete this._bonesChildren[i];
            }
        };
        ArmatureData.prototype._sortBones = function () {
            var total = this._sortedBones.length;
            if (!total) {
                return;
            }
            var sortHelper = this._sortedBones.concat();
            var index = 0;
            var count = 0;
            this._sortedBones.length = 0;
            while (count < total) {
                var bone = sortHelper[index++];
                if (index >= total) {
                    index = 0;
                }
                if (this._sortedBones.indexOf(bone) >= 0) {
                    continue;
                }
                if (bone.parent && this._sortedBones.indexOf(bone.parent) < 0) {
                    continue;
                }
                if (bone.ik && this._sortedBones.indexOf(bone.ik) < 0) {
                    continue;
                }
                if (bone.ik && bone.chain > 0 && bone.chainIndex == bone.chain) {
                    this._sortedBones.splice(this._sortedBones.indexOf(bone.parent) + 1, 0, bone);
                }
                else {
                    this._sortedBones.push(bone);
                }
                count++;
            }
        };
        ArmatureData.prototype._sortSlots = function () {
            this._sortedSlots.sort(ArmatureData._onSortSlots);
        };
        /**
         * @private
         */
        ArmatureData.prototype.cacheFrames = function (value) {
            if (this.cacheFrameRate == value) {
                return;
            }
            this.cacheFrameRate = value;
            var frameScale = this.cacheFrameRate / this.frameRate;
            for (var i in this.animations) {
                this.animations[i].cacheFrames(frameScale);
            }
        };
        /**
         * @private
         */
        ArmatureData.prototype.addBone = function (value, parentName) {
            if (value && value.name && !this.bones[value.name]) {
                if (parentName) {
                    var parent_1 = this.getBone(parentName);
                    if (parent_1) {
                        value.parent = parent_1;
                    }
                    else {
                        (this._bonesChildren[parentName] = this._bonesChildren[parentName] || []).push(value);
                    }
                }
                var children = this._bonesChildren[value.name];
                if (children) {
                    for (var i = 0, l = children.length; i < l; ++i) {
                        children[i].parent = value;
                    }
                    delete this._bonesChildren[value.name];
                }
                this.bones[value.name] = value;
                this._sortedBones.push(value);
                this._boneDirty = true;
            }
            else {
                throw new Error();
            }
        };
        /**
         * @private
         */
        ArmatureData.prototype.addSlot = function (value) {
            if (value && value.name && !this.slots[value.name]) {
                this.slots[value.name] = value;
                this._sortedSlots.push(value);
                this._slotDirty = true;
            }
            else {
                throw new Error();
            }
        };
        /**
         * @private
         */
        ArmatureData.prototype.addSkin = function (value) {
            if (value && value.name && !this.skins[value.name]) {
                this.skins[value.name] = value;
                if (!this._defaultSkin) {
                    this._defaultSkin = value;
                }
            }
            else {
                throw new Error();
            }
        };
        /**
         * @private
         */
        ArmatureData.prototype.addAnimation = function (value) {
            if (value && value.name && !this.animations[value.name]) {
                this.animations[value.name] = value;
                if (!this._defaultAnimation) {
                    this._defaultAnimation = value;
                }
            }
            else {
                throw new Error();
            }
        };
        /**
         * @language zh_CN
         * 获取指定名称的骨骼数据。
         * @param name 骨骼数据名称。
         * @see dragonBones.BoneData
         * @version DragonBones 3.0
         */
        ArmatureData.prototype.getBone = function (name) {
            return this.bones[name];
        };
        /**
         * @language zh_CN
         * 获取指定名称的插槽数据。
         * @param name 插槽数据名称。
         * @see dragonBones.SlotData
         * @version DragonBones 3.0
         */
        ArmatureData.prototype.getSlot = function (name) {
            return this.slots[name];
        };
        /**
         * @language zh_CN
         * 获取指定名称的皮肤数据。
         * @param name 皮肤数据名称。
         * @see dragonBones.SkinData
         * @version DragonBones 3.0
         */
        ArmatureData.prototype.getSkin = function (name) {
            return name ? this.skins[name] : this._defaultSkin;
        };
        /**
         * @language zh_CN
         * 获取指定名称的动画数据。
         * @param name 动画数据名称。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         */
        ArmatureData.prototype.getAnimation = function (name) {
            return name ? this.animations[name] : this._defaultAnimation;
        };
        Object.defineProperty(ArmatureData.prototype, "sortedBones", {
            /**
             * @private
             */
            get: function () {
                if (this._boneDirty) {
                    this._boneDirty = false;
                    this._sortBones();
                }
                return this._sortedBones;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArmatureData.prototype, "sortedSlots", {
            /**
             * @private
             */
            get: function () {
                if (this._slotDirty) {
                    this._slotDirty = false;
                    this._sortSlots();
                }
                return this._sortedSlots;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArmatureData.prototype, "defaultSkin", {
            /**
             * @language zh_CN
             * 获取默认的皮肤数据。
             * @see dragonBones.SkinData
             * @version DragonBones 4.5
             */
            get: function () {
                return this._defaultSkin;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArmatureData.prototype, "defaultAnimation", {
            /**
             * @language zh_CN
             * 获取默认的动画数据。
             * @see dragonBones.AnimationData
             * @version DragonBones 4.5
             */
            get: function () {
                return this._defaultAnimation;
            },
            enumerable: true,
            configurable: true
        });
        return ArmatureData;
    }(dragonBones.BaseObject));
    dragonBones.ArmatureData = ArmatureData;
    __reflect(ArmatureData.prototype, "dragonBones.ArmatureData");
    /**
     * @language zh_CN
     * 骨骼数据。
     * @see dragonBones.Bone
     * @version DragonBones 3.0
     */
    var BoneData = (function (_super) {
        __extends(BoneData, _super);
        /**
         * @private
         */
        function BoneData() {
            var _this = _super.call(this) || this;
            /**
             * @private
             */
            _this.transform = new dragonBones.Transform();
            return _this;
        }
        /**
         * @private
         */
        BoneData.toString = function () {
            return "[class dragonBones.BoneData]";
        };
        /**
         * @inheritDoc
         */
        BoneData.prototype._onClear = function () {
            this.inheritTranslation = false;
            this.inheritRotation = false;
            this.inheritScale = false;
            this.bendPositive = false;
            this.chain = 0;
            this.chainIndex = 0;
            this.weight = 0;
            this.length = 0;
            this.name = null;
            this.parent = null;
            this.ik = null;
            this.transform.identity();
        };
        return BoneData;
    }(dragonBones.BaseObject));
    dragonBones.BoneData = BoneData;
    __reflect(BoneData.prototype, "dragonBones.BoneData");
    /**
     * @language zh_CN
     * 插槽数据。
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     */
    var SlotData = (function (_super) {
        __extends(SlotData, _super);
        /**
         * @private
         */
        function SlotData() {
            var _this = _super.call(this) || this;
            /**
             * @private
             */
            _this.actions = [];
            return _this;
        }
        /**
         * @private
         */
        SlotData.generateColor = function () {
            return new dragonBones.ColorTransform();
        };
        /**
         * @private
         */
        SlotData.toString = function () {
            return "[class dragonBones.SlotData]";
        };
        /**
         * @inheritDoc
         */
        SlotData.prototype._onClear = function () {
            this.displayIndex = 0;
            this.zOrder = 0;
            this.blendMode = 0 /* Normal */;
            this.name = null;
            this.parent = null;
            this.color = null;
            if (this.actions.length) {
                for (var i = 0, l = this.actions.length; i < l; ++i) {
                    this.actions[i].returnToPool();
                }
                this.actions.length = 0;
            }
        };
        return SlotData;
    }(dragonBones.BaseObject));
    /**
     * @private
     */
    SlotData.DEFAULT_COLOR = new dragonBones.ColorTransform();
    dragonBones.SlotData = SlotData;
    __reflect(SlotData.prototype, "dragonBones.SlotData");
    /**
     * @language zh_CN
     * 皮肤数据。
     * @version DragonBones 3.0
     */
    var SkinData = (function (_super) {
        __extends(SkinData, _super);
        /**
         * @private
         */
        function SkinData() {
            var _this = _super.call(this) || this;
            /**
             * @language zh_CN
             * 数据名称。
             * @version DragonBones 3.0
             */
            _this.name = null;
            /**
             * @private
             */
            _this.slots = {};
            return _this;
        }
        /**
         * @private
         */
        SkinData.toString = function () {
            return "[class dragonBones.SkinData]";
        };
        /**
         * @inheritDoc
         */
        SkinData.prototype._onClear = function () {
            this.name = null;
            for (var i in this.slots) {
                this.slots[i].returnToPool();
                delete this.slots[i];
            }
        };
        /**
         * @private
         */
        SkinData.prototype.addSlot = function (value) {
            if (value && value.slot && !this.slots[value.slot.name]) {
                this.slots[value.slot.name] = value;
            }
            else {
                throw new Error();
            }
        };
        /**
         * @private
         */
        SkinData.prototype.getSlot = function (name) {
            return this.slots[name];
        };
        return SkinData;
    }(dragonBones.BaseObject));
    dragonBones.SkinData = SkinData;
    __reflect(SkinData.prototype, "dragonBones.SkinData");
    /**
     * @private
     */
    var SlotDisplayDataSet = (function (_super) {
        __extends(SlotDisplayDataSet, _super);
        function SlotDisplayDataSet() {
            var _this = _super.call(this) || this;
            _this.displays = [];
            return _this;
        }
        SlotDisplayDataSet.toString = function () {
            return "[class dragonBones.SlotDisplayDataSet]";
        };
        /**
         * @inheritDoc
         */
        SlotDisplayDataSet.prototype._onClear = function () {
            this.slot = null;
            if (this.displays.length) {
                for (var i = 0, l = this.displays.length; i < l; ++i) {
                    this.displays[i].returnToPool();
                }
                this.displays.length = 0;
            }
        };
        return SlotDisplayDataSet;
    }(dragonBones.BaseObject));
    dragonBones.SlotDisplayDataSet = SlotDisplayDataSet;
    __reflect(SlotDisplayDataSet.prototype, "dragonBones.SlotDisplayDataSet");
    /**
     * @private
     */
    var DisplayData = (function (_super) {
        __extends(DisplayData, _super);
        function DisplayData() {
            var _this = _super.call(this) || this;
            _this.pivot = new dragonBones.Point();
            _this.transform = new dragonBones.Transform();
            return _this;
        }
        DisplayData.toString = function () {
            return "[class dragonBones.DisplayData]";
        };
        /**
         * @inheritDoc
         */
        DisplayData.prototype._onClear = function () {
            this.isRelativePivot = false;
            this.type = 0 /* Image */;
            this.name = null;
            this.textureData = null;
            this.armatureData = null;
            if (this.mesh) {
                this.mesh.returnToPool();
                this.mesh = null;
            }
            this.pivot.clear();
            this.transform.identity();
        };
        return DisplayData;
    }(dragonBones.BaseObject));
    dragonBones.DisplayData = DisplayData;
    __reflect(DisplayData.prototype, "dragonBones.DisplayData");
    /**
     * @private
     */
    var MeshData = (function (_super) {
        __extends(MeshData, _super);
        function MeshData() {
            var _this = _super.call(this) || this;
            _this.slotPose = new dragonBones.Matrix();
            _this.uvs = []; // vertices * 2
            _this.vertices = []; // vertices * 2
            _this.vertexIndices = []; // triangles * 3
            _this.boneIndices = []; // vertices bones
            _this.weights = []; // vertices bones
            _this.boneVertices = []; // vertices bones * 2
            _this.bones = []; // bones
            _this.inverseBindPose = []; // bones
            return _this;
        }
        MeshData.toString = function () {
            return "[class dragonBones.MeshData]";
        };
        /**
         * @inheritDoc
         */
        MeshData.prototype._onClear = function () {
            this.skinned = false;
            this.slotPose.identity();
            if (this.uvs.length) {
                this.uvs.length = 0;
            }
            if (this.vertices.length) {
                this.vertices.length = 0;
            }
            if (this.vertexIndices.length) {
                this.vertexIndices.length = 0;
            }
            if (this.boneIndices.length) {
                this.boneIndices.length = 0;
            }
            if (this.weights.length) {
                this.weights.length = 0;
            }
            if (this.boneVertices.length) {
                this.boneVertices.length = 0;
            }
            if (this.bones.length) {
                this.bones.length = 0;
            }
            if (this.inverseBindPose.length) {
                this.inverseBindPose.length = 0;
            }
        };
        return MeshData;
    }(dragonBones.BaseObject));
    dragonBones.MeshData = MeshData;
    __reflect(MeshData.prototype, "dragonBones.MeshData");
})(dragonBones || (dragonBones = {}));
//# sourceMappingURL=ArmatureData.js.map