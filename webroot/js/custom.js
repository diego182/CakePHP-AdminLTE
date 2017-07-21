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
    $('[data-activate-toggle]').on('click', function (event) {
        /**
         * Prevent default actions of the JS and stops propagation
         */
        event.preventDefault();
        event.stopPropagation();

        /**
         * Keep this object for later use, as AJAX requests return a new object.
         * @type {*}
         */
        var $this = $(this);

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

    function showFile($data) {
        var $filePlaceholder = $('[data-file-placeholder]');

        $filePlaceholder.append('<div class="img-container" id="sort_' + $data.file.payload.id + '">');

        $file = $('#sort_' + $data.file.payload.id);

        if ($filePlaceholder.hasClass('public-site')) {
            $file.append('<img src="' + ($data.file.url).replace('/web/', '/sq/') + '" width="150" height="150" class="img-responsive" alt="' + $data.file.payload.original_name + '">');
        } else if ($filePlaceholder.hasClass('web')) {
            $file.append('<img src="' + ($data.file.url).replace('/original/', '/web/') + '" class="img-responsive" alt="' + $data.file.payload.original_name + '">');
        } else if ($filePlaceholder.hasClass('banner')) {
            $file.append('<img src="' + ($data.file.url).replace('/original/', '/1920x750/') + '" class="img-responsive" alt="' + $data.file.payload.original_name + '">');
        } else {
            $file.append('<img src="' + ($data.file.url).replace('/web/', '/sq/') + '" class="img-responsive" alt="' + $data.file.payload.original_name + '">');
        }

        $file.append('<input type="hidden" name="file_id" value="' + $data.file.payload.id + '">');
    }

    var $uploadFile = $('[data-file-upload]');

    /**
     * Uploads a file.
     */
    $uploadFile.on('change', function (event) {
        event.stopPropagation();

        var $this = $(this);

        var data = new FormData();
        data.append('file', $this.prop('files')[0]);

        $.ajax({
            type: 'post',
            url: $this.data('href'),
            data: data,
            dataType: 'json',
            cache: false,
            processData: false, // important for ajax file upload
            contentType: false, // important for ajax file upload
            headers: {
                'X-CSRF-Token': readCookie('csrfToken')
            },
            beforeSend: function () {
                $this.siblings('i').removeClass('fa-image').addClass('fa-spinner fa-spin');
            }
        }).done(function (data, textStatus, jqXHR) {
            if ('undefined' !== typeof data.file.success && data.file.success) {
                $('.img-container').remove();
                showFile(data);
            } else {
                alert('Algo errado aconteceu no envio da imagem');
            }
        }).always(function () {
            $this.siblings('i').addClass('fa-image').removeClass('fa-spinner fa-spin');
        });
    });

    $(document).on('click', '[data-remove-image-from-list]', function (event) {
        event.preventDefault();
        event.stopPropagation();

        $(this).parent().parent().remove();
    });

    var $sortable = $('[data-sortable]');

    $sortable.sortable({
        placeholder: 'ui-state-highlight',
        handle: '.sort',
        stop: function (event, ui) {
            var data = $(this).sortable('serialize', {expression: '(.+)_(.+)'});
            $.ajax({
                data: data,
                type: 'POST',
                url: $(this).data('request-url'),
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