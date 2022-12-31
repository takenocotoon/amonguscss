"use strict";

let amongUsCss_genCss = {};


// css生成
amongUsCss_genCss.gen_css = function() {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', './template/amonguscss.css?'+Date.now(), true);
    xmlHttp.send(null);
    xmlHttp.onload = function () {
        let save = amongUsCss.save_options();
        let data = xmlHttp.responseText;
        if (!save || !data) return;

        // 色指定
        for (let color in save.colors) {
            data = data.split('/*'+color+'ID*/').join(save.colors[color]);
        };

        // 並び方
        let array_alignment_args = save.options['alignment'].split('-')
        if      (array_alignment_args[0] == 'left')   data = data.replace('/*alignment*/', 'flex-start');
        else if (array_alignment_args[0] == 'right')  data = data.replace('/*alignment*/', 'flex-end');
        else if (array_alignment_args[0] == 'center') data = data.replace('/*alignment*/', 'center');
        else                                          data = data.replace('/*alignment*/', 'space-around');

        if (array_alignment_args.length > 1) {
            if (array_alignment_args[1] == 'narrow')  data = data.replace('/*avatar-width*/', '128px');
            else                                      data = data.replace('/*avatar-width*/', '192px');
        } else if (array_alignment_args[0] == 'flex') data = data.replace('/*avatar-width*/', '100%');
        else                                          data = data.replace('/*avatar-width*/', '150px');
            
        if (save.options['display_icon'] != 'on')   data = data.replace('/*avatar-height*/', '128px');
        else if (array_alignment_args[0] != 'flex') data = data.replace('/*avatar-height*/', 'var(--avatar-width)');
        else                                        data = data.replace('/*avatar-height*/', '150px');

        if (array_alignment_args[0] == 'flex') data = data.replace('/*voiceState-width*/', '100%');
        else                                   data = data.replace('/*voiceState-width*/', 'auto');

        // 名前の位置
        let array_name_y_args = save.options['name_y'].split('-');
        if (array_name_y_args.length > 1) {
            let name_odd_css = `/* 名前をずらす */
li[class*='Voice_voiceState_']:nth-child(odd) div[class*='Voice_user_'] span{
    bottom: calc(0.8rem + var(--user-name-y));
}
li[class*='Voice_voiceState_']:nth-child(even) div[class*='Voice_user_'] span{
    bottom: calc(2.2rem + var(--user-name-y));
}`;
            data = data.replace('/*usernameodd*/', name_odd_css);
        };

        if (array_name_y_args[0] == 'none') data = data.replace('/*name-display*/', 'none');
        else                                data = data.replace('/*name-display*/', 'block');

        if (array_name_y_args[0] == 'icon') data = data.replace('/*user-name-y*/', '0px');
        else                                data = data.replace('/*user-name-y*/', 'var(--avatar-height)');

        // 名前の大きさ
        if (save.options['name_size'] != '') data = data.replace('/*user-name-size*/', save.options['name_size']);
        else                                 data = data.replace('/*user-name-size*/', '25px');

        // フォント
        if (save.options['name_font'] != '') data = data.replace('/*font*/', "font-family: '" + save.options['name_font'] + "', sans-serif;");

        // アイコン
        if (save.options['display_icon'] == 'on') data = data.replace('/*display-height*/', '600px');
        else {
            data = data.replace('/*display-height*/', 'calc(600px + var(--avatar-height))');
            data = data.replace('/*display_icon*/', 'display: none;');
        };

        // アウトプット
        let elm_textarea = document.getElementById('is_str_gen-css_output');
        elm_textarea.innerHTML = data;

        localStorage.setItem('amonguscss_sample_css', data);
        amongUsCss_genCss.gen_sample();
    };
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
        if (part == uri_parts.length - 1) break
        uri += uri_parts[part] + '/'
    }
    uri += 'tester/?' + query.join('&')

    // 出力
    document.getElementById('is_str_gen-test-url_output').value = uri;
    // サンプル出力
    document.getElementById('is_obj_css-sample_output').data = 'tester/?sample&' + query.join('&');

    return;
};
