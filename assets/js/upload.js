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
                    '        <div class="caption btn-group btn-group-justified" role="group">';
                if ($filePlaceholder.data('allow-mutiple')) {
                    $dataToAppend += '<a href="' + $filePlaceholder.data('featured-link') + '/' + $data.payload.id + '" class="btn btn-info" data-activate-toggle>' +
                        '                <i class="fa fa-lg fa-square-o" aria-hidden="true"></i>' +
                        '            </a>';
                }
                $dataToAppend += '<a href="' + $filePlaceholder.data('edit-link') + '/' + $data.payload.id + '" class="btn btn-warning">Editar</a>' +
                    '            <a href="#" class="btn btn-danger" data-remove-image-from-list>Apagar</a>' +
                    '         </div>';
                if ($filePlaceholder.data('allow-mutiple')) {
                    $dataToAppend += '<input type="hidden" name="files[_ids][' + (jQuery('.sort-drag-area').length + 1) + ']" value="' + $data.payload.id + '">';
                } else {
                    $dataToAppend += '<input type="hidden" name="file_id" value="' + $data.payload.id + '">';
                }
                $dataToAppend += '    </div>' +
                    '</div>';

                if ($filePlaceholder.data('allow-mutiple')) {
                    $filePlaceholder.append($dataToAppend);
                } else {
                    $filePlaceholder.html($dataToAppend);
                }
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
