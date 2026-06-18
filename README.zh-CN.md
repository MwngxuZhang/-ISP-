# 学习 ISP？有我就够啦

RAW ISP RGB Lab 鏄竴涓紑婧愬涔犲瀷宸ュ叿閾撅紝闈㈠悜甯屾湜鐞嗚В瀹屾暣鐩告満鍥惧儚閾捐矾鐨勫浘鍍忓伐绋嬪笀銆両SP 鍒濆鑰呭拰鐩告満绠楁硶瀛︿範鑰呫€傚畠鍏虫敞浠庝紶鎰熷櫒 RAW 鏁版嵁鍒板彲鏄剧ず RGB 鍥惧儚鐨勫畬鏁磋繃绋嬨€?
杩欎釜椤圭洰鍒绘剰淇濇寔灏忚€屾竻鏅般€傚綋鍓嶇増鏈槸涓€涓潤鎬?Web 搴旂敤锛屾病鏈夎繍琛屾椂渚濊禆锛屽苟鎶婃瘡涓?ISP 闃舵閮藉彲瑙嗗寲鍑烘潵锛?
1. Bayer RAW 椹禌鍏?2. 榛戠數骞虫牎姝ｄ笌褰掍竴鍖?3. 鍧忕偣鏍℃
4. 闀滃ご闃村奖鏍℃
5. 鍙岀嚎鎬у幓椹禌鍏?6. 鐧藉钩琛′笌鑷姩鐧藉钩琛?7. 棰滆壊鏍℃鐭╅樀
8. 闄嶅櫔
9. 閿愬寲
10. 鏇濆厜銆佸姣斿害銆侀ケ鍜屽害銆丟amma 鍜?RGB 棰勮

## 蹇€熷紑濮?
鍙互鐩存帴鐢ㄦ祻瑙堝櫒鎵撳紑 `index.html`锛屼篃鍙互鍚姩鏈湴闈欐€佹湇鍔★細

```bash
npm run start
```

鐒跺悗鎵撳紑锛?
```text
http://127.0.0.1:4173
```

浣跨敤椤甸潰椤堕儴鐨?`Language / 璇█` 閫夋嫨鍣紝鍙互鍦ㄨ嫳鏂囧拰涓枃鐣岄潰涔嬮棿鍒囨崲銆傛祻瑙堝櫒浼氳浣忎綘鐨勯€夋嫨銆?
杩愯娴嬭瘯锛?
```bash
npm test
```

## 鏀寔鍔犺浇鐨勬暟鎹?
- 鍐呯疆鍚堟垚 Bayer RAW 鏍蜂緥锛岄€傚悎瀛︿範鍜岃皟璇?- 灏忓昂瀵告牱渚嬫枃浠讹細`samples/synthetic-rggb-8x8.pgm`
- 宸叉祴璇曠殑浜岃繘鍒?RAW 鏍蜂緥锛歚samples/synthetic-rggb-16x12-12bit-little.raw`
- PGM 鏂囦欢锛歚P2` 鍜?`P5`
- 鏅€氫簩杩涘埗 `.raw` 鏂囦欢锛屽彲鍦ㄧ晫闈腑濉啓瀹藉害銆侀珮搴︺€佷綅娣便€丅ayer 鎺掑垪鍜屽ぇ灏忕

## 鍙鍖栧涔犲姛鑳?
- 鐢?pipeline 杞ㄩ亾涓€鐪肩湅鍒?RAW 鍒?RGB 鐨勫鐞嗛『搴?- 搴旂敤鍐呰交閲?CSS 3D Pixel 鍚戝锛岀洿鎺ヨВ閲婃瘡涓樁娈?- 璁茶В鍛樹細鎻愮ず鎺т欢銆侀鏈熺粨鏋溿€佸父瑙佸潙鍜屽涔犳鏌ョ偣
- 鍚夌ゥ鐗╀細娴姩銆佹尌鎵嬨€佹寚鍚戙€佹€濊€冦€佽蛋璺€佸簡绁濄€佸脊鍑烘皵娉★紝骞舵牴鎹偣鍑婚樁娈点€佹紨绀哄浘銆丄pply tip銆両 got it 鍜岃皟鍙傛搷浣滄敼鍙樺姩浣?- 姣忎釜闃舵閮藉鍔犻€傚悎鏂版墜璁板繂鐨勫舰璞＄被姣旓紝璁╁師鐞嗘洿瀹规槗鐞嗚В
- 姣忎釜闃舵閮藉鍔犱氦浜掑叕寮忛潰鏉匡紝鍖呭惈鍏紡鏂囨湰銆佸彉閲忚В閲娿€佹粦鏉″拰灏忓瀷 canvas 鍥剧ず
- 鎷栧姩鍏紡婊戞潯鏃朵細瑙﹀彂鍚夌ゥ鐗╄瑙ｏ紝甯姪鍒濆鑰呮妸鏁板鍏紡鍜屽浘鍍忓彉鍖栬仈绯昏捣鏉?- 缃戦〉瀹犵墿浼氱Щ鍔ㄥ埌褰撳墠闃舵鍗＄墖鎴栫浉鍏虫帶浠堕檮杩戯紝璺熼殢瀛︿範娴佺▼璁茶В鍘熺悊
- 鑻辨枃 / 涓枃鐣岄潰鍒囨崲锛岃鐩栨帶浠躲€佹紨绀哄崱鐗囥€佸悜瀵兼枃鏈拰鍚夌ゥ鐗╂皵娉?- 宸叉祴璇曟紨绀哄浘搴擄紝鎻愪緵 6 寮犲彲閫夊涔犲浘鐗?- 涓婁竴姝?/ 涓嬩竴姝ュ紩瀵煎紡瀛︿範娴佺▼
- `Apply tip` 鎸夐挳锛屼竴閿簲鐢ㄥ畨鍏ㄧ殑鍒濆鑰呭疄楠屽弬鏁?- 澶氫釜鍐呯疆瀛︿範妗堜緥锛氳壊鍗°€佹殫鍏夈€佹殫瑙掋€佸潖鐐广€佺伆闃躲€侀珮瀵规瘮
- 澶у昂瀵告渶缁?RGB 棰勮
- 姣忎釜闃舵閮芥湁鍥惧儚棰勮
- 姣忎釜闃舵閮芥湁鐩存柟鍥?- 姣忎釜闃舵閮芥湁鍧囧€?/ 鑼冨洿鎸囨爣
- 鍙墜鍔ㄨ皟鏁?sensor levels銆丅PC銆丩SC銆乄B銆丆CM銆侀檷鍣€侀攼鍖栧拰 tone 鍙傛暟
- 鐏颁笘鐣岃嚜鍔ㄧ櫧骞宠　鎸夐挳
- 鏈€缁?PNG 瀵煎嚭
- ISP preset JSON 瀵煎嚭

