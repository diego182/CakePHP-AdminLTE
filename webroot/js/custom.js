/**
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
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

var $map = $('#map');

function showMap() {
    $('#show-map').remove();
    $map.parent().after('<div id="show-map">' + $map.val() + '</div>');
    $('#show-map>iframe').width($map.outerWidth()).height(300);
}

function imageWidth() {
    if($('.img-container').length) {
        $('.img-container img').on('load', function () {
            $(this).parent().width($(this).width());
            $(this).parent().height($(this).height());
        });
    }
}

$(window).resize(function () {
    $('#show-map>iframe').width($map.outerWidth());
});

$(document).ready(function () {

    showMap();

    $map.on('change blur keyup', function (event) {
        event.preventDefault();
        event.stopPropagation();

        showMap();

    });

    imageWidth();

    $('[name=files]').hide();

    $activateToggle = $('[data-activate-toggle]');

    /**
     * Functions about informations block
     * @type {*}
     */

    var $dataAdd = $('[data-add]');
    var $i;
    var $infoBlockMetaInfo = $dataAdd.length ? ($('[data-add]', this).data('add')).split('-') : null;
    $i = $infoBlockMetaInfo ? $infoBlockMetaInfo[1] : 0;

    $dataAdd.on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        var $infoBlockMetaInfo = $dataAdd.length ? ($(this).data('add')).split('-') : null;
        var $goal;

        if ('suites' === $infoBlockMetaInfo[0]) {
            $goal = 'Suite';
        } else {
            $goal = 'Lazer';
        }

        $('' +
            '<div class="panel panel-default">' +
            '    <div class="panel-heading">' +
            '        <h3 class="panel-title pull-left">' + $goal + '</h3>' +
            '        <div class="btn-group pull-right" role="group">' +
            '            <button class="btn btn-sm btn-danger" type="button" data-remove-info-block><i class="fa fa-times fa-rotate-90" data-sort-drag-area=""></i></button>' +
            '        </div>' +
            '        <div class="clearfix"></div>' +
            '    </div>' +
            '    <div class="panel-body">' +
            '        <div class="row">' +
            '            <div class="col-md-9">' +
            '                <input type="hidden" name="information_blocks[' + $i + '][sort_order]" value="' + $i + '" >' +
            '                <input type="hidden" name="information_blocks[' + $i + '][type]" value="' + $infoBlockMetaInfo[0] + '" >' +
            '                <div class="form-group"> ' +
            '                    <label for="title-' + $i + '-' + $infoBlockMetaInfo[0] + '">Título</label> ' +
            '                    <input type="text" name="information_blocks[' + $i + '][title]" class="form-control" id="title-' + $i + '-' + $infoBlockMetaInfo[0] + '" placeholder="Título"> ' +
            '                </div> ' +
            '                <div class="form-group"> ' +
            '                    <label for="content-' + $i + '-' + $infoBlockMetaInfo[0] + '">Conteúdo</label> ' +
            '                    <textarea name="information_blocks[' + $i + '][content]" class="form-control ckeditor" rows="4" id="content-' + $i + '-' + $infoBlockMetaInfo[0] + '" placeholder="Conteúdo"></textarea>' +
            '                </div> ' +
            '            </div>' +
            '            <div class="col-md-3">' +
            '                <label class="btn btn-info btn-sm btn-block">' +
            '                    <i class="fa fa-fw fa-image"></i> Adicionar foto' +
            '                    <input type="file" name="accomodation_logo" accept=".jpg,.jpeg,.png,.gif" data-upload-info-block="0" data-href="/admin/files/files/add">' +
            '                </label>' +
            '                <div class="info-block-image-container images-container"></div>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>')
            .appendTo('[data-add-target]')
            .hide()
            .slideDown();
        $i++;
        CKEDITOR.replace('.ckeditor')});

    /**
     * Remove *not* persisted information block
     */
    $(document).on('click', '[data-remove-info-block]',function (event) {
        event.preventDefault();
        event.stopPropagation();

        $(this).parent().parent().parent().slideUp('normal', function() { $(this).remove() } );
    });

    /**
     * Remover persisted information block
     */
    $('[data-remove-info-block-from-db]').on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        var $this = $(this);

        if(confirm('Você deseja remover o bloco de informações?\nEssa informação não poderá ser recuperada.')) {

            $this.attr('disabled', true);
            $this.children('i').removeClass('fa-times').addClass('fa-spinner fa-spin');
            $.post($this.attr('href'), {'_csrfToken': readCookie('csrfToken')}, function (data, textStatus, jqXHR) {
                if (200 === jqXHR.status) {
                    $this.parent().parent().parent().slideUp('normal', function () {
                        $(this).remove()
                    });
                }
            }, 'json')
                .fail(function (jqXHR) {
                    alert("Falha ao remover o bloco de informação\n" +
                        "Servidor respondeu com a seguinte mensagem:\n\n" + jqXHR.responseJSON.message);
                })
                .always(function () {
                    $this.removeAttr('disabled');
                    $this.children('i').addClass('fa-times').removeClass('fa-spinner fa-spin');
                });
        }
    });

    /**
     * end functions about information blocks
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
        var $filePlaceholder = $('#show-files');

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

    /**
     * Uploads a logo for an accomodation
     * @type {*}
     */

    var $uploadAccommodationLogo = $('[data-upload-accomodation-logo]');

    $uploadAccommodationLogo.on('change', function (event) {
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
            console.log(data);
            console.log(textStatus);
            console.log(jqXHR);

            if('undefined' !== typeof data.file.success && data.file.success) {

                $('#logo-container').empty().append('' +
                    '<div id="img-logo">' +
                    '    <img src="' + (data.file.url).replace('/original/', '/sq/') + '" class="img-responsive" alt="' + data.file.payload.original_name + '">' +
                    '</div>' +
                    '<input type="hidden" name="accommodation[file_id]" value="' + data.file.payload.id + '" data-load-image-from-db>');

            } else {
                alert('Algo errado aconteceu no envio da imagem');
            }
        }).always(function () {
            $this.siblings('i').addClass('fa-image').removeClass('fa-spinner fa-spin');
        });

    });

    $(document).on('change', '[data-upload-info-block]', function (event) {
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
        })
            .done(function (data, textStatus, jqXHR) {
                console.log(data);
                console.log(textStatus);
                console.log(jqXHR);

                if('undefined' !== typeof data.file.success && data.file.success) {

                    $this.parent().siblings('.info-block-image-container').empty().append('' +
                        '<div class="img-logo">' +
                        '    <img src="' + (data.file.url).replace('/original/', '/1920x750/') + '" class="img-responsive" alt="' + data.file.payload.original_name + '">' +
                        '</div>' +
                        '<input type="hidden" name="information_blocks[' + $this.data('upload-info-block') + '][file_id]" value="' + data.file.payload.id + '">');

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