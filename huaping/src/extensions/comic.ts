namespace dragonBones {
    const DURING: string = "during";

    type DuringData = { frame: number, height: number };
    type ComicData = { durings: Array<DuringData> };

    export class ComicDataParser extends ObjectDataParser {
        public static getComicDataFormArmatureData(armatureData: ArmatureData): ComicData {
            return armatureData.userData;
        }

        public constructor() {
            super();
        }
        /**
         * @private
         */
        protected _parseArmature(rawData: any): ArmatureData {
            const armature = super._parseArmature(rawData);
            
            const comicData: ComicData = { durings: [] };
            armature.userData = comicData;

            if (armature && DURING in rawData) {
                const duringObjects = <Array<DuringData>>rawData[DURING];
                for (let i = 0, l = duringObjects.length; i < l; ++i) {
                    const duringObject = duringObjects[i];
                    const during: DuringData = { frame: duringObject.frame, height: duringObject.height };
                    comicData.durings.push(during);
                }
            }

            return armature;
        }
    }
}