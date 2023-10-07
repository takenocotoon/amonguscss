#!/usr/bin/php
<?php

$target_dir = './template';
if (isset($argv) and count($argv)>1) {
    $target_dir = $argv[1];
}
$output_dir = '../docs';
$target_name = basename($target_dir);
$iterator = new RecursiveDirectoryIterator($target_dir);
$iterator = new RecursiveIteratorIterator($iterator);

echo "target:" . $target_dir . "  output:" . $output_dir . "  target_name:" . $target_name . "\n";
echo "==========" . "\n";

$list = array();
makeDir($output_dir);

foreach ($iterator as $fileinfo) {
    $file = $fileinfo->getPathname();
    $info = new SplFileInfo($file);
    $file = str_replace('\\', '/', $file);
    $target_file = str_replace($target_dir, $target_name, $file);
    $output_file = str_replace($target_name, './docs', $file);
    
    echo "---" . "\n";
    echo "from:";
    echo $target_file;
    echo " ";
    echo "to:";
    echo $output_file;
    echo " ";
    
    echo "\n";
    
    $dir = dirname($output_file);
    if (!$fileinfo->isFile()) {
        if (strpos($file, '/parts/') === false and strpos($file, '/_') === false) {
            makeDir($dir);
        } else {
            echo "pass\n";
        }
        continue;
    }
    
    // $file = $fileinfo->getPathname();
    if (
        strpos($file, '/parts/') === false and 
        strpos($file, '/src/') === false and 
        strpos($file, '/.create/') === false and 
        strpos($file, '/_') === false and 
        strpos($file, '.dev.js') === false and 
        strpos($file, '.dev.css') === false and 
        strpos($file, 'index.min.css') === false and 
        strpos($file, 'settings.php') === false 
    ) {
        $info = new SplFileInfo($file);
        if($info->getExtension() == 'php'){
            convertHtml($file, $output_file);
        } else if ($info->getExtension() != 'map' and $info->getExtension() != 'scss') {
            echo " -> copy from:" . $file . " to:" . $output_file . "\n";
            copy($file, $output_file);
        } else {
            echo "pass\n";
        }
    } else {
        echo "pass\n";
    }
}


function convertHtml($target, $output_file){
    global $output_dir;
    $contents = '';
    
    ob_start();
    $is_prod = true;
    include($target);
    $contents = ob_get_contents();
    ob_end_clean();
    echo " -> convertHtml from:" . $target . " to:" . preg_replace('/\A(.+)\.(php?)\z/', '$1', $output_file) . "\n";
    file_put_contents(
        preg_replace('/\A(.+)\.(php?)\z/', '$1', $output_file),
        preg_replace('/\A\n/', '', $contents)
    );
}


function makeDir($dir){
    echo "makeDir...  ";
    echo $dir;
    
    if(!is_dir($dir)) {
        mkdir($dir);
        echo " OK!";
    } else {
        echo " pass";
    }
    echo "\n";
}
