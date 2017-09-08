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
     * Egret 插槽。
     * @version DragonBones 3.0
     */
    var EgretSlot = (function (_super) {
        __extends(EgretSlot, _super);
        /**
         * @language zh_CN
         * 创建一个空的插槽。
         * @version DragonBones 3.0
         */
        function EgretSlot() {
            return _super.call(this) || this;
        }
        /**
         * @private
         */
        EgretSlot.toString = function () {
            return "[class dragonBones.EgretSlot]";
        };
        /**
         * @inheritDoc
         */
        EgretSlot.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.transformUpdateEnabled = false;
            this._renderDisplay = null;
            this._colorFilter = null;
        };
        /**
         * @private
         */
        EgretSlot.prototype._onUpdateDisplay = function () {
            if (!this._rawDisplay) {
                this._rawDisplay = new egret.Bitmap();
            }
            this._renderDisplay = (this._display || this._rawDisplay);
        };
        /**
         * @private
         */
        EgretSlot.prototype._initDisplay = function (value) {
        };
        /**
         * @private
         */
        EgretSlot.prototype._addDisplay = function () {
            var container = this._armature._display;
            container.addChild(this._renderDisplay);
        };
        /**
         * @private
         */
        EgretSlot.prototype._replaceDisplay = function (value) {
            var container = this._armature._display;
            var prevDisplay = value;
            container.addChild(this._renderDisplay);
            container.swapChildren(this._renderDisplay, prevDisplay);
            container.removeChild(prevDisplay);
        };
        /**
         * @private
         */
        EgretSlot.prototype._removeDisplay = function () {
            this._renderDisplay.parent.removeChild(this._renderDisplay);
        };
        /**
         * @private
         */
        EgretSlot.prototype._disposeDisplay = function (value) {
            //
        };
        /**
         * @private
         */
        EgretSlot.prototype._updateVisible = function () {
            this._renderDisplay.visible = this._parent.visible;
        };
        /**
         * @private
         */
        EgretSlot.prototype._updateBlendMode = function () {
            if (this._blendMode < EgretSlot.BLEND_MODE_LIST.length) {
                var blendMode = EgretSlot.BLEND_MODE_LIST[this._blendMode];
                if (blendMode) {
                    this._renderDisplay.blendMode = blendMode;
                }
            }
        };
        /**
         * @private
         */
        EgretSlot.prototype._updateColor = function () {
            if (this._colorTransform.redMultiplier != 1 ||
                this._colorTransform.greenMultiplier != 1 ||
                this._colorTransform.blueMultiplier != 1 ||
                this._colorTransform.redOffset != 0 ||
                this._colorTransform.greenOffset != 0 ||
                this._colorTransform.blueOffset != 0 ||
                this._colorTransform.alphaOffset != 0) {
                if (!this._colorFilter) {
                    this._colorFilter = new egret.ColorMatrixFilter();
                }
                var colorMatrix = this._colorFilter.matrix;
                colorMatrix[0] = this._colorTransform.redMultiplier;
                colorMatrix[6] = this._colorTransform.greenMultiplier;
                colorMatrix[12] = this._colorTransform.blueMultiplier;
                colorMatrix[18] = this._colorTransform.alphaMultiplier;
                colorMatrix[4] = this._colorTransform.redOffset;
                colorMatrix[9] = this._colorTransform.greenOffset;
                colorMatrix[14] = this._colorTransform.blueOffset;
                colorMatrix[19] = this._colorTransform.alphaOffset;
                this._colorFilter.matrix = colorMatrix;
                var filters = this._renderDisplay.filters;
                if (!filters) {
                    filters = [];
                }
                if (filters.indexOf(this._colorFilter) < 0) {
                    filters.push(this._colorFilter);
                }
                this._renderDisplay.filters = filters;
            }
            else {
                if (this._colorFilter) {
                    this._colorFilter = null;
                    this._renderDisplay.filters = null;
                }
                this._renderDisplay.$setAlpha(this._colorTransform.alphaMultiplier);
            }
        };
        /**
         * @private
         */
        EgretSlot.prototype._updateFilters = function () { };
        /**
         * @private
         */
        EgretSlot.prototype._updateFrame = function () {
            var frameDisplay = this._renderDisplay;
            if (this._display && this._displayIndex >= 0) {
                var rawDisplayData = this._displayIndex < this._displayDataSet.displays.length ? this._displayDataSet.displays[this._displayIndex] : null;
                var replacedDisplayData = this._displayIndex < this._replacedDisplayDataSet.length ? this._replacedDisplayDataSet[this._displayIndex] : null;
                var currentDisplayData = replacedDisplayData || rawDisplayData;
                var currentTextureData = currentDisplayData.textureData;
                if (currentTextureData) {
                    var textureAtlasTexture = currentTextureData.parent.texture;
                    if (!currentTextureData.texture && textureAtlasTexture) {
                        currentTextureData.texture = new egret.Texture();
                        currentTextureData.texture._bitmapData = textureAtlasTexture._bitmapData;
                        currentTextureData.texture.$initData(currentTextureData.region.x, currentTextureData.region.y, Math.min(currentTextureData.region.width, textureAtlasTexture.textureWidth - currentTextureData.region.x), Math.min(currentTextureData.region.height, textureAtlasTexture.textureHeight - currentTextureData.region.y), 0, 0, Math.min(currentTextureData.region.width, textureAtlasTexture.textureWidth - currentTextureData.region.x), Math.min(currentTextureData.region.height, textureAtlasTexture.textureHeight - currentTextureData.region.y), textureAtlasTexture.textureWidth, textureAtlasTexture.textureHeight);
                    }
                    var texture = this._armature._replacedTexture || currentTextureData.texture;
                    if (this._meshData && this._display == this._meshDisplay) {
                        var meshDisplay = this._meshDisplay;
                        var meshNode = meshDisplay.$renderNode;
                        meshNode.uvs.length = 0;
                        meshNode.vertices.length = 0;
                        meshNode.indices.length = 0;
                        for (var i = 0, l = this._meshData.vertices.length; i < l; ++i) {
                            meshNode.uvs[i] = this._meshData.uvs[i];
                            meshNode.vertices[i] = this._meshData.vertices[i];
                        }
                        for (var i = 0, l = this._meshData.vertexIndices.length; i < l; ++i) {
                            meshNode.indices[i] = this._meshData.vertexIndices[i];
                        }
                        this._pivotX = 0;
                        this._pivotY = 0;
                        if (texture) {
                            meshDisplay.$setBitmapData(texture);
                        }
                        meshDisplay.$updateVertices();
                        meshDisplay.$invalidateTransform();
                        // Identity transform.
                        if (this._meshData.skinned) {
                            var transformationMatrix = meshDisplay.matrix;
                            transformationMatrix.identity();
                            meshDisplay.matrix = transformationMatrix;
                        }
                    }
                    else {
                        var rect = currentTextureData.frame || currentTextureData.region;
                        var width = rect.width;
                        var height = rect.height;
                        if (currentTextureData.rotated) {
                            width = rect.height;
                            height = rect.width;
                        }
                        this._pivotX = currentDisplayData.pivot.x;
                        this._pivotY = currentDisplayData.pivot.y;
                        if (currentDisplayData.isRelativePivot) {
                            this._pivotX = width * this._pivotX;
                            this._pivotY = height * this._pivotY;
                        }
                        if (currentTextureData.frame) {
                            this._pivotX += currentTextureData.frame.x;
                            this._pivotY += currentTextureData.frame.y;
                        }
                        if (rawDisplayData && rawDisplayData != currentDisplayData) {
                            this._pivotX += rawDisplayData.transform.x - currentDisplayData.transform.x;
                            this._pivotY += rawDisplayData.transform.y - currentDisplayData.transform.y;
                        }
                        if (texture) {
                            frameDisplay.$setBitmapData(texture);
                        }
                        frameDisplay.$setAnchorOffsetX(this._pivotX);
                        frameDisplay.$setAnchorOffsetY(this._pivotY);
                    }
                    this._updateVisible();
                    return;
                }
            }
            this._pivotX = 0;
            this._pivotY = 0;
            frameDisplay.visible = false;
            frameDisplay.$setBitmapData(null);
            frameDisplay.$setAnchorOffsetX(0);
            frameDisplay.$setAnchorOffsetY(0);
            frameDisplay.x = this.origin.x;
            frameDisplay.y = this.origin.y;
        };
        /**
         * @private
         */
        EgretSlot.prototype._updateMesh = function () {
            var meshDisplay = this._meshDisplay;
            var meshNode = meshDisplay.$renderNode;
            var hasFFD = this._ffdVertices.length > 0;
            if (this._meshData.skinned) {
                for (var i = 0, iF = 0, l = this._meshData.vertices.length; i < l; i += 2) {
                    var iH = i / 2;
                    var boneIndices = this._meshData.boneIndices[iH];
                    var boneVertices = this._meshData.boneVertices[iH];
                    var weights = this._meshData.weights[iH];
                    var xG = 0, yG = 0;
                    for (var iB = 0, lB = boneIndices.length; iB < lB; ++iB) {
                        var bone = this._meshBones[boneIndices[iB]];
                        var matrix = bone.globalTransformMatrix;
                        var weight = weights[iB];
                        var xL = 0, yL = 0;
                        if (hasFFD) {
                            xL = boneVertices[iB * 2] + this._ffdVertices[iF];
                            yL = boneVertices[iB * 2 + 1] + this._ffdVertices[iF + 1];
                        }
                        else {
                            xL = boneVertices[iB * 2];
                            yL = boneVertices[iB * 2 + 1];
                        }
                        xG += (matrix.a * xL + matrix.c * yL + matrix.tx) * weight;
                        yG += (matrix.b * xL + matrix.d * yL + matrix.ty) * weight;
                        iF += 2;
                    }
                    meshNode.vertices[i] = xG;
                    meshNode.vertices[i + 1] = yG;
                }
                meshDisplay.$updateVertices();
                meshDisplay.$invalidateTransform();
            }
            else if (hasFFD) {
                var vertices = this._meshData.vertices;
                for (var i = 0, l = this._meshData.vertices.length; i < l; i += 2) {
                    var xG = vertices[i] + this._ffdVertices[i];
                    var yG = vertices[i + 1] + this._ffdVertices[i + 1];
                    meshNode.vertices[i] = xG;
                    meshNode.vertices[i + 1] = yG;
                }
                meshDisplay.$updateVertices();
                meshDisplay.$invalidateTransform();
            }
        };
        /**
         * @private
         */
        EgretSlot.prototype._updateTransform = function () {
            this._renderDisplay.$setMatrix(this.globalTransformMatrix, this.transformUpdateEnabled);
        };
        return EgretSlot;
    }(dragonBones.Slot));
    /**
     * @private
     */
    EgretSlot.BLEND_MODE_LIST = [
        egret.BlendMode.NORMAL,
        egret.BlendMode.ADD,
        null,
        null,
        null,
        egret.BlendMode.ERASE,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
    ];
    dragonBones.EgretSlot = EgretSlot;
    __reflect(EgretSlot.prototype, "dragonBones.EgretSlot");
})(dragonBones || (dragonBones = {}));
//# sourceMappingURL=EgretSlot.js.map