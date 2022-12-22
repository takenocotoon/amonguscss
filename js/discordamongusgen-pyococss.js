"use strict";
const avatarMargin10 = '189px';
const avatarMargin15 = '120px';

function setSelects() {
    // generateHtUsCSS();
    // setLocalStorage();
    generateCSS();
    // generateTestUri();
}

function setLocalStorage() {
    colorids = [];
    for (let k in colors) {
        let val = document.getElementById('discord-id-' + k).value;
        if (val != '' && val != '000000000000000000') {
            if (colorids.includes(val)) {
                alert('同じ人が複数指定されてるよ！');
                return;
            } else {
                colorids.push(val);
            }
        }
    }
    for (let k in colors) {
        colors[k] = document.getElementById('discord-id-' + k).value || '000000000000000000';
    }
    save['colors'] = colors;

    for (let option in options) {
        options[option] = document.getElementById(option).value;
        save['options'][option] = options[option];
    }
    localStorage.setItem('amonguscss', JSON.stringify(save));
}

function generateCSS() {
    setLocalStorage();
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', './template/amonguscss.css?202212192100', true);
    xmlHttp.send(null);
    xmlHttp.onload = function () {
        let data = xmlHttp.responseText;

        // 色指定
        for (let k in colors) {
            // colors[k] = document.getElementById('discord-id-' + k).value || '000000000000000000';
            data = data.replace('/*' + k + 'ID*/', colors[k]);
        }

        // 並び方
        let alignment_args = options['alignment'].split('-')
        if      (alignment_args[0] == 'left')   data = data.replace('/*alignment*/', 'flex-start');
        else if (alignment_args[0] == 'right')  data = data.replace('/*alignment*/', 'flex-end');
        else if (alignment_args[0] == 'center') data = data.replace('/*alignment*/', 'center');
        else                                    data = data.replace('/*alignment*/', 'space-around');
        if (alignment_args.length > 1) {
            if (alignment_args[1] == 'narrow')  data = data.replace('/*avatar-width*/', avatarMargin15);
            else                                data = data.replace('/*avatar-width*/', avatarMargin10);
        } else if (alignment_args[0] == 'flex') data = data.replace('/*avatar-width*/', '100%');
        else                                    data = data.replace('/*avatar-width*/', '150px');
            
        if (options['display_icon'] != 'on')  data = data.replace('/*avatar-height*/', avatarMargin15);
        else if (alignment_args[0] != 'flex') data = data.replace('/*avatar-height*/', 'var(--avatar-width)');
        else                                  data = data.replace('/*avatar-height*/', '150px');

        // 名前の位置
        let name_y_args = options['name_y'].split('-')
        if (name_y_args.length > 1) {
            let name_odd_css = `/* 名前をずらす */
li[class*='Voice_voiceState_']:nth-child(odd) div[class*='Voice_user_'] span{
    bottom: calc(0.8rem + var(--user-name-y));
}
li[class*='Voice_voiceState_']:nth-child(even) div[class*='Voice_user_'] span{
    bottom: calc(2.2rem + var(--user-name-y));
}`;
            data = data.replace('/*usernameodd*/', name_odd_css);
        }
        if (name_y_args[0] == 'none') data = data.replace('/*name-display*/', 'none');
        else                          data = data.replace('/*name-display*/', 'block');

        if (name_y_args[0] == 'icon') data = data.replace('/*user-name-y*/', '0px');
        else                          data = data.replace('/*user-name-y*/', 'var(--avatar-height)');

        // 名前の大きさ
        if (options['name_size'] != '') data = data.replace('/*user-name-size*/', options['name_size']);
        else                            data = data.replace('/*user-name-size*/', '25px');

        // フォント
        if (options['name_font'] != '') data = data.replace('/*font*/', "font-family: '" + options['name_font'] + "', sans-serif;");

        // アイコン
        if (options['display_icon'] == 'on') data = data.replace('/*display-height*/', '600px');
        else {
            data = data.replace('/*display-height*/', '720px');
            data = data.replace('/*display_icon*/', 'display: none;');
        }

        // アウトプット
        let textarea = document.getElementById('css-output');
        textarea.innerHTML = data;
        textarea.select();
        textarea.setSelectionRange(0, 999999);
        // if (window.clipboardData) {
        //     window.clipboardData.setData("Text" , data);
        // } else {
        //     navigator.clipboard.writeText(data);
        // }
        document.execCommand('copy');
        localStorage.setItem('amonguscss_sample_css', data);
        generateTestUri();
        // Cookies.set('colors', colors, { expires: 365 });
        // Cookies.set('avatarWidthCookie', memnum, { expires: 365 });
        // Cookies.set('nameFontCookie', namefont, { expires: 365 });
        // localStorage.setItem('amonguscss', JSON.stringify({'discordIDs':discordIDs, 'colors':colors, 'avatarWidthCookie':avatarWidthCookie, 'nameFontCookie':nameFontCookie}));
    }
}

