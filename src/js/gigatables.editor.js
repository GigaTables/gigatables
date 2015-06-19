/**
 * Created by Arthur Kushman
 */

$.fn.GigaTable.Editor = function (options) {

  var that = this;
  var json = null;

  var obj = {
    editorSettings: {},
    popupWindow: null,
    popupBg: null,
    struct: {},
    buttons: {},
    popup: {},
    hidePopUp: function (settings) {
      var bg = settings.container.find('.gte_popup_background'),
              popup = settings.container.find('.gte_editor_popup');
      popup.animate({opacity: 0, top: "50px"}, 300);
      popup.fadeOut(300);
      bg.fadeOut(300, function () {
        bg.remove();
        popup.remove();
      });
    },
    hidePopupEvents: function (settings) {
      var that = this;
      var bg = settings.container.find('.gte_popup_background'),
              popup = settings.container.find('.gte_editor_popup');

      bg.click(function (e) {
        that.hidePopUp(settings);
      });
      $(document).keydown(function (e) {
        that.hidePopUp(settings);
      });
      popup.find('.close').click(function () {
        that.hidePopUp(settings);
      });

      settings.container.find('#gte_form input, textarea, select').keydown(function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
      });
    },
    sendAjaxEvent: function (settings, action) {
      var that = this;

      var form = settings.container.find('#gte_form');

      if (typeof form.find('input[file]') !== 'undefined') {
        // there is files - ajax upload them
        var files;
        form.find('input[type="file"]').on('change', function (e) {
          files = e.target.files;
//          console.log(files);
        });

      }

      settings.container.find('#gte_sent_btn').click(function () {
//        console.log(that.editorSettings);

        if (typeof files !== 'undefined' && files !== null) {

          var ajaxDest = obj.editorSettings.ajaxFiles;

          if (ajaxDest === 'undefined' || ajaxDest === null 
                  || ajaxDest === '') {
            console.error('You should secify ajaxFiles url to upload files on server.');
            return;
          }

          var data = new FormData();
          $.each(files, function(k, v) {
            data.append(k, v);
          });

          $.ajax({
            url: ajaxDest,
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false, 
            contentType: false
          }).done(function (data) {

          });

        }

        var serData = form.serialize();
        $.ajax({
          url: that.editorSettings.ajax,
          type: 'POST',
          data: serData,
          dataType: 'json'
        }).done(function (data) {
//          console.log(data);
          if (action === 'create') {

            var tbody = settings.container.find('tbody'),
                    columns = settings.columns; // GT columns not GTE

            var id = 0;

            var tr = '<tr ';

            if (typeof data['row']['GT_RowId'] !== 'undefined') {
              id = data['row']['GT_RowId'];
              tr += ' gte-row-id="' + id + '" ';
            } else if (typeof data['row']['GT_RowId'] !== 'undefined') {
              id = data['row']['id'];
              tr += ' gte-row-id="' + id + '" ';
            }

            tr += '>';

            for (var k in columns) {
//              console.log(fields[k].name);              
              tr += '<td>' + data['row'][columns[k].data] + '</td>';
            }

            tr += '</tr>';
            tbody.prepend(tr);

//            tbody.find('tr:first').animate({
//              backgroundColor: '#08c !important'
//            }, 1000);

          } else if (action === 'edit') {

            var tbody = settings.container.find('tbody'),
                    columns = settings.columns; // GT columns not GTE            

            var tr = tbody.find('tr.active'); // there is only 1 tr active for editor            

            var tds = '';

            for (var k in columns) {
//              console.log(fields[k].name);              
              tds += '<td>' + data['row'][columns[k].data] + '</td>';

            }

            tr.html(tds);
//            tr.animate({
//              backgroundColor:'#fff !important'
//            }, 1000);

          } else if (action === 'delete') {
            var ids = settings.container.find('#gte_form input[name^="ids"]');
            ids.each(function () {
              settings.container.find('tbody tr[gte-row-id=' + $(this).val() + ']').remove();
            });
          }
          that.hidePopUp(settings);
        });
      });
    },
    triggerPopupCreate: function (settings) {
      settings.container.append(this.popup.create);
      settings.container.append(this.popup.background);

      var popup = settings.container.find('.gte_editor_popup'),
              bg = settings.container.find('.gte_popup_background');

      popup.show();
      popup.animate({opacity: 1, top: "-20px"}, 300);
      popup.fadeIn(300);
      bg.fadeIn(300);

      this.hidePopupEvents(settings);
      this.sendAjaxEvent(settings, 'create');
    },
    triggerPopupEdit: function (settings) {
      settings.container.append(this.popup.edit);
      settings.container.append(this.popup.background);

      var popup = settings.container.find('.gte_editor_popup'),
              bg = settings.container.find('.gte_popup_background');

//      settings.tbody.find('tr.active').children().each(function() {
//        popup.find('input[name=""], textarea[name=""]').val();
//      });        

      var fields = this.editorSettings.fields,
              trActive = settings.tbody.find('tr.active');

      var field = '';
      for (var k in fields) {
        field = trActive.children('td[data-name="' + fields[k].name + '"]');
        if (field.length > 0) {
          popup.find('input[name="' + fields[k].name + '"], textarea[name="' + fields[k].name + '"]').val(field.text());
        }
//         console.log(field);
      }

      popup.show();
      popup.animate({opacity: 1, top: "-20px"}, 300);
      popup.fadeIn(300);
      bg.fadeIn(300);

      this.hidePopupEvents(settings);
      this.sendAjaxEvent(settings, 'edit');
    },
    triggerPopupDelete: function (settings) {
      settings.container.append(this.popup.delete);
      settings.container.append(this.popup.background);

      var popup = settings.container.find('.gte_editor_popup'),
              bg = settings.container.find('.gte_popup_background');

      popup.show();
      popup.animate({opacity: 1, top: "-20px"}, 300);
      popup.fadeIn(300);
      bg.fadeIn(300);

      this.hidePopupEvents(settings);
      this.sendAjaxEvent(settings, 'delete');
    }
  };

  var settings = $.extend(true, {// merge defaults with options recursivelly
    // These are the defaults.
    struct: obj.struct
//      columns: [
//      ],
//      columnOpts: [],
//      tableOpts: {
//        buttons: [
//        ],
//        theme: 'std'
//      }
  }, options);

  function setButtons(settings) {

    obj.buttons.editor_edit = '<div class="gte_button edit gte_btn_disabled"><span>gte.button.editor_edit</span></div>';
    obj.buttons.editor_create = '<div class="gte_button create"><span>gte.button.editor_create</span></div>';
    obj.buttons.editor_remove = '<div class="gte_button remove gte_btn_disabled"><span>gte.button.editor_remove</span></div>';
//      console.log(buttons);
  }

  function setPopup(settings) {

    var popupCreate = '',
            popupEdit = '',
            popupDelete = '',
            popupBackground = '';

    if (typeof settings.fields === 'undefined') {
      console.err('You should define "fields" option.');
      return;
    }

    if (typeof settings.fields.length === 0) {
      console.err('You should define at least one field in "fields" option.');
      return;
    }

    var fields = settings.fields,
            htmlFieldsCreate = '', htmlFieldsEdit = '';

    for (var k in fields) {

      var type = fields[k].type;

      switch (type) {

        case 'text':
        case 'hidden':
        case 'email':
        case 'password':
        case 'color':
        case 'date':
        case 'datetime':
        case 'number':
        case 'range':
        case 'search':
        case 'time':
        case 'tel':
        case 'url':
        case 'month':
        case 'week':
        case 'file':
          htmlFieldsCreate += '<div class="gte_editor_fields"><label class="gte_label" for="' + fields[k].name + '">' + fields[k].label + '</label><div class="gte_field"><input id="' + fields[k].name + '" type="' + type + '" name="' + fields[k].name + '" value=""/></div><div class="clear"></div></div>';

          htmlFieldsEdit += '<div class="gte_editor_fields">';
          if (type !== 'hidden') {
            htmlFieldsEdit += '<label class="gte_label" for="' + fields[k].name + '">' + fields[k].label + '</label>';
          }
          htmlFieldsEdit += '<div class="gte_field"><input id="' + fields[k].name + '" type="' + type + '" name="' + fields[k].name + '" value=""/></div><div class="clear"></div></div>';
          break;
//          htmlFieldsCreate += '<div class="gte_editor_fields"><label class="gte_label" for="' + fields[k].name + '">' + fields[k].label + '</label><div class="gte_field"><input id="' + fields[k].name + '" type="password" name="' + fields[k].name + '" value=""/></div><div class="clear"></div></div>';
//          htmlFieldsEdit += '<div class="gte_editor_fields"><label class="gte_label" for="' + fields[k].name + '">' + fields[k].label + '</label><div class="gte_field"><input id="' + fields[k].name + '" type="password" name="' + fields[k].name + '" value="gte.editor.' + fields[k].name + '"/></div><div class="clear"></div></div>';
//          break;
        case 'textarea':
          htmlFieldsCreate += '<div class="gte_editor_fields"><label class="gte_label" for="' + fields[k].name + '">' + fields[k].label + '</label><div class="gte_field"><textarea id="' + fields[k].name + '" name="' + fields[k].name + '"></textarea></div><div class="clear"></div></div>';
          htmlFieldsEdit += '<div class="gte_editor_fields"><label class="gte_label" for="' + fields[k].name + '">' + fields[k].label + '</label><div class="gte_field"><textarea id="' + fields[k].name + '" name="' + fields[k].name + '"></textarea></div><div class="clear"></div></div>';
          break;
      }

    }

    popupCreate = '<div class="gte_editor_popup"><div class="gte_popup_container"><div class="gte_popup_container_wrapper"><div class="gte_form_border_box"><div class="gte_form_fields"><div class="gte_header">' +
            '<div class="gte_editor_title">gte.editor.popupheader.create</div>' +
            '</div><div class="gte_form_body"><div class="gte_form_body_content"><form id="gte_form" action="" method="post"><div class="gte_form_content">' +
            '<div><input type="hidden" name="action" value="create"/></div>' +
            htmlFieldsCreate +
            '</div></form></div></div><div class="gte_footer"><div class="gte_form_err"></div><div class="gte_form_buttons"><button id="gte_sent_btn" class="btn">gte.editor.btn.create</button></div></div></div></div></div></div></div>';
//    console.log(popupCreate);
    popupEdit = '<div class="gte_editor_popup"><div class="gte_popup_container"><div class="gte_popup_container_wrapper"><div class="gte_form_border_box"><div class="gte_form_fields"><div class="gte_header">' +
            '<div class="gte_editor_title">gte.editor.popupheader.edit</div>' +
            '</div><div class="gte_form_body"><div class="gte_form_body_content"><form id="gte_form" action="" method="post"><div class="gte_form_content">' +
            '<div><input type="hidden" name="action" value="edit"/></div>' +
            htmlFieldsEdit +
            '</div></form></div></div><div class="gte_footer"><div class="gte_form_err"></div><div class="gte_form_buttons"><button id="gte_sent_btn" class="btn">gte.editor.btn.edit</button></div></div></div></div></div></div></div>';

    popupDelete = '<div class="gte_editor_popup"><div class="gte_popup_container"><div class="gte_popup_container_wrapper"><div class="gte_form_border_box"><div class="gte_form_fields"><div class="gte_header">' +
            '<div class="gte_editor_title">gte.editor.popupheader.delete</div>' +
            '</div><div class="gte_form_body"><div class="gte_form_body_content"><form id="gte_form" action="" method="post"><div class="gte_form_content">' +
            '<div><input type="hidden" name="action" value="delete"/></div>' +
            '<div id="gte_ids"></div>' +
            '<div id="gte_msg"></div>' +
            '</div></form></div></div><div class="gte_footer"><div class="gte_form_err"></div><div class="gte_form_buttons"><button id="gte_sent_btn" class="btn">gte.editor.btn.delete</button></div></div></div></div></div></div></div>';

    popupBackground = '<div class="gte_popup_background"></div>';

    obj.popup.create = popupCreate;
    obj.popup.edit = popupEdit;
    obj.popup.delete = popupDelete;
    obj.popup.background = popupBackground;

  }

  obj.editorSettings = settings;

  setButtons(settings);
  setPopup(settings);

  return obj;
};