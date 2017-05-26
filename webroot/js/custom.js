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
     *
     */

    $(document).on('click', '[data-activate-toggle]', function (event) {
        event.preventDefault();
        event.stopPropagation();

        $this = $(this);

        $.post($this.attr('href'), {'_csrfToken': readCookie('csrfToken')}, function ( data ) {
            if('active' === data.active.status) {
                $this.children(':first').removeClass('fa-square-o').addClass('fa-check-square-o');
            } else if ('deactivated' === data.active.status) {
                $this.children(':first').removeClass('fa-check-square-o').addClass('fa-square-o');
            } else {
                alert('Algo errado aconteceu.');
            }
        }, 'json');
    });

    function showFile($data) {
        var $filePlaceholder = $('[show-files]');

        $filePlaceholder.append('<div class="img-container" id="sort_' + $data.file.payload.id + '">');

        $file = $('#sort_' + $data.file.payload.id);

        if($filePlaceholder.hasClass('public-site')) {
            $file.append('<img src="' + ($data.file.url).replace('/web/', '/sq/') + '" width="150" height="150" class="img-responsive" alt="' + $data.file.payload.original_name + '">');
        } else if($filePlaceholder.hasClass('web')) {
            $file.append('<img src="' + ($data.file.url).replace('/original/', '/web/') + '" class="img-responsive" alt="' + $data.file.payload.original_name + '">');
        } else if($filePlaceholder.hasClass('banner')) {
            $file.append('<img src="' + ($data.file.url).replace('/original/', '/1920x750/') + '" class="img-responsive" alt="' + $data.file.payload.original_name + '">');
        } else {
            $file.append('<img src="' + ($data.file.url).replace('/web/', '/sq/') + '" class="img-responsive" alt="' + $data.file.payload.original_name + '">');
        }
        $file.append('<a href="#" class="btn btn-danger" data-remove-image-from-list>Apagar</a>');
        $file.append('<a href="/admin/files/files/featuredToggle/' + $data.file.payload.id + '" class="text-black" data-activate-toggle><i class="fa fa-lg fa-square-o" aria-hidden="true"></i></a>');
        $file.append('<span class="sort"><i class="fa fa-grip fa-rotate-90" data-sort-drag-area></i></span>');
        $file.append('<input type="hidden" name="files[_ids][]" value="' + $data.file.payload.id + '">');
    }

    var $uploadFile = $('[data-upload-file]');

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
        }).done(function (data) {
            if('undefined' !== typeof data.file.success && data.file.success) {

                showFile(data);

                imageWidth();

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
            var data = $(this).sortable('serialize', { expression: '(.+)_(.+)' });
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

    if($loadImageFromDB.length) {

        $.each($loadImageFromDB, function ($key, $input) {
            $.getJSON('/en/api/file-link/' +  $($input).val(), null, function (data) {
                $($input)
                    .parent()
                    .append('' +
                        '<img src="' + (data.file.url).replace('/original/', '/' +  $($input).data('load-image-from-db') + '/') + '" class="img-responsive" alt="' + data.file.payload.original_name + '">'
                    );
                $($input)
                    .siblings('div.loader')
                    .remove();
            });
        });
    }
});