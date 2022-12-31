"use strict";

let amongUsCss_genCss = {};
amongUsCss_genCss.myCSS = localStorage.getItem('amonguscss-myCSS') || "";


// css生成
amongUsCss_genCss.gen_css = function() {
    let data;
    const elm_input = document.getElementById('is_str_css-input');
    const elm_output = document.getElementById('is_str_gen-css_output');
    let save = amongUsCss.save_options();

    if (!elm_input.value) {
        if (amongUsCss_genCss.myCSS) {
            data = amongUsCss_genCss.myCSS;
            data.replace(/\&/g, '&amp;').replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace(/\"/g, '&quot;').replace(/\'/g, '&#x27');
            elm_input.value = data;
        } else {
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.open('GET','../template/mycustom-sample.css', true);
            xmlHttp.send(null);
            xmlHttp.onload = function(){
                data = xmlHttp.responseText;
                elm_input.value = data;
                amongUsCss_genCss.gen_css();
            };
            return;
        };
    };

    data = elm_input.value;
    data.replace(/\&/g, '&amp;').replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace(/\"/g, '&quot;').replace(/\'/g, '&#x27');
    localStorage.setItem('amonguscss-myCSS', data);

    // 色指定
    for (let color in save.colors) {
        data = data.split('/*'+color+'ID*/').join(save.colors[color]);
    };

    // アウトプット
    elm_output.innerHTML = data;

    localStorage.setItem('amonguscss_sample_css', data);
    amongUsCss_genCss.gen_sample();
    return;
};


// test uri と サンプルセット
amongUsCss_genCss.gen_sample = function() {
    let sortNames = [];
    for (let color in amongUsCss.save.colors) {
        if (amongUsCss.save.colors[color] && amongUsCss.save.colors[color] != '000000000000000000') {
            sortNames.push({ 'name': amongUsCss.save.discordIDs[amongUsCss.save.colors[color]], 'color': color, 'id': amongUsCss.save.colors[color], });
        };
    };

    // Discordの表示順になるように並び替え
    sortNames.sort(function (a, b) {
        var nameA = a.name.toUpperCase();
        var nameB = b.name.toUpperCase();
        if (nameA < nameB) { return -1; }
        if (nameA > nameB) { return 1; }
        return 0;
    });

    // URI生成
    let query = []
    for (let i = 0; i < sortNames.length; i++) { query.push('id' + i + '=' + encodeURI(sortNames[i]['id']) + '&nm' + i + '=' + encodeURI(sortNames[i]['name'])) }
    let uri_parts = location.href.split('/')
    let uri = ''
    for (let part in uri_parts) {
        if (uri_parts[part].indexOf('index') === 0) break
        if (uri_parts[part].indexOf('?') > -1) break
        if (part == uri_parts.length - 2) break
        uri += uri_parts[part] + '/'
    }
    uri += 'tester/?' + query.join('&')

    // 出力
    document.getElementById('is_str_gen-test-url_output').value = uri;
    // サンプル出力
    document.getElementById('is_obj_css-sample_output').data = '../tester/?sample=my_custom&' + query.join('&');

    return;
};
