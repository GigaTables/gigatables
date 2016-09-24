<?php

/**
 * Create by Arthur Kushman
 */

if (isset($_POST['action'])) {
  
  $params = filter_var_array($_POST);
  
  if ($_POST['action'] === 'create') {
    
    $data['row'] = [
        'GT_RowId' => 12314,
        'id' => 12314,
        'title' => $params['title'], 
        'desc' => $params['desc'], 
        'date' => $params['date'], 
            ];
    
  }

  if ($_POST['action'] === 'edit') {
    
    $data['row'] = [
        'GT_RowId' => 1,
        'id' => 1,
        'title' => $params['title'], 
        'desc' => $params['desc'], 
        'date' => $params['date'], 
            ];
    
  }  

  if ($_POST['action'] === 'delete') {
    
    $data['row'] = $_POST;
    
  }    
  
  echo json_encode($data, JSON_PRETTY_PRINT | JSON_NUMERIC_CHECK | JSON_UNESCAPED_UNICODE);
  
}