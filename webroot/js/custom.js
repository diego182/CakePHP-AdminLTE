/**
 * Read the value from a cookie.
 *
 * @param name
 * @return {*}
 */
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

$(document).ready(function () {

    /**
     * Function for activate toggles
     *
     * It depends on the readCookie function
     * It also expects for you to be working with font awesome
     *
     * you must define an href on the element you want to toggle
     *
     * it expects to receive a json similar to the one below
     *
     * {
     *     "active": {
     *         "status": "active"
     *     }
     * }
     *
     * OR
     *
     * {
     *     "active": {
     *         "status": "deactivated"
     *     }
     * }
     */
    jQuery(document).on('click', '[data-activate-toggle]', function (event) {
        /**
         * Prevent default actions of the JS and stops propagation
         */
        event.preventDefault();
        event.stopPropagation();

        /**
         * Keep this object for later use, as AJAX requests return a new object.
         * @type {*}
         */
        var $this = jQuery(this);

        /**
         * Keep the original class, so in case of fail it will get back to it.
         */
        var $originalClass;

        if ($this.children(':first').hasClass('fa-square-o')) {
            $originalClass = 'fa-square-o';
        } else {
            $originalClass = 'fa-check-square-o';
        }

        /**
         * Send the AJAX request
         */
        $.ajax({
            url: $this.attr('href'),
            type: 'post',
            dataType: 'json',
            headers: {
                'X-CSRF-Token': readCookie('csrfToken')
            },
            beforeSend: function (jqXHR, settings) {
                /**
                 * replace the icon with a spin icon to denotes an action is going on
                 */
                $this.children(':first')
                    .removeClass('fa-square-o fa-check-square-o')
                    .addClass('fa-spinner fa-pulse');
            }
        }).done(function (data, textStatus, jqXHR) {
            /**
             * Evaluates the response to add the appropriate class
             */
            if ('active' === data.active.status) {
                $this.children(':first')
                    .removeClass('fa-square-o fa-spinner fa-pulse')
                    .addClass('fa-check-square-o');
            } else if ('deactivated' === data.active.status) {
                $this.children(':first')
                    .removeClass('fa-check-square-o fa-spinner fa-pulse')
                    .addClass('fa-square-o');
            } else {
                /**
                 * Case of an unespected response fallback to to original icon state
                 */
                $this.children(':first')
                    .removeClass('fa-check-square-o fa-square-o fa-spinner fa-pulse')
                    .addClass($originalClass);
                alert('Algo errado aconteceu.');
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            /**
             * Case of an unespected response fallback to to original icon state
             */
            $this.children(':first')
                .removeClass('fa-check-square-o fa-square-o fa-spinner fa-pulse')
                .addClass($originalClass);
        });
    });

    /**
     * Uploads a file.
     */
    $('[data-file-upload]').on('change', function (event) {
        event.stopPropagation();

        var $this = $(this);
        var $data = new FormData();
        $data.append('file', $this.prop('files')[0]);

        $.ajax({
            type: 'post',
            url: $this.data('href'),
            data: $data,
            dataType: 'json',
            cache: false,
            processData: false, // important for ajax file upload
            contentType: false, // important for ajax file upload
            headers: {
                'X-CSRF-Token': readCookie('csrfToken')
            },
            beforeSend: function (jqXHR, settings) {
                $this.siblings('i').removeClass('fa-image').addClass('fa-spinner fa-spin');
                $this.parent('label').after('<div id="upload-progress" class="progress" style="margin-top: 30px">' +
                    '    <div class="progress-bar progress-bar-striped" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">' +
                    '        0%' +
                    '    </div>' +
                    '</div>').hide().slideDown();
            },
            xhr: function () {
                var xhr = new window.XMLHttpRequest();

                xhr.upload.addEventListener('progress', function (event) {
                    if (event.lengthComputable) {
                        var percent = Math.round((event.loaded / event.total) * 100);
                        jQuery('#upload-progress').find('.progress-bar').attr('aria-valuenow', percent).css('width', percent + '%').text(percent + '%');
                        if (100 === percent) {
                            jQuery('#upload-progress').find('.progress-bar').text('Processando o arquivo.')
                        }
                    }
                });

                return xhr;
            }
        }).done(function (data, textStatus, jqXHR) {
            try {
                var $data = data.file;

                if ($data.success) {
                    var $filePlaceholder = jQuery('[data-file-placeholder]');
                    var $classToContainer = (typeof $filePlaceholder.data('file-add-class') === 'undefined') ? 'col-md-4 col-sm-6' : $filePlaceholder.data('file-add-class');
                    var $imageLink = (typeof $filePlaceholder.data('file-format') !== 'undefined') ? ($data.url).replace('/original/', $filePlaceholder.data('file-format')) : ($data.url).replace('/original/', '/web/');

                    var $dataToAppend = '<div id="sort_' + $data.payload.id + '" class="sort-drag-area ' + $classToContainer + '">' +
                        '    <div class="thumbnail">' +
                        '        <img src="' + $imageLink + '" class="img-responsive" alt="' + $data.payload.title + '">' +
                        '        <div class="caption btn-group btn-group-justified" role="group">' +
                        '            <a href="' + $filePlaceholder.data('featured-link') + '/' + $data.payload.id + '" class="btn btn-info" data-activate-toggle>' +
                        '                <i class="fa fa-lg fa-square-o" aria-hidden="true"></i>' +
                        '            </a>' +
                        '            <a href="' + $filePlaceholder.data('edit-link') + '/' + $data.payload.id + '" class="btn btn-warning">Editar</a>' +
                        '            <a href="#" class="btn btn-danger" data-remove-image-from-list>Apagar</a>' +
                        '         </div>';
                    if ($filePlaceholder.data('allow-mutiple')) {
                        $dataToAppend += '<input type="hidden" name="files[_ids][' + (jQuery('.sort-drag-area').length + 1) + ']" value="' + $data.payload.id + '">';
                    } else {
                        $dataToAppend += '<input type="hidden" name="files[id]" value="' + $data.payload.id + '">';
                    }
                    $dataToAppend += '    </div>' +
                        '</div>';


                    $filePlaceholder.append($dataToAppend);
                    jQuery('#file-messages').removeClass('hide').show().find('p').text('Arquivos adicionados e não salvos.');
                }
            } catch (exception) {
                alert('Algo errado aconteceu no envio da imagem!');
                console.error(exception.message);
            }
        }).always(function () {
            $this.siblings('i').addClass('fa-image').removeClass('fa-spinner fa-spin');
            $('#upload-progress').slideUp('normal', function () {
                $(this).remove();
            });
        });
    });

    jQuery(document).on('click', '[data-remove-image-from-list]', function (event) {
        event.preventDefault();
        event.stopPropagation();

        jQuery(this).closest('[id^=sort]').remove();
        jQuery('#file-messages').removeClass('hide').show().find('p').text('Arquivos modificados e não salvos.');
    });

    $('[data-sortable]').sortable({
        placeholder: 'ui-state-highlight',
        //handle: '.sort-drag-area',
        start: function (event, ui) {
            ui.placeholder.addClass('col-md-4 col-sm-6');
            ui.placeholder.css({
                'height': ui.item.innerHeight() + 'px',
                'width': ui.item.innerWidth() + 'px'
            });
        },
        stop: function (event, ui) {
            var data = $(this).sortable('serialize', {expression: '(.+)_(.+)'});
            $.ajax({
                data: data,
                type: 'post',
                url: $(this).data('sortable'),
                dataType: 'json',
                headers: {
                    'X-CSRF-Token': readCookie('csrfToken')
                }
            });
        }
    });

    $loadImageFromDB = $('[data-load-image-from-db]');

    if ($loadImageFromDB.length) {

        $.each($loadImageFromDB, function ($key, $input) {
            $.getJSON('/en/api/file-link/' + $($input).val(), null, function (data) {
                $($input)
                    .parent()
                    .append('' +
                        '<img src="' + (data.file.url).replace('/original/', '/' + $($input).data('load-image-from-db') + '/') + '" class="img-responsive" alt="' + data.file.payload.original_name + '">'
                    );
                $($input)
                    .siblings('div.loader')
                    .remove();
            });
        });
    }
});