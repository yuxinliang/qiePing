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
    var DURING = "during";
    var ComicDataParser = (function (_super) {
        __extends(ComicDataParser, _super);
        function ComicDataParser() {
            return _super.call(this) || this;
        }
        ComicDataParser.getComicDataFormArmatureData = function (armatureData) {
            return armatureData.userData;
        };
        /**
         * @private
         */
        ComicDataParser.prototype._parseArmature = function (rawData) {
            var armature = _super.prototype._parseArmature.call(this, rawData);
            var comicData = { durings: [] };
            armature.userData = comicData;
            if (armature && DURING in rawData) {
                var duringObjects = rawData[DURING];
                for (var i = 0, l = duringObjects.length; i < l; ++i) {
                    var duringObject = duringObjects[i];
                    var during = { frame: duringObject.frame, height: duringObject.height };
                    comicData.durings.push(during);
                }
            }
            return armature;
        };
        return ComicDataParser;
    }(dragonBones.ObjectDataParser));
    dragonBones.ComicDataParser = ComicDataParser;
    __reflect(ComicDataParser.prototype, "dragonBones.ComicDataParser");
})(dragonBones || (dragonBones = {}));
//# sourceMappingURL=comic.js.map