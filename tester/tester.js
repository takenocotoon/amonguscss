"use strict";

// URIクエリ取得
const searchParams = new URLSearchParams(window.location.search);
var users = [];
// console.log(window.location.search)
for (let i = 0; i < 15; i++) {
    // print(searchParams.has('id'+i))
    // print(searchParams.has('nm'+i))
    if (searchParams.has('id'+i) && searchParams.has('nm'+i) && !isNaN(Number(searchParams.get('id'+i)))) {
        users.push({'id':searchParams.get('id'+i), 'name':searchParams.get('nm'+i)});
    }
};
if (users.length < 1){
    for (let i = 1; i < 11; i++) {
        users.push({'id':('000000000000000000'+i).slice(-18), 'name':'ダミー'+(i)});
    }
};

let is_sample = '';
if (searchParams.has('sample')) {
    if (searchParams.get('sample')=='my_custom') is_sample = 'my_custom';
    else is_sample = 'on';
}
    
// users.sort((a, b) => a.name > b.name);


// ユーザー追加
function createUserElements() {
    const ul = document.getElementsByClassName('Voice_voiceStates__a121W')[0]
    for (let i = 0; i < users.length; ++i) {
        let li = document.createElement('li');
        li.className = 'Voice_voiceState__OCoZh';
        
        let img = document.createElement('img');
        img.className = 'Voice_avatar__htiqH';
        img.src = './icons/' + ('00'+(i+1)).slice(-2) +'.png?https://cdn.discordapp.com/avatars/'+ users[i]['id'] +'/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.jpg';
        li.appendChild(img);

        let div = document.createElement('div');
        div.className = 'Voice_user__8fGwX';
        let span = document.createElement('span');
        span.className = 'Voice_name__TALd9';
        span.style = 'color: rgb(255, 255, 255); font-size: 14px; background-color: rgba(30, 33, 36, 0.95);';
        span.textContent = users[i]['name'];
        div.appendChild(span);
        li.appendChild(div);

        ul.appendChild(li);
    }
};


// 喋らせる
function speak(avatar) {
	const time1 = 2000 + 1000 * users.length * Math.random();
	const time2 = 1000 + 3000 * Math.random();
	(function(a) {
	    setTimeout(function(){
            a.classList.add('Voice_avatarSpeaking__lE\+4m');
            (function(b) {
                setTimeout(function(){
                    b.classList.remove('Voice_avatarSpeaking__lE\+4m');
                    speak(b);
                }, time2);
            })(a);
	    }, time1);
	})(avatar);
};


// 喋らせる準備
function setSpeak() {
    const avatars = document.getElementsByTagName('img')
    for(let i = 0; i < avatars.length; ++i){
        speak(avatars[i]);
    }
};


function setCss() {
    let css = localStorage.getItem('amonguscss_sample_css');
    // console.log(is_sample);
    if (!is_sample || !css) return;
    // console.log(css)
    // css = css.replace(/@charset \\UTF-8\\;\\r\\n/g, '');
    // css = css.replace(/\"/g, '');
    // css = css.replace(/\\r/g, '');
    // css = css.replace(/\\n/g, '');
    // console.log(css)

    let head = document.getElementsByTagName('head')[0];

    if (is_sample == 'on') {
        let link = document.createElement('link');
        link.href = "./sample.css";
        link.rel = "stylesheet"
        head.appendChild(link);
    }
    let style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.textContent = css;
    head.appendChild(style);
}

// 起動
window.onload = function() {
    setCss();
    createUserElements();
    setSpeak();
};