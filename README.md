Discord StreamKit Overlay Among us用ぴょこぴょこカスタムCSSジェネレーター
====

クルーメイトがぴょこぴょこするDiscord StreamKit Overlay カスタムCSSが作れます。

## 使い方

1. Discord IDを取得するため、Discordの開発者モードを有効にします。  
Discordアプリを開き、`ユーザー設定` → `詳細設定` → `開発者モード` で有効にできます。

1. Discordのユーザーを登録します。  
Discordアプリで登録したいユーザーを右クリックし、出てきたプルダウンから `IDをコピー`を選択します。  
[https://takenocotoon.github.io/amonguscss/](https://takenocotoon.github.io/amonguscss/) を開き、 `Discord ID` のテキストボックスに`Ctrl + V` でペーストします。  
`Discord Name` の方にはユーザー名を入れ、 `登録` をクリックします。  
これを参加するユーザーの数だけ繰り返します。  
ここで入力した情報はブラウザのローカルストレージに保管されます。ブラウザのキャッシュをクリアすると消えてしまいます。  

1. 色を選びます。  
色ごとにユーザーを選択します。  
使わない色は色名のままにします。    
全て選択できたら `Set` をクリックして下さい。  
    - フォント  
名前のフォントを選べます。  
フォントは [Google Fonts](https://googlefonts.github.io/japanese/) を利用させて頂いています。  
CSS行頭の@import部分とfont-family:の部分を手直しで修正して頂ければお好みのフォントを使うこともできます。  

1. OBSにセットします。  
OBSアプリを開きます。  
ブラウザソースを追加します。  
    - URL： [https://takenocotoon.github.io/amonguscss/](https://takenocotoon.github.io/amonguscss/) で生成した「テスト用ページ」のURL
    - 幅： 1920
    - 高さ： 600
    - カスタムCSS： [https://takenocotoon.github.io/amonguscss/](https://takenocotoon.github.io/amonguscss/) で生成したCSS  

1. 表示位置を調整します。  
画面下ぴったりが想定しているデフォルト位置になります。お好みで位置や大きさの調整をどうぞ。  
もう少しクルーの足元が見えるようにしたい場合はブラウザソースの高さを大きくしてみて下さい。  
CSSを直接弄られる方は[Among us用カスタムCSSの書き換え補助ツール](https://takenocotoon.github.io/amonguscss/mycustom.html)も合わせてどうぞ。  

1. 本番用に差し替えます。  
[Discord StreamKit Overlay](https://streamkit.discordapp.com/overlay) を開きます。  
`Instal for OBS` → `VOICE WIDGET`  
`Server`と`Voice Channel`を選択します。  
他のオプションは一切触らなくて大丈夫です。  
右側のテキストボックスのURLをコピーして下さい。  
OBSに戻り、さきほど作成したブラウザソースを右クリック、プロパティを開きます。  
URLのところを[Discord StreamKit Overlay](https://streamkit.discordapp.com/overlay)で生成したURLに置き換えて下さい。  


## License

このジェネレーターで生成したCSSは配信などご自由にお使い下さい。常識的な範囲であればCSSの編集改変OKです。報告やクレジット表記なども特に必要ないです。  
CSSの自作発言や再配布はご遠慮ください。  

**こちらのプログラムやCSSを参考にして新しい創作物を作成したい方へ**  
CSS内に含まれるクルー画像含め画像を一切流用しないのであれば、このプログラムやCSSを改変し公開すること、及び再配布を許可します。  
その際はどこかにこのプロジェクトへのリンクとクレジットを明記して下さい。  
改変方法などに関して質問やトラブル対応などは基本受け付けません。自己責任でお願いします。

## Author

[takenocotoon](https://github.com/takenocotoon)
[Twitter @takenocotoon](https://twitter.com/takenocotoon)