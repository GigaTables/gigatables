<?php

/**
 * Create by Arthur Kushman
 */
date_default_timezone_set('Europe/Moscow');

/* $arr['rows'] = [[
  //    'GT_id' => 1, // not required - tries to find id then
  'id' => 1,
  'title' => 'Test 1st row',
  //    'title_en' => 'Test 1st row',
  'description' => 'Test 1st row Test 1st row Test 1st row Test 1st row Test 1st row',
  'date' => date('H:i:s d:m:Y')
  ],
  [
  //    'GT_id' => 1, // not required - tries to find id then
  'id' => 2,
  'title' => 'Test 2st row',
  'description' => 'Test 2st row Test 2st row Test 2st row Test 2st row Test 2st row',
  'date' => date('H:i:s d:m:Y')
  ]]; */

for ($i = 1; $i < 111;  ++$i) {

    $arr['rows'][] = [
        'GT_RowId' => $i,        
        'title' => 'Test ' . $i . 'st row',
        'id' => $i,
//    'title_en' => 'Test 1st row', 
        'desc' => 'Lorem Ipsum is simply dummy ' . mt_rand(1, 9999) . ' text of the printing and typesetting',
//    'desc' => '<input type="text" name="ttl" value="Test '.$i.'st row Test '.$i.'st row Test '.$i.'st row Test '.$i.'st row Test '.$i.'st row" /> ', 
        'info' => 'some info some info some info some info',
        'date' => date('H:i:s d:m:Y', time() - $i)
    ];
}

shuffle($arr['rows']);

echo json_encode($arr, JSON_PRETTY_PRINT | JSON_NUMERIC_CHECK | JSON_UNESCAPED_UNICODE);
