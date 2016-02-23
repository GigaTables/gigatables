/**
 * Created by Arthur Kushman
 */

$.fn.GigaTable.Editor = function (options) {
  var that = this;
  var json = null;

  var UNDEFINED = 'undefined';
  // HTML5 form types
  var TYPE_CHECKBOX = 'checkbox',
          TYPE_SELECT = 'select',
          TYPE_RADIO = 'radio',
          TYPE_TEXT = 'text',
          TYPE_FILE = 'file',
          TYPE_TEXTAREA = 'textarea',
          TYPE_HIDDEN = 'hidden',
          TYPE_EMAIL = 'email',
          TYPE_PASSWORD = 'password',
          TYPE_COLOR = 'color',
          TYPE_DATE = 'date',
          TYPE_DATETIME = 'datetime',
          TYPE_NUMBER = 'number',
          TYPE_RANGE = 'range',
          TYPE_SEARCH = 'search',
          TYPE_TIME = 'time',
          TYPE_TEL = 'tel',
          TYPE_URL = 'url',
          TYPE_MONTH = 'month',
          TYPE_WEEK = 'week';

  var ESCAPE_KEY = 27, 
          ENTER_KEY = 13;

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
        if (e.which === ESCAPE_KEY) {
          that.hidePopUp(settings);
        }
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

      if (typeof form.find('input[file]') !== UNDEFINED) {
        // there is files - ajax upload them
        var files = [];
        var i = 0;
        form.find('input[type="file"]').on('change', function (e) {
          files[i++] = e.target.files;
        });
      }

      settings.container.find('#gte_sent_btn').click(function () {
//        console.log(that.editorSettings);
        if (typeof files !== UNDEFINED && files !== null) {
          var ajaxDest = obj.editorSettings.ajaxFiles;
          if (ajaxDest === UNDEFINED || ajaxDest === null
                  || ajaxDest === '') {
            console.error('You should secify ajaxFiles url to upload files on server.');
            return;
          }

          var data = new FormData();
          $.each(files, function (k, v) {
            $.each(v, function (key, val) {
              data.append(k, val);
            });
          });
//          console.log(data);
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

            if (typeof data['row']['GT_RowId'] !== UNDEFINED) {
              id = data['row']['GT_RowId'];
              tr += ' gte-row-id="' + id + '" ';
            } else if (typeof data['row']['GT_RowId'] !== UNDEFINED) {
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
      var field = null, fieldName = null,
              fieldType = null, fieldValue = null;

      settings.container.append(this.popup.edit);
      settings.container.append(this.popup.background);

      var popup = settings.container.find('.gte_editor_popup'),
              bg = settings.container.find('.gte_popup_background');
      var fields = this.editorSettings.fields,
              trActive = settings.tbody.find('tr.active');

      for (var k in fields) {
        fieldName = fields[k].name;
        fieldType = fields[k].type;
        field = trActive.children('td[data-name="' + fieldName + '"]');
        fieldValue = field.text().trim();
        if (field.length > 0 && fieldType !== 'file') { // file value protection avoiding "The operation is insecure" error         
          var selectors = ['select', 'checkbox', 'radio']; // making these elements selected         
          if (selectors.indexOf(fieldType) !== -1) {
            if (fieldType === 'select') {
              popup.find(fieldType + '[name="' + fieldName + '"] option[data-value="' + fieldValue.toLowerCase() + '"]').attr('selected', true);
            } else { // checkbox/radio
              popup.find('input[name="' + fieldName + '"][data-value="' + fieldValue.toLowerCase() + '"]').attr('checked', true);
            }
          } else {
            popup.find('input[name="' + fieldName + '"]').val(fieldValue);
          }
        }
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

    if (typeof settings.fields === UNDEFINED) {
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
      var fieldType = fields[k].type,
              fieldName = fields[k].name,
              fieldLabel = fields[k].label;

      var attributes = '';
      if (typeof fields[k].attrs !== UNDEFINED) {
        var fieldOpts = fields[k].attrs;
        for (var opt in fieldOpts) {
          for (var attr in fieldOpts[opt]) {
            attributes += attr + '="' + fieldOpts[opt][attr] + '"';
          }
        }
      }

      switch (fieldType) {
        case TYPE_TEXT:
        case TYPE_HIDDEN:
        case TYPE_EMAIL:
        case TYPE_PASSWORD:
        case TYPE_COLOR:
        case TYPE_DATE:
        case TYPE_DATETIME:
        case TYPE_NUMBER:
        case TYPE_RANGE:
        case TYPE_SEARCH:
        case TYPE_TIME:
        case TYPE_TEL:
        case TYPE_URL:
        case TYPE_MONTH:
        case TYPE_WEEK:
        case TYPE_FILE:
          htmlFieldsCreate += '<div class="gte_editor_fields">';
          htmlFieldsEdit += '<div class="gte_editor_fields">';
          if (fieldType !== 'hidden') {
            htmlFieldsCreate += '<label class="gte_label" for="' + fieldName + '">' + fieldLabel + '</label>';
            htmlFieldsEdit += '<label class="gte_label" for="' + fieldName + '">' + fieldLabel + '</label>';
          }
          htmlFieldsCreate += '<div class="gte_field"><input ' + attributes + ' id="' + fieldName + '" type="' + fieldType + '" name="' + fieldName + '" data-value=""/></div><div class="clear"></div></div>';
          htmlFieldsEdit += '<div class="gte_field"><input ' + attributes + ' id="' + fieldName + '" type="' + fieldType + '" name="' + fieldName + '" data-value=""/></div><div class="clear"></div></div>';
          break;
        case TYPE_TEXTAREA:
          htmlFieldsCreate += '<div class="gte_editor_fields"><label class="gte_label" for="' + fieldName + '">' + fieldLabel + '</label><div class="gte_field"><textarea ' + attributes + ' id="' + fieldName + '" name="' + fieldName + '"></textarea></div><div class="clear"></div></div>';
          htmlFieldsEdit += '<div class="gte_editor_fields"><label class="gte_label" for="' + fieldName + '">' + fieldLabel + '</label><div class="gte_field"><textarea ' + attributes + ' id="' + fieldName + '" name="' + fieldName + '"></textarea></div><div class="clear"></div></div>';
          break;
        case TYPE_SELECT:
          var values = fields[k].values;
          var options = '', val = '';
          for (var k in values) {
            for (var key in values[k]) {
              val = values[k][key].trim();
              options += '<option value="' + key + '" data-value="' + val.toLowerCase() + '">' + val + '</option>';
            }
          }
          htmlFieldsCreate += '<div class="gte_editor_fields"><label class="gte_label" for="' + fieldName + '">' + fieldLabel + '</label><div class="gte_field"><select ' + attributes + ' id="' + fieldName + '" name="' + fieldName + '">' +
                  options
                  + '</select></div><div class="clear"></div></div>';
          htmlFieldsEdit += '<div class="gte_editor_fields"><label class="gte_label" for="' + fieldName + '">' + fieldLabel + '</label><div class="gte_field"><select ' + attributes + ' id="' + fieldName + '" name="' + fieldName + '">' +
                  options
                  + '</select></div><div class="clear"></div></div>';
          break;
        case TYPE_CHECKBOX:
        case TYPE_RADIO:
          var values = fields[k].values;
          var options = '', val = '';
          for (var k in values) {
            for (var key in values[k]) {
              val = values[k][key].trim();
              options += '<label class="gte_label_text"><input ' + attributes + ' id="' + fieldName + '" type="' + fieldType + '" name="' + fieldName + '" data-value="' + val.toLowerCase() + '">' + val + '</label>';
            }
          }
          htmlFieldsCreate += '<div class="gte_editor_fields"><label class="gte_label">' + fieldLabel + '</label><div class="gte_field">' +
                  options
                  + '</div><div class="clear"></div></div>';
          htmlFieldsEdit += '<div class="gte_editor_fields"><label class="gte_label">' + fieldLabel + '</label><div class="gte_field">' +
                  options
                  + '</div><div class="clear"></div></div>';
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