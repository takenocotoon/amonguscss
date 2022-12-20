"use strict";
const avatarMargin10 = '189px';
const avatarMargin15 = '120px';

function setSelects() {
    // generateHtUsCSS();
    generateCSS();
    generateTestUri();
}

function generateCSS() {
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
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', './template/amonguscss.css?202212192100', true);
    xmlHttp.send(null);
    xmlHttp.onload = function () {
        let data = xmlHttp.responseText;

        for (let k in colors) {
            colors[k] = document.getElementById('discord-id-' + k).value || '000000000000000000';
            data = data.replace('/*' + k + 'ID*/', colors[k]);
        }
        let memnum = document.getElementById('avatar-width').value;
        if (memnum == '15' || (memnum != '10' && colorids.length > 10)) {
            data = data.replace('/*avatar-width*/', avatarMargin15);
            data = data.replace('/*usernameodd*/', "li[class*='Voice_voiceState_']:nth-child(odd) div[class*='Voice_user_']{top:-155px;}li[class*='Voice_voiceState_']:nth-child(even) div[class*='Voice_user_'] {top:-185px;}");
        } else {
            data = data.replace('/*avatar-width*/', avatarMargin10);
            data = data.replace('/*usernameodd*/', '');
        }

        let namefont = document.getElementById('namefont').value;
        if (namefont != '') {
            if (namefont == 'none') data = data.replace('/*name-none*/', "div[class*='Voice_user_'] {display:none;}");
            data = data.replace('/*font*/', "font-family: '" + namefont + "', sans-serif;");
        } else data = data.replace('/*font*/', '');

        let textarea = document.getElementById('css-output');
        textarea.innerHTML = data;
        textarea.select();
        textarea.setSelectionRange(0, 999999);
        document.execCommand('copy');
        // Cookies.set('colors', colors, { expires: 365 });
        // Cookies.set('avatarWidthCookie', memnum, { expires: 365 });
        // Cookies.set('nameFontCookie', namefont, { expires: 365 });
        localStorage.setItem('amonguscss', JSON.stringify({'discordIDs':discordIDs, 'colors':colors, 'avatarWidthCookie':avatarWidthCookie, 'nameFontCookie':nameFontCookie}));
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
        colors[k] = document.getElementById('discord-id-' + k).value || '000000000000000000';
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
}

function copyCSS() {
    let textarea = document.getElementById('css-output');
    textarea.select();
    textarea.setSelectionRange(0, 999999);
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
    document.execCommand('copy');
}

window.onload = function () {
    // generateHtUsCSS();
    setSelectCookie();
    if (avatarWidthCookie != '') document.getElementById('avatar-width').value = avatarWidthCookie;
    if (nameFontCookie != '') document.getElementById('namefont').value = nameFontCookie;
    generateCSS();
    generateTestUri();
}
