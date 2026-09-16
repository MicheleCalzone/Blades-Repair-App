jQuery(document).ready(function ($) {

  // Blade A
  // Instantiates the variable that holds the media library frame.
  var meta_image_frame;

  // Runs when the image button is clicked.
  // Aggiungo l'immagine della pala ma a noi è statica
  $('body').on('click', '[id*=meta-image-button]', function (e) {

    e.preventDefault();

    // Sets up the media library frame
    meta_image_frame = wp.media.frames.meta_image_frame = wp.media({
      title: meta_image.title,
      button: {text: meta_image.button},
      library: {type: 'image'},
      multiple: true
    });

    // Runs when an image is selected.
    meta_image_frame.on('select', function () {
      // Grabs the attachment selection and creates a JSON representation of the model.
      var media_attachment = meta_image_frame.state().get('selection').first().toJSON();
      // Sends the attachment URL to our custom image input field.


      $('.svl-image-wrap').addClass('has-image');
      $('#maps_images').val(media_attachment.url);
      if ($('#body_drag .images_wrap img').length > 0) {
        $('#body_drag .images_wrap img').attr('src', media_attachment.url);
      } else {
        $('#body_drag .images_wrap').html('<img src="' + media_attachment.url + '">');
      }

    });
    // Opens the media library frame.
    meta_image_frame.open();
  });

  // Aggiungo la foto del danno 1
  $('body').on('click', '.button-upload', function (e) {
    // Prevents the default action from occuring.
    e.preventDefault();
    var thisUpload = $(this).parents('.svl-upload-image');
    // Sets up the media library frame
    meta_image_frame = wp.media.frames.meta_image_frame = wp.media({
      title: meta_image.title,
      button: {text: meta_image.button},
      library: {type: 'image'},
      multiple: 'add',
    });
    // Runs when an image is selected.
    meta_image_frame.on('select', function () {
      // Grabs the attachment selection and creates a JSON representation of the model.
      var media_attachment = meta_image_frame.state().get('selection').first().toJSON();
      // Sends the attachment URL to our custom image input field.
      thisUpload.addClass('has-image');
      thisUpload.find('input[type="hidden"]').val(media_attachment.url);
      thisUpload.find('img.image_view').attr('src', media_attachment.url);
      calc_custom_position();
    });
    // Opens the media library frame.
    meta_image_frame.open();
  });

  // Aggiungo la foto del danno 2
  $('body').on('click', '.button-upload_2', function (e) {
    // Prevents the default action from occuring.
    e.preventDefault();
    var thisUpload = $(this).parents('.svl-upload-image');
    // Sets up the media library frame
    meta_image_frame = wp.media.frames.meta_image_frame = wp.media({
      title: meta_image.title,
      button: {text: meta_image.button},
      library: {type: 'image'},
      multiple: 'add',
    });
    // Runs when an image is selected.
    meta_image_frame.on('select', function () {
      // Grabs the attachment selection and creates a JSON representation of the model.
      var media_attachment = meta_image_frame.state().get('selection').first().toJSON();
      // Sends the attachment URL to our custom image input field.
      thisUpload.addClass('has-image');
      thisUpload.find('input[type="hidden"]').val(media_attachment.url);
      thisUpload.find('img.image_view').attr('src', media_attachment.url);
      calc_custom_position();
    });
    // Opens the media library frame.
    meta_image_frame.open();
  });

  // Aggiungo la foto del danno 3
  $('body').on('click', '.button-upload_3', function (e) {
    // Prevents the default action from occuring.
    e.preventDefault();
    var thisUpload = $(this).parents('.svl-upload-image');
    // Sets up the media library frame
    meta_image_frame = wp.media.frames.meta_image_frame = wp.media({
      title: meta_image.title,
      button: {text: meta_image.button},
      library: {type: 'image'},
      multiple: 'add',
    });
    // Runs when an image is selected.
    meta_image_frame.on('select', function () {
      // Grabs the attachment selection and creates a JSON representation of the model.
      var media_attachment = meta_image_frame.state().get('selection').first().toJSON();
      // Sends the attachment URL to our custom image input field.
      thisUpload.addClass('has-image');
      thisUpload.find('input[type="hidden"]').val(media_attachment.url);
      thisUpload.find('img.image_view').attr('src', media_attachment.url);
      calc_custom_position();
    });
    // Opens the media library frame.
    meta_image_frame.open();
  });

  // Aggiungo la foto del danno 4
  $('body').on('click', '.button-upload_4', function (e) {
    // Prevents the default action from occuring.
    e.preventDefault();
    var thisUpload = $(this).parents('.svl-upload-image');
    // Sets up the media library frame
    meta_image_frame = wp.media.frames.meta_image_frame = wp.media({
      title: meta_image.title,
      button: {text: meta_image.button},
      library: {type: 'image'},
      multiple: 'add',
    });
    // Runs when an image is selected.
    meta_image_frame.on('select', function () {
      // Grabs the attachment selection and creates a JSON representation of the model.
      var media_attachment = meta_image_frame.state().get('selection').first().toJSON();
      // Sends the attachment URL to our custom image input field.
      thisUpload.addClass('has-image');
      thisUpload.find('input[type="hidden"]').val(media_attachment.url);
      thisUpload.find('img.image_view').attr('src', media_attachment.url);
      calc_custom_position();
    });
    // Opens the media library frame.
    meta_image_frame.open();
  });

  // Aggiungo la foto del danno 5
  $('body').on('click', '.button-upload_5', function (e) {
    // Prevents the default action from occuring.
    e.preventDefault();
    var thisUpload = $(this).parents('.svl-upload-image');
    // Sets up the media library frame
    meta_image_frame = wp.media.frames.meta_image_frame = wp.media({
      title: meta_image.title,
      button: {text: meta_image.button},
      library: {type: 'image'},
      multiple: 'add',
    });
    // Runs when an image is selected.
    meta_image_frame.on('select', function () {
      // Grabs the attachment selection and creates a JSON representation of the model.
      var media_attachment = meta_image_frame.state().get('selection').first().toJSON();
      // Sends the attachment URL to our custom image input field.
      thisUpload.addClass('has-image');
      thisUpload.find('input[type="hidden"]').val(media_attachment.url);
      thisUpload.find('img.image_view').attr('src', media_attachment.url);
      calc_custom_position();
    });
    // Opens the media library frame.
    meta_image_frame.open();
  });



  // draggable
  function doDraggable() {
    $('.drag_element').draggable({
      containment: '#body_drag',
      drag: function (event, ui) {
        /*coordinates(event, ui, '#body_drag');*/
      },
      stop: function (event, ui) {
        var thisPoint = ui.helper[0].id;
        var dataPoint = $('#' + thisPoint).attr('data-points');
        var element = $('#body_drag');
        var left = ui.position.left,
          top = ui.position.top;
        var wWrap = element.width(),
          hWrap = element.height();
        var topPosition = ((top / hWrap) * 100).toFixed(2),
          leftPosition = ((left / wWrap) * 100).toFixed(2);

        $('.all_points #info_draggable' + dataPoint + ' input[name="pointdata[top][]"]').val(topPosition);
        $('.all_points #info_draggable' + dataPoint + ' input[name="pointdata[left][]"]').val(leftPosition);

      }
    });
  }

  doDraggable();

  // aggiungo un pins del danno
  $('.add_point').click(function () {
    if (!$('input.pins_image').val()) {
      alert('Add pins image then add point.');
      return false;
    }
    var pins_image_view = $('.pins_image').val();
    var countPoint = parseInt($('.wrap_svl .drag_element').last().attr('data-points'));
    var nonceForm = $('#maps_points_meta_box_nonce').val();
    if (!countPoint) countPoint = 0;
    countPoint = countPoint + 1;
    var fullId = 'point_content' + countPoint;
    $.ajax({
      type: "post",
      dataType: "json",
      url: meta_image.ajaxurl,
      data: {
        action: "devvn_ihotspot_clone_point",
        countpoint: countPoint,
        img_pins: pins_image_view,
        nonce: nonceForm
      },
      context: this,
      beforeSend: function () {
        $(this).parent().addClass('adding_point');
      },
      success: function (response) {
        if (response.success === true) {
          var data = response.data;
          $('.wrap_svl').append(data.point_pins);
          $('.all_points').append(data.point_data);


          /* this is need for the tabs to work
          source https://github.com/ccbgs/load_editor
          */
          quicktags({id: fullId});
          tinymce.init({
            selector: "#" + fullId,
            content_css: meta_image.editor_style,
            min_height: 200,
            textarea_name: "pointdata[content][]",
            relative_urls: false,
            remove_script_host: false,
            convert_urls: false,
            browser_spellcheck: false,
            fix_list_elements: true,
            entities: "38,amp,60,lt,62,gt",
            entity_encoding: "raw",
            keep_styles: false,
            //paste_webkit_styles:"font-weight font-style color",
            //preview_styles:"font-family font-size font-weight font-style text-decoration text-transform",
            wpeditimage_disable_captions: false,
            wpeditimage_html5_captions: true,
            plugins: "charmap,hr,media,paste,tabfocus,textcolor,wordpress,wpeditimage,wpgallery,wplink,wpdialogs,wpview",
            resize: "vertical",
            menubar: false,
            wpautop: true,
            indent: false,
            toolbar1: "bold,italic,strikethrough,bullist,numlist,blockquote,hr,alignleft,aligncenter,alignright,link,unlink,wp_more,spellchecker,wp_adv",
            toolbar2: "formatselect,underline,alignjustify,forecolor,pastetext,removeformat,charmap,outdent,indent,undo,redo,wp_help",
            toolbar3: "",
            toolbar4: "",
            tabfocus_elements: ":prev,:next",
          });

          // this is needed for the editor to initiate
          tinyMCE.execCommand('mceFocus', false, fullId);
          tinyMCE.execCommand('mceRemoveEditor', false, fullId);
          tinyMCE.execCommand('mceAddEditor', false, fullId);

          doDraggable();
          calc_custom_position();
          $(this).parent().removeClass('adding_point');
        } else {
          alert("Try again!");
        }
      }
    });
    return false;
  });

  // cancello il pins del danno
  $('body').on('click', '.button_delete', function () {
    var idDiv = $(this).parents('.list_points').attr('data-points');
    $('[data-popup="info_draggable' + idDiv + '"]').fadeOut(350, function () {
      $('#info_draggable' + idDiv).remove();
      $('#draggable' + idDiv).remove();
    });
    return false;
  });

  // cancello l'immagine del danno
  $('body').on('click', '.svl-delete-image', function () {
    var parentDiv = $(this).parents('.svl-upload-image');
    parentDiv.removeClass('has-image');
    parentDiv.find('input[type="hidden"]').val('');
    return false;
  });


  function cacl_position($position = 'center_center', $is_hover = false, $return = 'top') {
    var $r_top = 0;
    var $r_left = 0;
    if ($is_hover) {
      var $width = $('.pins_img_hover').width(),
        $height = $('.pins_img_hover').height(),
        $custom_top = $('input[name="custom_hover_top"]').val(),
        $custom_left = $('input[name="custom_hover_left"]').val();
    } else {
      var $width = $('.pins_img').width(),
        $height = $('.pins_img').height(),
        $custom_top = $('input[name="custom_top"]').val(),
        $custom_left = $('input[name="custom_left"]').val();
    }
    switch ($position) {
      case 'center_center':
        $r_top = $height / 2;
        $r_left = $width / 2;
        break;
      case 'top_center':
        $r_top = 0;
        $r_left = $width / 2;
        break;
      case 'top_right':
        $r_top = 0;
        $r_left = $width;
        break;
      case 'top_left':
        $r_top = 0;
        $r_left = 0;
        break;
      case 'right_center':
        $r_top = $height / 2;
        $r_left = $width;
        break;
      case 'bottom_center':
        $r_top = $height;
        $r_left = $width / 2;
        break;
      case 'bottom_right':
        $r_top = $height;
        $r_left = $width;
        break;
      case 'bottom_left':
        $r_top = $height;
        $r_left = 0;
        break;
      case 'left_center':
        $r_top = $height / 2;
        $r_left = 0;
        break;
      case 'custom_center':
        $r_top = $custom_top;
        $r_left = $custom_left;
        break;
      default:
        $r_top = $height / 2;
        $r_left = $width / 2;
        break;
    }
    if ($return == 'top') {
      return $r_top;
    } else {
      return $r_left;
    }
  }

  function point_position($position = 'center_center') {
    $('input[name="custom_top"]').val(cacl_position($position, false, 'top')),
      $('input[name="custom_left"]').val(cacl_position($position, false, 'left'));
    $('input[name="custom_hover_top"]').val(cacl_position($position, true, 'top')),
      $('input[name="custom_hover_left"]').val(cacl_position($position, true, 'left'));
    $('.point_style img').each(function () {
      $(this).css({
        'top': '-' + cacl_position($position, false, 'top') + 'px',
        'left': '-' + cacl_position($position, false, 'left') + 'px'
      });
    });
  }

  calc_custom_position();

  function calc_custom_position() {
    var typeVal = $('input[name="choose_type"]:checked').val();
    point_position(typeVal);
  }

  $('input[name="choose_type"]').change(function () {
    var thisVal = $('input[name="choose_type"]:checked').val();
    point_position(thisVal);
    return false;
  });
  $('input[name="custom_top"],input[name="custom_left"]').on('change', function () {
    var thisVal = $('input[name="choose_type"]:checked').val();
    if (thisVal == 'custom_center')
      point_position(thisVal);
    return false;
  });


  // Blade B

  // Aggiungo la foto del danno
  $('body').on('click', '.button-upload_b', function (e) {
    // Prevents the default action from occuring.
    e.preventDefault();
    var thisUpload = $(this).parents('.svl-upload-image_b');
    // Sets up the media library frame
    meta_image_frame = wp.media.frames.meta_image_frame = wp.media({
      title: meta_image.title,
      button: {text: meta_image.button},
      library: {type: 'image'},
      multiple: true
    });
    // Runs when an image is selected.
    meta_image_frame.on('select', function () {
      // Grabs the attachment selection and creates a JSON representation of the model.
      var media_attachment = meta_image_frame.state().get('selection').first().toJSON();
      // Sends the attachment URL to our custom image input field.
      thisUpload.addClass('has-image');
      thisUpload.find('input[type="hidden"]').val(media_attachment.url);
      thisUpload.find('img.image_view_b').attr('src', media_attachment.url);
      calc_custom_position_b();
    });
    // Opens the media library frame.
    meta_image_frame.open();
  });

  // Aggiungo la foto del danno 2
  $('body').on('click', '.button-upload_2_b', function (e) {
    // Prevents the default action from occuring.
    e.preventDefault();
    var thisUpload = $(this).parents('.svl-upload-image_b');
    // Sets up the media library frame
    meta_image_frame = wp.media.frames.meta_image_frame = wp.media({
      title: meta_image.title,
      button: {text: meta_image.button},
      library: {type: 'image'},
      multiple: true
    });
    // Runs when an image is selected.
    meta_image_frame.on('select', function () {
      // Grabs the attachment selection and creates a JSON representation of the model.
      var media_attachment = meta_image_frame.state().get('selection').first().toJSON();
      // Sends the attachment URL to our custom image input field.
      thisUpload.addClass('has-image');
      thisUpload.find('input[type="hidden"]').val(media_attachment.url);
      thisUpload.find('img.image_view_b').attr('src', media_attachment.url);
      calc_custom_position_b();
    });
    // Opens the media library frame.
    meta_image_frame.open();
  });

  // Aggiungo la foto del danno 3
  $('body').on('click', '.button-upload_3_b', function (e) {
    // Prevents the default action from occuring.
    e.preventDefault();
    var thisUpload = $(this).parents('.svl-upload-image_b');
    // Sets up the media library frame
    meta_image_frame = wp.media.frames.meta_image_frame = wp.media({
      title: meta_image.title,
      button: {text: meta_image.button},
      library: {type: 'image'},
      multiple: true
    });
    // Runs when an image is selected.
    meta_image_frame.on('select', function () {
      // Grabs the attachment selection and creates a JSON representation of the model.
      var media_attachment = meta_image_frame.state().get('selection').first().toJSON();
      // Sends the attachment URL to our custom image input field.
      thisUpload.addClass('has-image');
      thisUpload.find('input[type="hidden"]').val(media_attachment.url);
      thisUpload.find('img.image_view_b').attr('src', media_attachment.url);
      calc_custom_position_b();
    });
    // Opens the media library frame.
    meta_image_frame.open();
  });

  // Aggiungo la foto del danno 4
  $('body').on('click', '.button-upload_4_b', function (e) {
    // Prevents the default action from occuring.
    e.preventDefault();
    var thisUpload = $(this).parents('.svl-upload-image_b');
    // Sets up the media library frame
    meta_image_frame = wp.media.frames.meta_image_frame = wp.media({
      title: meta_image.title,
      button: {text: meta_image.button},
      library: {type: 'image'},
      multiple: true
    });
    // Runs when an image is selected.
    meta_image_frame.on('select', function () {
      // Grabs the attachment selection and creates a JSON representation of the model.
      var media_attachment = meta_image_frame.state().get('selection').first().toJSON();
      // Sends the attachment URL to our custom image input field.
      thisUpload.addClass('has-image');
      thisUpload.find('input[type="hidden"]').val(media_attachment.url);
      thisUpload.find('img.image_view_b').attr('src', media_attachment.url);
      calc_custom_position_b();
    });
    // Opens the media library frame.
    meta_image_frame.open();
  });

  // Aggiungo la foto del danno 5
  $('body').on('click', '.button-upload_5_b', function (e) {
    // Prevents the default action from occuring.
    e.preventDefault();
    var thisUpload = $(this).parents('.svl-upload-image_b');
    // Sets up the media library frame
    meta_image_frame = wp.media.frames.meta_image_frame = wp.media({
      title: meta_image.title,
      button: {text: meta_image.button},
      library: {type: 'image'},
      multiple: true
    });
    // Runs when an image is selected.
    meta_image_frame.on('select', function () {
      // Grabs the attachment selection and creates a JSON representation of the model.
      var media_attachment = meta_image_frame.state().get('selection').first().toJSON();
      // Sends the attachment URL to our custom image input field.
      thisUpload.addClass('has-image');
      thisUpload.find('input[type="hidden"]').val(media_attachment.url);
      thisUpload.find('img.image_view_b').attr('src', media_attachment.url);
      calc_custom_position_b();
    });
    // Opens the media library frame.
    meta_image_frame.open();
  });

  // draggable
  function doDraggable_b() {
    $('.drag_element_b').draggable({
      containment: '#body_drag_b',
      drag: function (event, ui) {
        /*coordinates(event, ui, '#body_drag');*/
      },
      stop: function (event, ui) {
        var thisPoint = ui.helper[0].id;
        var dataPoint = $('#' + thisPoint).attr('data-points');
        var element = $('#body_drag_b');
        var left = ui.position.left,
          top = ui.position.top;
        var wWrap = element.width(),
          hWrap = element.height();
        var topPosition = ((top / hWrap) * 100).toFixed(2),
          leftPosition = ((left / wWrap) * 100).toFixed(2);

        $('.all_points_b #info_draggable_b' + dataPoint + ' input[name="pointdata_b[top_b][]"]').val(topPosition);
        $('.all_points_b #info_draggable_b' + dataPoint + ' input[name="pointdata_b[left_b][]"]').val(leftPosition);

      }
    });
  }
  doDraggable_b();

  // aggiungo un pins del danno
  $('.add_point_b').click(function () {
    if (!$('input.pins_image_b').val()) {
      alert('Add pins image then add point.');
      return false;
    }
    var pins_image_view = $('.pins_image_b').val();
    var countPoint = parseInt($('.wrap_svl_b .drag_element_b').last().attr('data-points'));
    var nonceForm = $('#maps_points_meta_box_nonce_b').val();
    if (!countPoint) countPoint = 0;
    countPoint = countPoint + 1;
    var fullId = 'point_content_b' + countPoint;
    $.ajax({
      type: "post",
      dataType: "json",
      url: meta_image.ajaxurl,
      data: {
        action: "devvn_ihotspot_clone_point_b",
        countpoint_b: countPoint,
        img_pins_b: pins_image_view,
        nonce: nonceForm
      },
      context: this,
      beforeSend: function () {
        $(this).parent().addClass('adding_point');
      },
      success: function (response) {
        if (response.success === true) {
          var data = response.data;
          $('.wrap_svl_b').append(data.point_pins_b);
          $('.all_points_b').append(data.point_data_b);


          /* this is need for the tabs to work
          source https://github.com/ccbgs/load_editor
          */
          quicktags({id: fullId});
          tinymce.init({
            selector: "#" + fullId,
            content_css: meta_image.editor_style,
            min_height: 200,
            textarea_name: "pointdata_b[content_b][]",
            relative_urls: false,
            remove_script_host: false,
            convert_urls: false,
            browser_spellcheck: false,
            fix_list_elements: true,
            entities: "38,amp,60,lt,62,gt",
            entity_encoding: "raw",
            keep_styles: false,
            //paste_webkit_styles:"font-weight font-style color",
            //preview_styles:"font-family font-size font-weight font-style text-decoration text-transform",
            wpeditimage_disable_captions: false,
            wpeditimage_html5_captions: true,
            plugins: "charmap,hr,media,paste,tabfocus,textcolor,wordpress,wpeditimage,wpgallery,wplink,wpdialogs,wpview",
            resize: "vertical",
            menubar: false,
            wpautop: true,
            indent: false,
            toolbar1: "bold,italic,strikethrough,bullist,numlist,blockquote,hr,alignleft,aligncenter,alignright,link,unlink,wp_more,spellchecker,wp_adv",
            toolbar2: "formatselect,underline,alignjustify,forecolor,pastetext,removeformat,charmap,outdent,indent,undo,redo,wp_help",
            toolbar3: "",
            toolbar4: "",
            tabfocus_elements: ":prev,:next",
          });

          // this is needed for the editor to initiate
          tinyMCE.execCommand('mceFocus', false, fullId);
          tinyMCE.execCommand('mceRemoveEditor', false, fullId);
          tinyMCE.execCommand('mceAddEditor', false, fullId);

          doDraggable_b();
          calc_custom_position_b();
          $(this).parent().removeClass('adding_point');
        } else {
          alert("Try again!");
        }
      }
    });
    return false;
  });

  // cancello il pins del danno
  $('body').on('click', '.button_delete_b', function () {
    var idDiv = $(this).parents('.list_points_b').attr('data-points');
    $('[data-popup="info_draggable_b' + idDiv + '"]').fadeOut(350, function () {
      $('#info_draggable_b' + idDiv).remove();
      $('#draggable_b' + idDiv).remove();
    });
    return false;
  });

  // cancello l'immagine del danno
  $('body').on('click', '.svl-delete-image_b', function () {
    var parentDiv = $(this).parents('.svl-upload-image_b');
    parentDiv.removeClass('has-image');
    parentDiv.find('input[type="hidden"]').val('');
    return false;
  });


  function cacl_position_b($position = 'center_center_b', $is_hover = false, $return = 'top_b') {
    var $r_top = 0;
    var $r_left = 0;
    if ($is_hover) {
      var $width = $('.pins_img_hover_b').width(),
        $height = $('.pins_img_hover_b').height(),
        $custom_top = $('input[name="custom_hover_top_b"]').val(),
        $custom_left = $('input[name="custom_hover_left_b"]').val();
    } else {
      var $width = $('.pins_img_b').width(),
        $height = $('.pins_img_b').height(),
        $custom_top = $('input[name="custom_top_b"]').val(),
        $custom_left = $('input[name="custom_left_b"]').val();
    }
    switch ($position) {
      case 'center_center_b':
        $r_top = $height / 2;
        $r_left = $width / 2;
        break;
      case 'top_center_b':
        $r_top = 0;
        $r_left = $width / 2;
        break;
      case 'top_right_b':
        $r_top = 0;
        $r_left = $width;
        break;
      case 'top_left_b':
        $r_top = 0;
        $r_left = 0;
        break;
      case 'right_center_b':
        $r_top = $height / 2;
        $r_left = $width;
        break;
      case 'bottom_center_b':
        $r_top = $height;
        $r_left = $width / 2;
        break;
      case 'bottom_right_b':
        $r_top = $height;
        $r_left = $width;
        break;
      case 'bottom_left_b':
        $r_top = $height;
        $r_left = 0;
        break;
      case 'left_center_b':
        $r_top = $height / 2;
        $r_left = 0;
        break;
      case 'custom_center_b':
        $r_top = $custom_top;
        $r_left = $custom_left;
        break;
      default:
        $r_top = $height / 2;
        $r_left = $width / 2;
        break;
    }
    if ($return == 'top_b') {
      return $r_top;
    } else {
      return $r_left;
    }
  }

  function point_position_b($position = 'center_center_b') {
    $('input[name="custom_top_b"]').val(cacl_position_b($position, false, 'top')),
      $('input[name="custom_left_b"]').val(cacl_position_b($position, false, 'left'));
    $('input[name="custom_hover_top_b"]').val(cacl_position_b($position, true, 'top')),
      $('input[name="custom_hover_left_b"]').val(cacl_position_b($position, true, 'left'));
    $('.point_style_b img').each(function () {
      $(this).css({
        'top': '-' + cacl_position_b($position, false, 'top') + 'px',
        'left': '-' + cacl_position_b($position, false, 'left') + 'px'
      });
    });
  }

  calc_custom_position_b();

  function calc_custom_position_b() {
    var typeVal = $('input[name="choose_type_b"]:checked').val();
    point_position_b(typeVal);
  }

  $('input[name="choose_type_b"]').change(function () {
    var thisVal = $('input[name="choose_type_b"]:checked').val();
    point_position_b(thisVal);
    return false;
  });
  $('input[name="custom_top_b"],input[name="custom_left_b"]').on('change', function () {
    var thisVal = $('input[name="choose_type_b"]:checked').val();
    if (thisVal == 'custom_center_b')
      point_position_b(thisVal);
    return false;
  });





  // Blade C

  // Aggiungo la foto del danno
  $('body').on('click', '.button-upload_c', function (e) {
    // Prevents the default action from occuring.
    e.preventDefault();
    var thisUpload = $(this).parents('.svl-upload-image_c');
    // Sets up the media library frame
    meta_image_frame = wp.media.frames.meta_image_frame = wp.media({
      title: meta_image.title,
      button: {text: meta_image.button},
      library: {type: 'image'},
      multiple: true
    });
    // Runs when an image is selected.
    meta_image_frame.on('select', function () {
      // Grabs the attachment selection and creates a JSON representation of the model.
      var media_attachment = meta_image_frame.state().get('selection').first().toJSON();
      // Sends the attachment URL to our custom image input field.
      thisUpload.addClass('has-image');
      thisUpload.find('input[type="hidden"]').val(media_attachment.url);
      thisUpload.find('img.image_view_c').attr('src', media_attachment.url);
      calc_custom_position_c();
    });
    // Opens the media library frame.
    meta_image_frame.open();
  });

  // Aggiungo la foto del danno 2
  $('body').on('click', '.button-upload_2_c', function (e) {
    // Prevents the default action from occuring.
    e.preventDefault();
    var thisUpload = $(this).parents('.svl-upload-image_c');
    // Sets up the media library frame
    meta_image_frame = wp.media.frames.meta_image_frame = wp.media({
      title: meta_image.title,
      button: {text: meta_image.button},
      library: {type: 'image'},
      multiple: true
    });
    // Runs when an image is selected.
    meta_image_frame.on('select', function () {
      // Grabs the attachment selection and creates a JSON representation of the model.
      var media_attachment = meta_image_frame.state().get('selection').first().toJSON();
      // Sends the attachment URL to our custom image input field.
      thisUpload.addClass('has-image');
      thisUpload.find('input[type="hidden"]').val(media_attachment.url);
      thisUpload.find('img.image_view_c').attr('src', media_attachment.url);
      calc_custom_position_c();
    });
    // Opens the media library frame.
    meta_image_frame.open();
  });

  // Aggiungo la foto del danno 3
  $('body').on('click', '.button-upload_3_c', function (e) {
    // Prevents the default action from occuring.
    e.preventDefault();
    var thisUpload = $(this).parents('.svl-upload-image_c');
    // Sets up the media library frame
    meta_image_frame = wp.media.frames.meta_image_frame = wp.media({
      title: meta_image.title,
      button: {text: meta_image.button},
      library: {type: 'image'},
      multiple: true
    });
    // Runs when an image is selected.
    meta_image_frame.on('select', function () {
      // Grabs the attachment selection and creates a JSON representation of the model.
      var media_attachment = meta_image_frame.state().get('selection').first().toJSON();
      // Sends the attachment URL to our custom image input field.
      thisUpload.addClass('has-image');
      thisUpload.find('input[type="hidden"]').val(media_attachment.url);
      thisUpload.find('img.image_view_c').attr('src', media_attachment.url);
      calc_custom_position_c();
    });
    // Opens the media library frame.
    meta_image_frame.open();
  });

  // Aggiungo la foto del danno 4
  $('body').on('click', '.button-upload_4_c', function (e) {
    // Prevents the default action from occuring.
    e.preventDefault();
    var thisUpload = $(this).parents('.svl-upload-image_c');
    // Sets up the media library frame
    meta_image_frame = wp.media.frames.meta_image_frame = wp.media({
      title: meta_image.title,
      button: {text: meta_image.button},
      library: {type: 'image'},
      multiple: true
    });
    // Runs when an image is selected.
    meta_image_frame.on('select', function () {
      // Grabs the attachment selection and creates a JSON representation of the model.
      var media_attachment = meta_image_frame.state().get('selection').first().toJSON();
      // Sends the attachment URL to our custom image input field.
      thisUpload.addClass('has-image');
      thisUpload.find('input[type="hidden"]').val(media_attachment.url);
      thisUpload.find('img.image_view_c').attr('src', media_attachment.url);
      calc_custom_position_c();
    });
    // Opens the media library frame.
    meta_image_frame.open();
  });

  // Aggiungo la foto del danno 5
  $('body').on('click', '.button-upload_5_c', function (e) {
    // Prevents the default action from occuring.
    e.preventDefault();
    var thisUpload = $(this).parents('.svl-upload-image_c');
    // Sets up the media library frame
    meta_image_frame = wp.media.frames.meta_image_frame = wp.media({
      title: meta_image.title,
      button: {text: meta_image.button},
      library: {type: 'image'},
      multiple: true
    });
    // Runs when an image is selected.
    meta_image_frame.on('select', function () {
      // Grabs the attachment selection and creates a JSON representation of the model.
      var media_attachment = meta_image_frame.state().get('selection').first().toJSON();
      // Sends the attachment URL to our custom image input field.
      thisUpload.addClass('has-image');
      thisUpload.find('input[type="hidden"]').val(media_attachment.url);
      thisUpload.find('img.image_view_c').attr('src', media_attachment.url);
      calc_custom_position_c();
    });
    // Opens the media library frame.
    meta_image_frame.open();
  });

  // draggable
  function doDraggable_c() {
    $('.drag_element_c').draggable({
      containment: '#body_drag_c',
      drag: function (event, ui) {
        /*coordinates(event, ui, '#body_drag');*/
      },
      stop: function (event, ui) {
        var thisPoint = ui.helper[0].id;
        var dataPoint = $('#' + thisPoint).attr('data-points');
        var element = $('#body_drag_c');
        var left = ui.position.left,
          top = ui.position.top;
        var wWrap = element.width(),
          hWrap = element.height();
        var topPosition = ((top / hWrap) * 100).toFixed(2),
          leftPosition = ((left / wWrap) * 100).toFixed(2);

        $('.all_points_c #info_draggable_c' + dataPoint + ' input[name="pointdata_c[top_c][]"]').val(topPosition);
        $('.all_points_c #info_draggable_c' + dataPoint + ' input[name="pointdata_c[left_c][]"]').val(leftPosition);

      }
    });
  }
  doDraggable_c();

  // aggiungo un pins del danno
  $('.add_point_c').click(function () {
    if (!$('input.pins_image_c').val()) {
      alert('Add pins image then add point.');
      return false;
    }
    var pins_image_view = $('.pins_image_c').val();
    var countPoint = parseInt($('.wrap_svl_c .drag_element_c').last().attr('data-points'));
    var nonceForm = $('#maps_points_meta_box_nonce_c').val();
    if (!countPoint) countPoint = 0;
    countPoint = countPoint + 1;
    var fullId = 'point_content_c' + countPoint;
    $.ajax({
      type: "post",
      dataType: "json",
      url: meta_image.ajaxurl,
      data: {
        action: "devvn_ihotspot_clone_point_c",
        countpoint_c: countPoint,
        img_pins_c: pins_image_view,
        nonce: nonceForm
      },
      context: this,
      beforeSend: function () {
        $(this).parent().addClass('adding_point');
      },
      success: function (response) {
        if (response.success === true) {
          var data = response.data;
          $('.wrap_svl_c').append(data.point_pins_c);
          $('.all_points_c').append(data.point_data_c);


          /* this is need for the tabs to work
          source https://github.com/ccbgs/load_editor
          */
          quicktags({id: fullId});
          tinymce.init({
            selector: "#" + fullId,
            content_css: meta_image.editor_style,
            min_height: 200,
            textarea_name: "pointdata_c[content_c][]",
            relative_urls: false,
            remove_script_host: false,
            convert_urls: false,
            browser_spellcheck: false,
            fix_list_elements: true,
            entities: "38,amp,60,lt,62,gt",
            entity_encoding: "raw",
            keep_styles: false,
            //paste_webkit_styles:"font-weight font-style color",
            //preview_styles:"font-family font-size font-weight font-style text-decoration text-transform",
            wpeditimage_disable_captions: false,
            wpeditimage_html5_captions: true,
            plugins: "charmap,hr,media,paste,tabfocus,textcolor,wordpress,wpeditimage,wpgallery,wplink,wpdialogs,wpview",
            resize: "vertical",
            menubar: false,
            wpautop: true,
            indent: false,
            toolbar1: "bold,italic,strikethrough,bullist,numlist,blockquote,hr,alignleft,aligncenter,alignright,link,unlink,wp_more,spellchecker,wp_adv",
            toolbar2: "formatselect,underline,alignjustify,forecolor,pastetext,removeformat,charmap,outdent,indent,undo,redo,wp_help",
            toolbar3: "",
            toolbar4: "",
            tabfocus_elements: ":prev,:next",
          });

          // this is needed for the editor to initiate
          tinyMCE.execCommand('mceFocus', false, fullId);
          tinyMCE.execCommand('mceRemoveEditor', false, fullId);
          tinyMCE.execCommand('mceAddEditor', false, fullId);

          doDraggable_c();
          calc_custom_position_c();
          $(this).parent().removeClass('adding_point');
        } else {
          alert("Try again!");
        }
      }
    });
    return false;
  });

  // cancello il pins del danno
  $('body').on('click', '.button_delete_c', function () {
    var idDiv = $(this).parents('.list_points_c').attr('data-points');
    $('[data-popup="info_draggable_c' + idDiv + '"]').fadeOut(350, function () {
      $('#info_draggable_c' + idDiv).remove();
      $('#draggable_c' + idDiv).remove();
    });
    return false;
  });

  // cancello l'immagine del danno
  $('body').on('click', '.svl-delete-image_c', function () {
    var parentDiv = $(this).parents('.svl-upload-image_c');
    parentDiv.removeClass('has-image');
    parentDiv.find('input[type="hidden"]').val('');
    return false;
  });


  function cacl_position_c($position = 'center_center_c', $is_hover = false, $return = 'top_c') {
    var $r_top = 0;
    var $r_left = 0;
    if ($is_hover) {
      var $width = $('.pins_img_hover_c').width(),
        $height = $('.pins_img_hover_c').height(),
        $custom_top = $('input[name="custom_hover_top_c"]').val(),
        $custom_left = $('input[name="custom_hover_left_c"]').val();
    } else {
      var $width = $('.pins_img_c').width(),
        $height = $('.pins_img_c').height(),
        $custom_top = $('input[name="custom_top_c"]').val(),
        $custom_left = $('input[name="custom_left_c"]').val();
    }
    switch ($position) {
      case 'center_center_c':
        $r_top = $height / 2;
        $r_left = $width / 2;
        break;
      case 'top_center_c':
        $r_top = 0;
        $r_left = $width / 2;
        break;
      case 'top_right_c':
        $r_top = 0;
        $r_left = $width;
        break;
      case 'top_left_c':
        $r_top = 0;
        $r_left = 0;
        break;
      case 'right_center_c':
        $r_top = $height / 2;
        $r_left = $width;
        break;
      case 'bottom_center_c':
        $r_top = $height;
        $r_left = $width / 2;
        break;
      case 'bottom_right_c':
        $r_top = $height;
        $r_left = $width;
        break;
      case 'bottom_left_c':
        $r_top = $height;
        $r_left = 0;
        break;
      case 'left_center_c':
        $r_top = $height / 2;
        $r_left = 0;
        break;
      case 'custom_center_c':
        $r_top = $custom_top;
        $r_left = $custom_left;
        break;
      default:
        $r_top = $height / 2;
        $r_left = $width / 2;
        break;
    }
    if ($return == 'top_c') {
      return $r_top;
    } else {
      return $r_left;
    }
  }

  function point_position_c($position = 'center_center_c') {
    $('input[name="custom_top_c"]').val(cacl_position_c($position, false, 'top')),
      $('input[name="custom_left_c"]').val(cacl_position_c($position, false, 'left'));
    $('input[name="custom_hover_top_c"]').val(cacl_position_c($position, true, 'top')),
      $('input[name="custom_hover_left_c"]').val(cacl_position_c($position, true, 'left'));
    $('.point_style_c img').each(function () {
      $(this).css({
        'top': '-' + cacl_position_c($position, false, 'top') + 'px',
        'left': '-' + cacl_position_c($position, false, 'left') + 'px'
      });
    });
  }

  calc_custom_position_c();

  function calc_custom_position_c() {
    var typeVal = $('input[name="choose_type_c"]:checked').val();
    point_position_c(typeVal);
  }

  $('input[name="choose_type_c"]').change(function () {
    var thisVal = $('input[name="choose_type_c"]:checked').val();
    point_position_c(thisVal);
    return false;
  });
  $('input[name="custom_top_c"],input[name="custom_left_c"]').on('change', function () {
    var thisVal = $('input[name="choose_type_c"]:checked').val();
    if (thisVal == 'custom_center_c')
      point_position_c(thisVal);
    return false;
  });








  // Apertura e chiusura modale
  $('body').on('click', '[data-popup-open]', function (e) {
    var targeted_popup_class = jQuery(this).attr('data-popup-open');

    //controllo se input è enercon o altre è checkato e mostro o nascondo la tendina della priority corrispondente
    if($('#pods-form-ui-pods-meta-blade-type-1').is(":checked")) {
      $('.priority-altre').addClass("hidden");
      $('.priority-enercon').removeClass("hidden");
    } else {
      $('.priority-altre').removeClass("hidden");
      $('.priority-enercon').addClass("hidden");
    }

    $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);
    e.preventDefault();
  });
  $('body').on('click', '[data-popup-close]', function (e) {
    var targeted_popup_class = jQuery(this).attr('data-popup-close');
    $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
    e.preventDefault();
  });


    //controllo al caricamaneto della pagina se il check radio pala enercon è checcato o no e mostro l'immagine della paa corrispondente
    if($('#pods-form-ui-pods-meta-blade-type-1').is(":checked")) {
      $('.maps-image-other').addClass("hidden");
      $('.maps-image-enercon').removeClass("hidden");
    } else {
      $('.maps-image-enercon').addClass("hidden");
      $('.maps-image-other').removeClass("hidden");
    }

    // cambio la pala da mostrare al cambio del check radio pala enercon o altre
    $('input:radio[name=pods_meta_blade_type]').change(function() {
      if (this.value == '1') {
        $('.maps-image-other').addClass("hidden");
        $('.maps-image-enercon').removeClass("hidden");
      }
      else if (this.value == '0') {
        $('.maps-image-enercon').addClass("hidden");
        $('.maps-image-other').removeClass("hidden");
      }
    });




});