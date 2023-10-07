"use strict";

let amongUsCap = {};


// 接続
amongUsCap.connect = function () {
    //WebSocket接続
    if (amongUsCap.websocket) amongUsCap.websocket.close();
    amongUsCap.websocket = new WebSocket('ws://localhost:42069/api');

    let elm_msg = document.getElementById('is_str_start-amongUsCapture-api_message')
    const amongUs_color_list = [
      'red', 'blue', 'green', 'pink', 'orange', 'yellow',
      'black', 'white', 'purple', 'brown', 'cyan', 'lime',
      'maroon', 'rose', 'banana', 'gray', 'tan', 'coral',
    ];

    console.log('AmongUsCaptureと接続中です');
    elm_msg.textContent = 'AmongUsCaptureと接続...';

    //接続
    amongUsCap.websocket.onopen = function(event) {
        console.log('AmongUsCaptureと接続できました');
        elm_msg.textContent = 'AmongUsCaptureと接続できました';
        
        amongUsCss.reset_selects();

        //エラー
        amongUsCap.websocket.onerror = function(error) {
            console.log('エラーが発生しました');
            console.log(error.data);
            elm_msg.textContent = 'エラーが発生しました。';
        };

        //切断
        amongUsCap.websocket.onclose = function() {
            console.log('AmongUsCaptureとの接続が切断されました');
            elm_msg.textContent = 'AmongUsCaptureとの接続が切断されました。';
        };
    };

    //受信
    amongUsCap.websocket.onmessage = function(event) {
        console.log(event.data);
        let eventData = JSON.parse(event.data);
        if (!('EventData' in eventData)) return;
        eventData = JSON.parse(eventData['EventData']);
        if (!eventData || !('Name' in eventData) || !('Color' in eventData)) return;

        for (let DiscordID in amongUsCss.save.amongUsNames) {
            if (amongUsCss.save.colors['none'] == DiscordID) continue;

            if (amongUsCss.save.amongUsNames[DiscordID] == eventData['Name']) {

                for (let color in amongUsCss.save.colors) {
                    if (amongUsCss.save.colors[color] == DiscordID) {
                        amongUsCss.save.colors[color] = '000000000000000000';
                        let elm_select = document.getElementById('is_int_gen-css_discord-id-' + color);
                        if(elm_select) elm_select.value = '000000000000000000';
                    };
                };

                amongUsCss.save.colors[amongUs_color_list[eventData['Color']]] = DiscordID;
                let elm_select = document.getElementById('is_int_gen-css_discord-id-' + amongUs_color_list[eventData['Color']]);
                if(elm_select) elm_select.value = DiscordID;
            };
        };
    };

    //エラー
    amongUsCap.websocket.onerror = function(error) {
        console.log('エラーが発生しました');
        console.log(error.data);
        elm_msg.textContent = 'エラーが発生しました。';
    };

    //切断
    amongUsCap.websocket.onclose = function() {
        console.log('AmongUsCaptureと接続できませんでした');
        elm_msg.textContent = 'AmongUsCaptureと接続できませんでした。';
    };
};


// form -> AmongUsName登録
amongUsCap.set_amongUsName = function () {
    const elm_name = document.getElementById('is_str_set-amongUsCapture-Name_amongUs-Name');
    const elm_id = document.getElementById('is_int_set-amongUsCapture-Name_discord-id');

    if (elm_name.value == '') {
        elm_name.classList.add('p-box-error');
        return;
    } else elm_name.classList.remove('p-box-error');
    if (elm_id.value == '' || isNaN(elm_id.value)) return;

    amongUsCss.save.amongUsName_discordIDs[elm_id.value] = elm_name.value;
    amongUsCss.save_localStorage();


    elm_name.value = '';
    elm_id.value = '';

    return;
};


// form -> セレクトフォーム変更 -> 名前入力
amongUsCap.setInput_amongUsName = function () {
    const elm_name = document.getElementById('is_str_set-amongUsCapture-Name_amongUs-Name');
    const elm_id = document.getElementById('is_int_set-amongUsCapture-Name_discord-id');

    if (!elm_id.value || elm_id.value=='000000000000000000') return;

    if (elm_id.value in amongUsCss.save.amongUsName_discordIDs) {
        elm_name.value = amongUsCss.save.amongUsName_discordIDs[elm_id.value];
    };
};