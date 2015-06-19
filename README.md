# GigaTables JQuery plug-in
GigaTables is a plug-in to help web-developers process data in applications and CMS, CRM systems

## Installation
```HTML
    <script src="jquery.js"></script>
    <script src="src/js/jquery.gigatables.js"></script>
    <link href="src/css/jquery.gigatables.css" rel="stylesheet" type="text/css"/>
```

To use GigaTables editor: 

```HTML
    <script src="src/js/gigatables.editor.js"></script>
    <link href="src/css/gigatables.editor.css" rel="stylesheet" type="text/css"/>        
```

## Getting Started

To initialize plug-in and to bind GigaTables with table structure You don't need to do a lot - just call a GigaTables with options and set table structure in HTML. The <tbody> tag, it's rows and all the stuff like pagination, per page selector will be constructed automatically and only if U need this. 

### Minimal configuration 

```JS

        $('#gigatable').GigaTable({
          struct: {// all in
            search: ['top', 'bottom'],
            rowsSelector: ['asc', 'top', 'bottom'],
            pagination: ['bottom']
          },
          ajax: 'gigatables.php',
          columns: [
            {data: "id"},
            {data: "desc"},
            {data: "title"},
            {data: "date"},
            {data: "info"}
          ]
        });   

```

To turn on/off parts You can simply define this in struct, for instance to turn off pagination and rowsSelector 
do the following:

```JS
          struct: {
            search: ['top', 'bottom'],
            rowsSelector: [], // turn off selectors
            pagination: []  // turn off pagination
          },
```

### Advanced configuration with opts and editor

```JS
        $('#gigatable').GigaTable({
          struct:{ // all in
            search : ['top', 'bottom'], 
            rowsSelector: ['asc', 'top', 'bottom'], 
            pagination: ['bottom']
          },
          lang:'ru', // english default
          perPageRows: [25, 50, 100, 200, 500], // default behavior 
          defaultPerPage : 50,          
          ajax:'gigatables.php', // to return JSON structure - see example bellow 
          columns: [
            { // include all defaults
              data: "id", 
              sortable: true, // default
              visible: true, // default
              searchable: true // default
            },
            {data: "desc", sortable: false // turn off sorting},
            {data: "title"},            
            {
              data: "date", 
              searchable: false // turn off searching 
            },                    
            {
              data: "info", 
              visible: false // turn off from viewing this column content
            } 
            
          ],
          columnOpts: [ // optionally U can render any columns as U want or skip this option
            {
              render: function(data, row, type) {
                return '<div><form method="post" class="accForm" action=""><input type="hidden" name="action" value="forms" /><input type="hidden" name="id" value="' + row.id + '" /><div>' + data + '</div></form></div>';
              }, 
              target: 2
            }, 
            {
              render: function(data, row, type) {
                return '<div><form method="post" class="accForm" action=""><input type="hidden" name="action" value="forms" /><input type="hidden" name="id" value="' + row.id + '" /><div>' + data + '</div></form></div>';
              }, 
              target: 3
            }            
          ],
          tableOpts: { // this is only for additional editor plug-in which helps edit every row with any type 
            buttons: [
              {extended: "editor_create", editor: editor},
              {extended: "editor_edit", editor: editor},
              {extended: "editor_remove", editor: editor}              
            ],            
            buttonsPosition: ['top', 'bottom'], // buttons for popup editing
            theme: 'std'
          }          
        });  
```        

The table is defined like in example below:

```HTML
    <table id="gigatable">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Date</th>
          <th>Info</th>
        </tr>
      </thead>
      <tfoot>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Date</th>
          <th>Info</th>
        </tr>
    </tfoot>
  </table>
```
  
JSON structure to be return from provided url in "ajax" GigaTables option:

```JS
{
    "rows": [
        {
            "GT_RowId": 2, // optional 
            "id": 2, // if there is no GT_RowId - try to fetch "id"
            "title": "Test 2st row",
            "desc": "<input type=\"text\" name=\"ttl\" value=\"Test 2st row Test 2st row Test 2st row
 Test 2st row Test 2st row\" \/> ",
            "date": "20:40:37 17:06:2015",
            "info": "some info some info some info some info"
        },
        {
            "GT_RowId": 1,
            "id": 1,
            "title": "Test 1st row",
            "desc": "<input type=\"text\" name=\"ttl\" value=\"Test 1st row Test 1st row Test 1st row
 Test 1st row Test 1st row\" \/> ",
            "date": "20:40:38 17:06:2015",
            "info": "some info some info some info some info"
        }, ...

```
