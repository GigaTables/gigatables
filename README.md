# GigaTables JQuery plug-in
GigaTables is a plug-in to help web-developers process data in applications and CMS, CRM, ERP or similar systems. 
Unlike other JQuery-based tables (which earn money from CRUD operations) it is under MIT license - totally free

### Supported package managers

- npm install gigatables
- bower install gigatables (--allow-root, for sudo)
- composer require gt/gigatables

## Fiew screen-shots

### Multiple select with Ctrl and Shift
![alt tag](https://raw.githubusercontent.com/GigaTables/gigatables/master/GigaTables_basic_view.png)

### CRUD pop-ups
![alt tag](https://raw.githubusercontent.com/GigaTables/gigatables/master/GigaTables_edit_item.png)

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
            {data: "types"},
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
          tableOpts: { // this is only for editor plug-in which helps edit every row with any type 
            buttons: [ // additionally U may want put some trigger function before/after popup creation ex.: to set autocomplete on field etc
              {extended: "editor_create", editor: editor, triggerAfter:(function() {
                console.log('after create');
              }), triggerBefore:(function() {
                console.log('before create');
              })},
              {extended: "editor_edit", editor: editor},
              {extended: "editor_remove", editor: editor, triggerAfter:(function() {
                console.log('after del');
              })}             
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
          <th>Types</th>
          <th>Info</th>
        </tr>
      </thead>
      <tfoot>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Date</th>
          <th>Types</th>
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

## An example of using GigaTables with Editor tool

First of all You should define a class Editor like this:

```JS
        var editor = new $.fn.GigaTable.Editor({
          ajax: 'editor.php',
          ajaxFiles: 'uploadFiles.php',
          struct: {
            buttons: ['top', 'bottom'] // buttons
          },
          fields: [
            {
              label: "ID",
              name: "id",
              type: 'hidden'
            },                    
            {
              label: "Article title:",
              name: "title",
              type: 'text' // default, other: password, file, select, multiselect etc
            },
            {
              label: "Description:",
              name: "desc",
              type: 'textarea'
            },
            {
              label: "Date Time:",
              name: "date",
              type: 'date'
            },
            { // an example of using select - automatically selected if matches with data in table column
              label: "Types:",
              name: "types", 
              values: [ // if select,checkbox,radio etc types - need this kinda structure of value
                  {'key1':'val1'}, 
                  {'key2':'val2'}
              ],            
              type: 'select', // select,checkbox,radio
              attrs: [
                {'multiple':true}
              ]
            },
            {
              label: "Image:",
              name: "image",
              type: 'file'
            }
          ]

        });
```        

and then pass variable (in this case - editor) to GigaTables main options in tableOpts section like this:
```JS
          tableOpts: {
            buttons: [
              {extended: "editor_create", editor: editor},
              {extended: "editor_edit", editor: editor},
              {extended: "editor_remove", editor: editor}
            ],
            buttonsPosition: ['top', 'bottom'],
            theme: 'std'
          }
```

That's it then You will be able to CRUD any record You want :-)

## FAQ

**Can I use file types in GT editor to upload files through AJAX on server?**

Sure, it can be done by this additional option in editor:

```JS
ajaxFiles: 'uploadFiles.php',
```

wich is point on script on the server where it should upload the file(s).

And to add the actual field which will send the file to the server script: 
```JS
            {
              label: "Image:",
              name: "image",
              type: 'file'
            }
```
Ensure that the field is in *fields: [* option.

**What types of fields can be used in editor?**

Any, really - You can use any HTML5 types, they are already embedded, but responsibility of supported ones (in different Browsers) 
is on Your side.

**Can I choose more then one row?**

Yes, U can even choose not only the bunch of rows, but several bunches and some between them, by manipulating with: 
Ctrl+Left click (one row anywhere) and Shift+Left click (several rows).

**Can I sort columns content?**

Defenitelly, also it is simple enough to sort them jointly.

**What does search field mean?**

The main search field above (which is the default state, U can make it visible in the bottom) is useful for searching through all columns.

**Is it possible to search for a particular column in GT?**

Yes it is, U can specify any column U wanted to search by setting these options in *columns* parts eg.: 

```JS
          columns: [
            {// include all defaults
              data: "id",
              discreteSearch: true, 
              discreteSearchValue: function(title) {
                return 'Search on the field - ' + title;
              }              
            }
```

additionally U may want to set a custom placeholder - it is possible via *discreteSearchValue* option.

**Is there languages support?**

Sure, You can pick one of 7 languages: English, German, Russian, French, Spanish, Chinese, Hindi - en, gr, ru, fr, es, ch, hi respectively.   

**Does GT have any event-triggered functions, ex.: to run something before/after pop-up?**

GigaTables plug-in has 2 types of triggers **triggerBefore** and **triggerAfter** which can be applied to any action button - Create, Edit or Delete.
