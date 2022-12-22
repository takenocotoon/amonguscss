"use strict";
let myCSS = localStorage.getItem('amonguscss-myCSS') || "";

function setSelects() {
  generateCSS();
  // generateTestUri();
  let position = document.getElementById('css-output').getBoundingClientRect();
	window.scrollTo( 0, position.top);
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

  localStorage.setItem('amonguscss', JSON.stringify(save));
}

function generateCSS() {

  setLocalStorage();
	let data = document.getElementById('css-input').value;
  data.replace(/\&/g, '&amp;').replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace(/\"/g, '&quot;').replace(/\'/g, '&#x27');
  localStorage.setItem('amonguscss-myCSS', data);

  for (let k in colors) {
    // if (k=='none') continue;
    colors[k] = document.getElementById('discord-id-'+k).value || '000000000000000000';
    data = data.split('/*'+k+'ID*/').join(colors[k])
  }
  save['colors'] = colors;
  let textarea = document.getElementById('css-output');
  textarea.innerHTML = data;
  textarea.select();
  textarea.setSelectionRange(0, 999999);
  document.execCommand('copy');
  // Cookies.set('colors', colors, { expires: 365});
  
  localStorage.setItem('amonguscss_sample_css', data);
  localStorage.setItem('amonguscss', JSON.stringify(save));
  generateTestUri();
}

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
  sample_object.data = 'tester/?sample=my_custom&' + query.join('&');
}

function copyCSS() {
  let textarea = document.getElementById('css-output');
  textarea.select();
  textarea.setSelectionRange(0, 999999);
  document.execCommand('copy');
}

function copyTestUri() {
    let textarea = document.getElementById('test-url-output');
    textarea.select();
    document.execCommand('copy');
}

function setCSS() {
  let data;
  if (myCSS == "") {
	  let xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET','./template/mycustom-sample.css',true);
    xmlHttp.send(null);
    xmlHttp.onload = function(){
      data = xmlHttp.responseText;
      document.getElementById('css-input').value = data;
    }
  } else {
    data = myCSS;
    data.replace(/\&/g, '&amp;').replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace(/\"/g, '&quot;').replace(/\'/g, '&#x27');
    document.getElementById('css-input').value = data;
  }
}

window.onload = function() {
  setSelectCookie();
  setCSS();
  generateCSS();
  // generateTestUri();
}