// function generateHtUsCSS() {
//     //  let num = 0;
//     //  for (let k in colors) {
//     //    let val = document.getElementById('discord-id-'+k).value;
//     //    if ( val != '' && val != '000000000000000000' ) {
//     //      ++num;
//     //      if (num>10) {
//     //        alert('指定する人数が多すぎるよ！');
//     //        return;
//     //      }
//     //    }
//     //  }
//     let xmlHttp = new XMLHttpRequest();
//     xmlHttp.open('GET', 'amonghttpstatus.css?202106251800', true);
//     xmlHttp.send(null);
//     xmlHttp.onload = function () {
//         let data = xmlHttp.responseText;

//         let sortNames = [];
//         for (let k in colors) {
//             colors[k] = document.getElementById('discord-id-' + k).value || '000000000000000000';
//             if (colors[k] != '000000000000000000') {
//                 sortNames.push({ 'name': discordIDs[colors[k]], 'color': k });
//             }
//         }

//         sortNames.sort(function (a, b) {
//             var nameA = a.name.toUpperCase();
//             var nameB = b.name.toUpperCase();
//             if (nameA < nameB) { return -1; }
//             if (nameA > nameB) { return 1; }
//             return 0;
//         });

//         for (let i = 0; i < sortNames.length; i++) { data = data.replace('/*' + i + '*/', sortNames[i]['color']); }
//         data = data.replace(/(\/\*[0-9]+\*\/)/g, 'none');

//         let memnum = document.getElementById('avatar-width').value;
//         if (memnum == '15' || (memnum == '' && colorids.length > 10)) {
//             data = data.replace('/*avatar-width*/', avatarMargin15);
//         } else {
//             data = data.replace('/*avatar-width*/', avatarMargin10);
//         }

//         let textarea = document.getElementById('css-output-htus');
//         textarea.innerHTML = data;
//         textarea.select();
//         textarea.setSelectionRange(0, 99999);
//         document.execCommand('copy');
//         Cookies.set('colors', colors, { expires: 365 });
//     }
// }


function generateTestUri() {
    let sortNames = [];
    for (let k in colors) {
        // colors[k] = document.getElementById('discord-id-' + k).value || '000000000000000000';
        if (colors[k] != '000000000000000000') {
            sortNames.push({ 'name': discordIDs[colors[k]], 'color': k, 'id': colors[k], });
        }
    }

    sortNames.sort(function (a, b) {
        var nameA = a.name.toUpperCase();
        var nameB = b.name.toUpperCase();
        if (nameA < nameB) { return -1; }
        if (nameA > nameB) { return 1; }
        return 0;
    });

    let query = []
    for (let i = 0; i < sortNames.length; i++) { query.push('id' + i + '=' + sortNames[i]['id'] + '&nm' + i + '=' + encodeURI(sortNames[i]['name'])) }
    let uri = 'https://takenocotoon.github.io/amonguscss/tester/?' + query.join('&')

    let input_area = document.getElementById('test-url-output');
    input_area.value = uri;

    
    let sample_object = document.getElementById('css_sample_area');
    sample_object.data = 'tester/?sample&' + query.join('&');
}

function copyCSS() {
    let textarea = document.getElementById('css-output');
    textarea.select();
    textarea.setSelectionRange(0, 999999);
    // if (window.clipboardData) {
    //     window.clipboardData.setData("Text" , textarea.innerText);
    // } else {
    //     navigator.clipboard.writeText(textarea.innerText);
    // }
    document.execCommand('copy');
}

// function copyHtUsCSS() {
//     let textarea = document.getElementById('css-output-htus');
//     textarea.select();
//     textarea.setSelectionRange(0, 99999);
//     document.execCommand('copy');
// }

function copyTestUri() {
    let textarea = document.getElementById('test-url-output');
    textarea.select();
    // if (window.clipboardData) {
    //     window.clipboardData.setData("Text" , textarea.value);
    // } else {
    //     navigator.clipboard.writeText(textarea.value);
    // }
    document.execCommand('copy');
}

window.onload = function () {
    // generateHtUsCSS();
    setSelectCookie();
    // setLocalStorage();
    generateCSS();
    // generateTestUri();
}
