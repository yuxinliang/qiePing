namespace dragonBones {
    /**
     * @language zh_CN
     * Egret 插槽。
     * @version DragonBones 3.0
     */
    export class EgretSlot extends Slot {
        /**
         * @private
         */
        public static toString(): string {
            return "[class dragonBones.EgretSlot]";
        }

        /**
         * @language zh_CN
         * 是否更新显示对象的变换属性。
         * 为了更好的性能, 并不会更新 display 的变换属性 (x, y, rotation, scaleX, scaleX), 如果需要正确访问这些属性, 则需要设置为 true 。
         * @default false
         * @version DragonBones 3.0
         */
        public transformUpdateEnabled: boolean;

        private _renderDisplay: egret.DisplayObject;
        private _colorFilter: egret.ColorMatrixFilter;

        /**
         * @language zh_CN
         * 创建一个空的插槽。
         * @version DragonBones 3.0
         */
        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            this.transformUpdateEnabled = false;

            this._renderDisplay = null;
            this._colorFilter = null;
        }

        /**
         * @private
         */
        protected _onUpdateDisplay(): void {
            if (!this._rawDisplay) {
                this._rawDisplay = new egret.Bitmap();
            }

            this._renderDisplay = <egret.DisplayObject>(this._display || this._rawDisplay);
        }
        /**
         * @private
         */
        protected _initDisplay(value: Object): void {
        }
        /**
         * @private
         */
        protected _addDisplay(): void {
            const container = <EgretArmatureDisplay>this._armature._display;
            container.addChild(this._renderDisplay);
        }
        /**
         * @private
         */
        protected _replaceDisplay(value: Object): void {
            const container = <EgretArmatureDisplay>this._armature._display;
            const prevDisplay = <egret.DisplayObject>value;
            container.addChild(this._renderDisplay);
            container.swapChildren(this._renderDisplay, prevDisplay);
            container.removeChild(prevDisplay);
        }
        /**
         * @private
         */
        protected _removeDisplay(): void {
            this._renderDisplay.parent.removeChild(this._renderDisplay);
        }
        /**
         * @private
         */
        protected _disposeDisplay(value: Object): void {
            //
        }
        /**
         * @private
         */
        public _updateVisible(): void {
            this._renderDisplay.visible = this._parent.visible;
        }
        /**
         * @private
         */
        private static BLEND_MODE_LIST: Array<string> =
        [
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
        /**
         * @private
         */
        protected _updateBlendMode(): void {
            if (this._blendMode < EgretSlot.BLEND_MODE_LIST.length) {
                const blendMode = EgretSlot.BLEND_MODE_LIST[this._blendMode];
                if (blendMode) {
                    this._renderDisplay.blendMode = blendMode;
                }
            }
        }
        /**
         * @private
         */
        protected _updateColor(): void {
            if (
                this._colorTransform.redMultiplier != 1 ||
                this._colorTransform.greenMultiplier != 1 ||
                this._colorTransform.blueMultiplier != 1 ||
                this._colorTransform.redOffset != 0 ||
                this._colorTransform.greenOffset != 0 ||
                this._colorTransform.blueOffset != 0 ||
                this._colorTransform.alphaOffset != 0
            ) {
                if (!this._colorFilter) {
                    this._colorFilter = new egret.ColorMatrixFilter();
                }

                const colorMatrix = this._colorFilter.matrix;
                colorMatrix[0] = this._colorTransform.redMultiplier;
                colorMatrix[6] = this._colorTransform.greenMultiplier;
                colorMatrix[12] = this._colorTransform.blueMultiplier;
                colorMatrix[18] = this._colorTransform.alphaMultiplier;
                colorMatrix[4] = this._colorTransform.redOffset;
                colorMatrix[9] = this._colorTransform.greenOffset;
                colorMatrix[14] = this._colorTransform.blueOffset;
                colorMatrix[19] = this._colorTransform.alphaOffset;
                this._colorFilter.matrix = colorMatrix;

                let filters = this._renderDisplay.filters;
                if (!filters) {
                    filters = [];
                }

                if (filters.indexOf(this._colorFilter) < 0) {
                    filters.push(this._colorFilter);
                }

                this._renderDisplay.filters = filters;
            } else {
                if (this._colorFilter) {
                    this._colorFilter = null;
                    this._renderDisplay.filters = null;
                }

                this._renderDisplay.$setAlpha(this._colorTransform.alphaMultiplier);
            }
        }
        /**
         * @private
         */
        protected _updateFilters(): void { }
        /**
         * @private
         */
        protected _updateFrame(): void {
            const frameDisplay = <egret.Bitmap>this._renderDisplay;

            if (this._display && this._displayIndex >= 0) {
                const rawDisplayData = this._displayIndex < this._displayDataSet.displays.length ? this._displayDataSet.displays[this._displayIndex] : null;
                const replacedDisplayData = this._displayIndex < this._replacedDisplayDataSet.length ? this._replacedDisplayDataSet[this._displayIndex] : null;
                const currentDisplayData = replacedDisplayData || rawDisplayData;
                const currentTextureData = <EgretTextureData>currentDisplayData.textureData;
                if (currentTextureData) {
                    const textureAtlasTexture = (<EgretTextureAtlasData>currentTextureData.parent).texture;
                    if (!currentTextureData.texture && textureAtlasTexture) { // Create and cache texture.
                        currentTextureData.texture = new egret.Texture();
                        currentTextureData.texture._bitmapData = textureAtlasTexture._bitmapData;

                        currentTextureData.texture.$initData(
                            currentTextureData.region.x, currentTextureData.region.y,
                            Math.min(currentTextureData.region.width, textureAtlasTexture.textureWidth - currentTextureData.region.x), Math.min(currentTextureData.region.height, textureAtlasTexture.textureHeight - currentTextureData.region.y),
                            0, 0,
                            Math.min(currentTextureData.region.width, textureAtlasTexture.textureWidth - currentTextureData.region.x), Math.min(currentTextureData.region.height, textureAtlasTexture.textureHeight - currentTextureData.region.y),
                            textureAtlasTexture.textureWidth, textureAtlasTexture.textureHeight
                        );
                    }

                    const texture = (<egret.Texture>this._armature._replacedTexture) || currentTextureData.texture;

                    if (this._meshData && this._display == this._meshDisplay) { // Mesh.
                        const meshDisplay = <egret.Mesh>this._meshDisplay;
                        const meshNode = <egret.sys.MeshNode>meshDisplay.$renderNode;

                        meshNode.uvs.length = 0;
                        meshNode.vertices.length = 0;
                        meshNode.indices.length = 0;

                        for (let i = 0, l = this._meshData.vertices.length; i < l; ++i) {
                            meshNode.uvs[i] = this._meshData.uvs[i];
                            meshNode.vertices[i] = this._meshData.vertices[i];
                        }

                        for (let i = 0, l = this._meshData.vertexIndices.length; i < l; ++i) {
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
                            const transformationMatrix = meshDisplay.matrix;
                            transformationMatrix.identity();
                            meshDisplay.matrix = transformationMatrix;
                        }
                    } else { // Normal texture.
                        const rect = currentTextureData.frame || currentTextureData.region;

                        let width = rect.width;
                        let height = rect.height;
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
        }
        /**
         * @private
         */
        protected _updateMesh(): void {
            const meshDisplay = <egret.Mesh>this._meshDisplay;
            const meshNode = <egret.sys.MeshNode>meshDisplay.$renderNode;
            const hasFFD = this._ffdVertices.length > 0;

            if (this._meshData.skinned) {
                for (let i = 0, iF = 0, l = this._meshData.vertices.length; i < l; i += 2) {
                    let iH = i / 2;

                    const boneIndices = this._meshData.boneIndices[iH];
                    const boneVertices = this._meshData.boneVertices[iH];
                    const weights = this._meshData.weights[iH];

                    let xG = 0, yG = 0;

                    for (let iB = 0, lB = boneIndices.length; iB < lB; ++iB) {
                        const bone = this._meshBones[boneIndices[iB]];
                        const matrix = bone.globalTransformMatrix;
                        const weight = weights[iB];

                        let xL = 0, yL = 0;
                        if (hasFFD) {
                            xL = boneVertices[iB * 2] + this._ffdVertices[iF];
                            yL = boneVertices[iB * 2 + 1] + this._ffdVertices[iF + 1];
                        } else {
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
            } else if (hasFFD) {
                const vertices = this._meshData.vertices;
                for (let i = 0, l = this._meshData.vertices.length; i < l; i += 2) {
                    const xG = vertices[i] + this._ffdVertices[i];
                    const yG = vertices[i + 1] + this._ffdVertices[i + 1];
                    meshNode.vertices[i] = xG;
                    meshNode.vertices[i + 1] = yG;
                }

                meshDisplay.$updateVertices();
                meshDisplay.$invalidateTransform();
            }
        }
        /**
         * @private
         */
        protected _updateTransform(): void {
            this._renderDisplay.$setMatrix(<egret.Matrix><any>this.globalTransformMatrix, this.transformUpdateEnabled);
        }
    }
}