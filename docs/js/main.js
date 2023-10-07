"use strict";

let amongUsCss = {};

// コピー
amongUsCss.copyToClipboard = function(elm_id) {
    let elm = document.getElementById(elm_id);
    if (!elm) return;

    let data = '';
    if (elm.nodeName == 'INPUT') {
        data = elm.value;
        elm.select();
    } else if (elm.nodeName == 'TEXTAREA'){
        data = elm.innerText;
        elm.select();
        elm.setSelectionRange(0, 999999);
    } else return;

    if (window.clipboardData) window.clipboardData.setData("Text", data);
    else if (navigator.clipboard) navigator.clipboard.writeText(data);
    else document.execCommand('copy');
};


// ローカルストレージ読み込み
amongUsCss.get_localStorage = function() {
    let save = JSON.parse(localStorage.getItem('amonguscss'));

    // discordIDs = {DiscoedID: DiscordName};
    save['discordIDs'] = 'discordIDs' in save ? save['discordIDs'] : {};

    // amongUsNames = {DiscordID: AmongUsName};
    save['amongUsName_discordIDs'] = 'amongUsName_discordIDs' in save ? save['amongUsName_discordIDs'] : {};
    for (let id in save.discordIDs) {
        if (!(id in save.amongUsName_discordIDs)) {
            save.amongUsName_discordIDs[id] = amongUsCss.get_notDuplicateName(save.amongUsName_discordIDs, id, save.discordIDs[id]);
        };
    };

    // カラー表
    //colors = {Color: DiscordID};
    const colors_default = {
        'blue': '', 'purple': '', 'red': '', 'pink': '', 'orange': '', 'yellow': '',
        'lime': '', 'green': '', 'cyan': '', 'white': '', 'black': '', 'brown': '',
        'tan': '', 'coral': '', 'banana': '', 'rose': '', 'gray': '', 'maroon': '', 'none':'', 
    };
    for (let color in colors_default) {
        if (!(color in save.colors)) save.colors[color] = '000000000000000000';
    };

    // オプション設定
    const options = {'alignment':'', 'name_y':'', 'name_size':'', 'name_font':'', 'display_icon':'', };
    save['options'] = 'options' in save ? save['options'] : options;
    for (let option in options) {
        if (!(option in save['options'])) save['options'][option] = options[option];
    };

    
    return save;
};


// ローカルストレージ保存
amongUsCss.save_localStorage = function() {
    localStorage.setItem('amonguscss', JSON.stringify(amongUsCss.save));
};


// 重複しない名前を返す
amongUsCss.get_notDuplicateName = function(obj, key, name) {
    obj[key] = name;
    let i = 1;
    while (Object.values(obj).filter(v => v == obj[key]).length > 1) {
        i++;
        obj[key] = name + i;
    };

    return obj[key];
};


// selectsにDiscordID追加
amongUsCss.set_DiscordID_in_elmSelects = function(id, name) {
    const elm_selects = document.getElementsByTagName('select');

    for (let i = 0; i < elm_selects.length; ++i) {
        if (elm_selects[i].getAttribute('id').indexOf('discord-id') == -1) continue;

        let elm_option = document.createElement('option');
        elm_option.text = name + ' (' + id + ')';
        elm_option.value = id;
        elm_selects[i].appendChild(elm_option);
    };
};


// form -> 色設定とオプション保存
amongUsCss.save_options = function() {
    let obj_colors = {};
    let is_duplicate = false;
    for (let color in amongUsCss.save.colors) {
        let elm_select = document.getElementById('is_int_gen-css_discord-id-' + color);
        if (!elm_select) continue;

        elm_select.classList.remove('p-form-error');

        if (!elm_select || elm_select.value == '' || elm_select.value == '000000000000000000') {
            obj_colors[color] = '000000000000000000';
            continue;
        };

        obj_colors[color] = elm_select.value;
        if (obj_colors[color] != '' && Object.values(obj_colors).filter(v => v == obj_colors[color]).length > 1) {
            is_duplicate = true;
            for (let myColor in amongUsCss.save.colors) {
                let myElm_select = document.getElementById('is_int_gen-css_discord-id-' + myColor);
                if (!myElm_select) continue;
                if (myElm_select.value == elm_select.value) myElm_select.classList.add('p-form-error');
            };
        };
    };
    if (is_duplicate) {
        alert('同じ人が複数指定されてるよ！');
        return;
    }
    amongUsCss.save.colors = obj_colors;

    for (let option in amongUsCss.save.options) {
        let elm_select = document.getElementById('is_str_gen-css_' + option);
        if (!elm_select) continue;
        amongUsCss.save.options[option] = elm_select.value;
    };

    amongUsCss.save_localStorage();
    return amongUsCss.save;
};


// form -> DiscordID追加
amongUsCss.set_DiscordID = function() {
    let elm_discordNAME = document.getElementById('is_str_set-discord-id_name');
    let elm_discordID = document.getElementById('is_int_set-discord-id_id');
  
    let str_error_msg = '';

    if (elm_discordNAME.value == '') {
        elm_discordNAME.classList.add('p-box-error');
        str_error_msg += '名前が入力されていません。';
    } else elm_discordNAME.classList.remove('p-box-error');

    if (elm_discordID.value == '' || isNaN(elm_discordID.value)) {
        elm_discordID.classList.add('p-box-error');
        str_error_msg = 'IDが不正です。';
    } else elm_discordID.classList.remove('p-box-error');

    if (str_error_msg) return;


    let is_changeDiscordName = elm_discordID.value in amongUsCss.save.discordIDs;

    amongUsCss.save.discordIDs[elm_discordID.value] = elm_discordNAME.value;

    if (!is_changeDiscordName) {
        // amongUsNameデフォルト追加
        amongUsCss.save.amongUsName_discordIDs[elm_discordID.value] = amongUsCss.get_notDuplicateName(amongUsCss.save.amongUsName_discordIDs, elm_discordID.value, elm_discordNAME.value);

        // selectsに追加
        amongUsCss.set_DiscordID_in_elmSelects(elm_discordID.value, elm_discordNAME.value);
    };
    
  
    elm_discordNAME.value = '';
    elm_discordID.value = '';
  
    amongUsCss.save_localStorage();
    return;
};


