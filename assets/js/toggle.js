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
        var $this = $(this);

        /**
         * Keep the original class, so in case of fail it will get back to it.
         */
        var $originalClass;

        if ($this.children(':first').hasClass('fa-toggle-off')) {
            $originalClass = 'fa-toggle-off text-danger';
        } else {
            $originalClass = 'fa-toggle-on text-success';
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
                    .removeClass('fa-toggle-off fa-toggle-on text-danger text-success')
                    .addClass('fa-spinner fa-pulse text-primary');
            }
        }).done(function (data, textStatus, jqXHR) {
            /**
             * Evaluates the response to add the appropriate class
             */
            if ('active' === data.active.status) {
                $this.children(':first')
                    .removeClass('fa-toggle-off text-danger fa-spinner fa-pulse')
                    .addClass('fa-toggle-on text-success');
            } else if ('deactivated' === data.active.status) {
                $this.children(':first')
                    .removeClass('fa-toggle-on text-success fa-spinner fa-pulse')
                    .addClass('fa-toggle-off text-danger');
            } else {
                /**
                 * Case of an unespected response fallback to to original icon state
                 */
                $this.children(':first')
                    .removeClass('fa-toggle-on fa-toggle-off fa-spinner fa-pulse text-success text-danger')
                    .addClass($originalClass);
                alert('Algo errado aconteceu.');
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            /**
             * Case of an unespected response fallback to to original icon state
             */
            $this.children(':first')
                .removeClass('fa-toggle-on fa-toggle-off fa-spinner fa-pulse')
                .addClass($originalClass);

            if (jqXHR.status === 403) {
                if (confirm("A sua sessão expirou, você precisa fazer o login\n\nClique em * OK * para ser fazer o login.\nClique em * Cancelar * para permanecer nessa página.")) {
                    return location.reload(true);
                }
            }
        });
    });
});