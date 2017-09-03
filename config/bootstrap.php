<?php

use Cake\Core\Configure;

if (!Configure::check('CakePHPAdminLTE.theme')) {
    Configure::write('CakePHPAdminLTE.theme', 'skin-blue-light');
}
if (!Configure::check('CakePHPAdminLTE.logo.lg')) {
    Configure::write('CakePHPAdminLTE.logo.lg', '<b>CakePHP</b> AdminLTE');
}
if (!Configure::check('CakePHPAdminLTE.logo.mini')) {
    Configure::write('CakePHPAdminLTE.logo-mini', '<b>A</b>LT');
}
if (!Configure::check('CakePHPAdminLTE.copyright')) {
    Configure::write('CakePHPAdminLTE.copyright', '<strong>Copyright &copy;</strong> <a href="https://github.com/diego182/CakePHP-AdminLTE">CakePHP AdminLTE</a>.');
}