// form -> DiscordID削除
amongUsCss.cl_DiscordID = function () {
    const elm_selects = document.getElementsByTagName('select');
    let elm_discordID = document.getElementById('is_int_cl-discord-id_id');
    if (!elm_discordID || !elm_discordID.value) return;
    
    for (let i = 0, l = elm_discordID.options.length; i < l; ++i) {
        if (elm_discordID.options[i].selected) {
            delete amongUsCss.save.discordIDs[elm_discordID.options[i].value];
            amongUsCss.save_localStorage();

            for (let j = 0; j < elm_selects.length; ++j) {
                if (elm_selects[j].getAttribute('id').indexOf('discord-id') == -1) continue;
                elm_selects[j].removeChild(elm_selects[j].options[i]);
            };
            return;
        };
    };
    return;
}


// 選択を初期化する
amongUsCss.reset_selects = function() {
    const elm_selects = document.getElementsByTagName('select');
    for (let i = 1; i < elm_selects.length; ++i) {
        if (elm_selects[i].getAttribute('id').indexOf('discord-id') == -1) continue;
        elm_selects[i].value = '000000000000000000';
    };
};


// selects初期化
amongUsCss.remove_selects = function() {
    const elm_selects = document.getElementsByTagName('select');
    for (let i = 0; i < elm_selects.length; ++i) {
        if (elm_selects[i].getAttribute('id').indexOf('discord-id') == -1) continue;
        while(elm_selects[i].childElementCount > 1) elm_selects[i].removeChild(elm_selects[i].lastChild);
    };
};


// リストア
amongUsCss.backUp = {};
amongUsCss.backUp.restore = function () {
    let elm_message = document.getElementById('is_str_restore_message');
    let backup = document.getElementById('is_str_restore_input').value;

    try {
        backup = JSON.parse(backup);

        if (typeof backup !== 'object' ) throw new TypeError('データを読めませんでした。');

        if ('discordIDs' in backup) {
            if (typeof backup['discordIDs'] !== 'object') throw new TypeError('discordIDsが読み込めませんでした。');
            for (let id in backup['discordIDs']) {
                let discordNAME = backup['discordIDs'][id];
                if (!discordNAME) throw new Error('discordIDsが読み込めませんでした。');
                if (id == '' || isNaN(id)) throw new Error('discordIDsが読み込めませんでした。');
              
                amongUsCss.save.discordIDs[id] = discordNAME;
            };
        };

        if ('colors' in backup) {
            if (typeof backup['colors'] !== 'object') throw new TypeError('colorsが読み込めませんでした。');
            for (let color in amongUsCss.save.colors) {
                if (color in backup['colors'] && !isNaN(backup['colors'][color])) amongUsCss.save.colors[color] = backup['colors'][color];
            };
        };

        if ('avatarWidthCookie' in backup) {
            if (typeof backup['avatarWidthCookie'] === 'object') throw new TypeError('読み込みに失敗しました。');
            if (backup['avatarWidthCookie'] == '15')      amongUsCss.save.options['alignment'] = 'left-narrow';
            else if (backup['avatarWidthCookie'] == '10') amongUsCss.save.options['alignment'] = 'left-wide';
        };

        if ('nameFontCookie' in backup) {
            if (typeof backup['nameFontCookie'] === 'object') throw new TypeError('変数が読めませんでした。');
            
            if (backup['nameFontCookie'] == 'none') amongUsCss.save.options['name_y'] = 'none';
            else if (backup['nameFontCookie'] != 'フォント') amongUsCss.save.options['name_font'] = backup['nameFontCookie'];
        };


    } catch (error) {
        console.error(error);
        elm_message.classList.add('p-box-error');
        elm_message.innerText = '読み込みに失敗しました。';
        return;
    };
  
    elm_message.classList.remove('p-box-error');
    elm_message.innerText = '読み込みに成功しました。'

    amongUsCss.save_localStorage();
    amongUsCss.remove_selects();
    amongUsCss.start();

    return;
};


amongUsCss.start = function () {
    // 保存済みDiscordIDをセッティング
    for (let id in amongUsCss.save.discordIDs) {
        // selectsタグに追加
        amongUsCss.set_DiscordID_in_elmSelects(id, amongUsCss.save.discordIDs[id]);
    };

    // 色設定復元
    for (let color in amongUsCss.save.colors) {
        let elm_select = document.getElementById('is_int_gen-css_discord-id-' + color);
        if (!elm_select || amongUsCss.save.colors[color] == '' || amongUsCss.save.colors[color] == '000000000000000000') continue;

        elm_select.value = amongUsCss.save.colors[color];
    };

    // オプション設定復元
    for (let option in amongUsCss.save.options) {
        let elm_select = document.getElementById('is_str_gen-css_' + option);
        if (!elm_select) continue;
        elm_select.value = amongUsCss.save.options[option];
    };

    amongUsCss_genCss.gen_css();
};

// 起動
window.addEventListener('load', function() {
    amongUsCss.save = amongUsCss.get_localStorage();
    amongUsCss.start();
});
