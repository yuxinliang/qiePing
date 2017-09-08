class mySound {
	public static soundBg = true;

	private static sound: egret.Sound;
	private static channel: egret.SoundChannel;

	private static soundList = ["left"];
	private static isPlaying: boolean = false;
	public constructor() {
	}
	public static init() {

	}
	/** 目前 戰鬥音樂和背景音樂一起處理，只可播放其一。戰鬥完成後，自動切回到背景音樂，可擴展為每張地圖一個音樂
	 * 音樂列表中，0，為城市背景音樂，1,為副本音樂，2，為戰鬥音樂。  
	*/
	public static changeSoundBG(num: number = 0): void {

		try {
			//创建 URLLoader 对象
			var loader: egret.URLLoader = new egret.URLLoader();
			//设置加载方式为声音
			loader.dataFormat = egret.URLLoaderDataFormat.SOUND;
			//添加加载完成侦听
			loader.addEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
			loader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onLoadError, this);
			//音频资源放在resource文件夹下
			var url: string = "resource/life.mp3";
			var request: egret.URLRequest = new egret.URLRequest(url);
			//开始加载
			loader.load(request);
			//RES.getResAsync(this.soundList[num], this.onLoadComplete, this);
		} catch (error) {

		}
	}

	private static onLoadComplete(event: egret.Event): void {
		this.sound = event.currentTarget.data;
		this.updataSoundBg();
	}
	private static onLoadError(event: egret.IOErrorEvent) {
		
	}

	/***刷新背景音樂應該有的狀態 */
	public static updataSoundBg() {
		this.channel = this.sound.play();
	}

	public static destory() {
		if (this.channel) {
			this.channel.stop();
			this.channel = null;
		}
		this.sound = null;

	}
}