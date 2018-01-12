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

    var ls = window.localStorage;
    $sidebarCollapsed = !!parseInt(ls.getItem('sidebar-collapse'));

    $('.sidebar-toggle').on('click', function (event) {
        if (ls.getItem('sidebar-collapse') === null) {
            return ls.setItem('sidebar-collapse', 1);
        }

        if($sidebarCollapsed) {
            ls.setItem('sidebar-collapse', 0);
        } else {
            ls.setItem('sidebar-collapse', 1);
        }
    });

    if($sidebarCollapsed){
        $('body').addClass('sidebar-collapse');
    }
});