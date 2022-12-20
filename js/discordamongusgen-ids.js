"use strict";
const cookies = document.cookie;
let discordIDs = Cookies.getJSON('discordIDs') || {};
let colors = Cookies.getJSON('colors') || { 'blue': '', 'purple': '', 'red': '', 'pink': '', 'orange': '', 'yellow': '', 'lime': '', 'green': '', 'cyan': '', 'white': '', 'black': '', 'brown': '', 'tan': '', 'coral': '', 'banana': '', 'rose': '', 'gray': '', 'maroon': '', 'none': '' };
if (!('tan' in colors)) {
  colors['tan'] = '';
  colors['coral'] = '';
  colors['banana'] = '';
  colors['rose'] = '';
  colors['gray'] = '';
  colors['maroon'] = '';
}
// if (!('none' in colors)) {
//   colors['none'] = '';
// }
if ('none' in colors) {
  delete colors['none'];
}
console.log(colors)
let avatarWidthCookie = Cookies.getJSON('avatarWidthCookie') || '';
let nameFontCookie = Cookies.getJSON('nameFontCookie') || '';
let selects;
let colorids;

function setDiscordID() {
  let discordNAME = document.getElementById('discord-name').value;
  let discordID = document.getElementById('discord-id').value;

  if (discordNAME == '') {
    document.getElementById('discord-name').classList.add('error');
  } else {
    document.getElementById('discord-name').classList.remove('error');
  }
  if (discordID == '' || isNaN(discordID)) {
    document.getElementById('discord-id').classList.add('error');
    return;
  } else {
    document.getElementById('discord-id').classList.remove('error');
  }
  if (discordNAME == '') return;

  discordIDs[discordID] = discordNAME;
  Cookies.set('discordIDs', discordIDs, { expires: 365 });

  let option = document.createElement('option');
  option.text = discordNAME + ' (' + discordID + ')';
  option.value = discordID;
  for (let i = 0; i < selects.length; ++i) {
    if (selects[i].getAttribute('id').indexOf('discord-id') == -1) continue;
    selects[i].appendChild(option.cloneNode(true));
  }

  document.getElementById('discord-name').value = '';
  document.getElementById('discord-id').value = '';

  return;
}


function clDiscordID() {
  const discordIdCl = document.getElementById('discord-id-cl');
  if (discordIdCl.value == '') return;
  const options = discordIdCl.options
  for (let i = 0, l = options.length; i < l; ++i) {
    if (options[i].selected) {
      delete discordIDs[options[i].value];
      Cookies.set('discordIDs', discordIDs, { expires: 365 });
      for (let j = 0; j < selects.length; ++j) {
        if (selects[j].getAttribute('id').indexOf('discord-id') == -1) continue;
        selects[j].removeChild(selects[j].options[i]);
      }
      return;
    }
  }
  return;
}

function resetSelects() {
  for (let i = 1; i < selects.length; ++i) {
    if (selects[i].getAttribute('id').indexOf('discord-id') == -1) {
      continue;
    }
    selects[i].value = '000000000000000000';
  }
}

function setSelectCookie() {
  selects = document.getElementsByTagName('select');
  for (let i = 0; i < selects.length; ++i) {
    if (selects[i].getAttribute('id').indexOf('discord-id') == -1) continue;
    for (let k in discordIDs) {
      let option = document.createElement('option');
      option.text = discordIDs[k] + ' (' + k + ')';
      option.value = k;
      selects[i].appendChild(option);
    }
    for (let k in colors) {
      if (selects[i].getAttribute('id') == 'discord-id-' + k && colors[k] != '' && colors[k] != '000000000000000000') selects[i].value = colors[k];
    }
  }
}

// window.onload = function () {
//   setSelectCookie();
//   if (avatarWidthCookie != '') document.getElementById('avatar-width').value = avatarWidthCookie;
//   if (nameFontCookie != '') document.getElementById('namefont').value = nameFontCookie;
// }