## 鏂囨。

- [浣跨敤鎸囧崡](docs/USER_GUIDE.zh-CN.md)
- [椤圭洰鐞嗚В](docs/PROJECT_UNDERSTANDING.zh-CN.md)
- [鎶€鏈璁(docs/TECHNICAL_DESIGN.zh-CN.md)
- [寮€鍙戣鍒抅(docs/DEVELOPMENT_PLAN.zh-CN.md)
- [鏁欏鍔╂墜椤圭洰鐞嗚В](docs/EDUCATIONAL_ASSISTANT_UNDERSTANDING.zh-CN.md)
- [鏁欏鍔╂墜鎶€鏈璁(docs/EDUCATIONAL_ASSISTANT_TECHNICAL_DESIGN.zh-CN.md)
- [鏁欏鍔╂墜寮€鍙戣鍒抅(docs/EDUCATIONAL_ASSISTANT_DEVELOPMENT_PLAN.zh-CN.md)

涔熸彁渚涜嫳鏂囩増鏈細

- [English README](README.en.md)
- [User guide](docs/USER_GUIDE.en.md)
- [Project understanding](docs/PROJECT_UNDERSTANDING.en.md)
- [Technical design](docs/TECHNICAL_DESIGN.en.md)
- [Development plan](docs/DEVELOPMENT_PLAN.en.md)
- [Educational assistant understanding](docs/EDUCATIONAL_ASSISTANT_UNDERSTANDING.en.md)
- [Educational assistant technical design](docs/EDUCATIONAL_ASSISTANT_TECHNICAL_DESIGN.en.md)
- [Educational assistant development plan](docs/EDUCATIONAL_ASSISTANT_DEVELOPMENT_PLAN.en.md)

## 浠撳簱缁撴瀯

```text
docs/
  USER_GUIDE.en.md                How to use the lab
  USER_GUIDE.zh-CN.md             浣跨敤鎸囧崡
  PROJECT_UNDERSTANDING.en.md     Project goals and scope
  PROJECT_UNDERSTANDING.zh-CN.md  椤圭洰鐩爣涓庤寖鍥?  TECHNICAL_DESIGN.en.md          Architecture and pipeline details
  TECHNICAL_DESIGN.zh-CN.md       鏋舵瀯涓庢祦姘寸嚎缁嗚妭
  DEVELOPMENT_PLAN.en.md          Implementation roadmap
  DEVELOPMENT_PLAN.zh-CN.md       寮€鍙戣矾绾垮浘
src/
  isp-core.js                     鍙鐢?ISP 绠楁硶涓庤В鏋愬櫒
  app.js                          娴忚鍣ㄧ晫闈㈤€昏緫
  styles.css                      搴旂敤鏍峰紡
tests/
  run-tests.mjs                   鏍稿績绠楁硶娴嬭瘯
scripts/
  static-server.mjs               杞婚噺鏈湴闈欐€佹湇鍔?index.html                        闈欐€佸彲瑙嗗寲搴旂敤
```

## 褰撳墠鐘舵€?
杩欐槸涓€涓潰鍚戝涔犲拰蹇€熷疄楠岀殑鍙繍琛屽涔犲疄楠屽锛岃繕涓嶆槸鐢熶骇绾у浘鍍忚川閲?pipeline銆備唬鐮佷紭鍏堣拷姹傛竻鏅般€佸彲璇诲拰渚夸簬鏁欏锛岃€屼笉鏄拡瀵瑰叿浣撲紶鎰熷櫒鍋氭繁搴﹁皟浼樸€?
## 鍚庣画璺嚎

- 澧炲姞 DNG/TIFF 鍏冩暟鎹В鏋?- 澧炲姞 waveform 鍜?vectorscope 闈㈡澘
- 澧炲姞 ISP 鍙傛暟 preset 瀵煎叆
- 澧炲姞 Python 鍙傝€冭剼鏈紝鏀寔鎵瑰鐞?- 涓哄ぇ灏哄 RAW 澧炲姞 WebGPU 鎴?WASM 鍔犻€熻矾寰?
