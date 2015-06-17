# GigaTables JQuery plug-in
GigaTables is a plug-in to help web-developers process data in applications and CMS, CRM systems

## Installation
```
    <script src="jquery.js"></script>
    <script src="src/js/jquery.gigatables.js"></script>
    <link href="src/css/jquery.gigatables.css" rel="stylesheet" type="text/css"/>
```
## Getting Started

To initialize plug-in and to bind GigaTables with table structure You don't need to do a lot - just call a GigaTables with options and set table structure in HTML. The <tbody> tag, it's rows and all the stuff like pagination, per page selector will be constructed automatically and only if U need this. 

```
        $('#gigatable').GigaTable({
          struct:{ // all in
            search : ['top', 'bottom'], 
            rowsSelector: ['asc', 'top', 'bottom'], 
            pagination: ['bottom']
          },
          lang:'ru', // english default
          perPageRows: [25, 50, 100, 200, 500],
          defaultPerPage : 50,          
          ajax:'gigatables.php', 
          columns: [
            { // include all defaults
              data: "id", 
              sortable: true,
              visible: true, 
              searchable: true
            },
            {data: "desc", sortable: false},
            {data: "title"},            
            {
              data: "date", 
              searchable: false
            },                    
            {
              data: "info", 
              visible: false
            } 
            
          ],
          columnOpts: [
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
          tableOpts: {
            buttons: [
              {extended: "editor_create", editor: editor},
              {extended: "editor_edit", editor: editor},
              {extended: "editor_remove", editor: editor}              
            ],            
            buttonsPosition: ['top', 'bottom'], 
            theme: 'std'
          }          
        });  
```        

The table is defined like in example below:

```
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
  
