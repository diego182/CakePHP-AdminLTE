<%
/**
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @since         0.1.0
 * @license       http://www.opensource.org/licenses/mit-license.php MIT License
 */
use Cake\Utility\Inflector;

$fields = collection($fields)
    ->filter(function($field) use ($schema) {
        return $schema->columnType($field) !== 'binary';
    });

if (isset($modelObject) && $modelObject->hasBehavior('Tree')) {
    $fields = $fields->reject(function ($field) {
        return $field === 'lft' || $field === 'rght';
    });
}
%>
<?php $this->start('formCreate') ?>
<?= $this->Form->create($<%= $singularVar %>, ['novalidate']) ?>
<?php $this->end() ?>

<?php $this->start('boxHeader') ?>
<?php if ('add' === $this->request->action) : ?>
    <h3 class="box-title">Adicionar</h3>
<?php else : ?>
    <h3 class="box-title">Editar: <?= $<%= $singularVar %>-><%= $displayField %> ?></h3>
<?php endif ?>
<div class="pull-right box-tools">
    <?= $this->Html->link('<i class="fa fa-times"></i> Cancelar', ['action' => 'index'],
        ['class' => 'btn btn-danger btn-sm', 'escape' => false]) ?>
</div>
<?php $this->end() ?>

    <fieldset>
<%
        foreach ($fields as $field) {

            $label = $field;
            if (substr($label, -5) === '._ids') {
                $label = substr($label, 0, -5);
            }
            if (strpos($label, '.') !== false) {
                $fieldElements = explode('.', $label);
                $label = array_pop($fieldElements);
            }
            if (substr($label, -3) === '_id') {
                $label = substr($label, 0, -3);
            }

            if (in_array($field, $primaryKey)) {
                continue;
            }

            if (isset($keyFields[$field])) {
                $fieldData = $schema->column($field);
                if (!empty($fieldData['null'])) {
%>
            <?= $this->Form->control('<%= $field %>', ['label' => '<%= Inflector::humanize(Inflector::underscore($field)) %>', 'options' => $<%= $keyFields[$field] %>, 'empty' => true]) ?>
<%
                } else {
%>
            <?= $this->Form->control('<%= $field %>', ['label' => '<%= Inflector::humanize(Inflector::underscore($field)) %>', 'options' => $<%= $keyFields[$field] %>]) ?>
<%
                }
                continue;
            }
            if (!in_array($field, ['created', 'modified', 'updated'])) {
                $fieldData = $schema->column($field);
                if (in_array($fieldData['type'], ['date', 'datetime', 'time']) && (!empty($fieldData['null']))) {
%>
            <?= $this->Form->control('<%= $field %>', ['label' => '<%= Inflector::humanize(Inflector::underscore($label)) %>', 'empty' => true]) ?>
<%
                } else {
%>
            <?= $this->Form->control('<%= $field %>', ['label' => '<%= Inflector::humanize(Inflector::underscore($label)) %>']) ?>
<%
                }
            }
        }
        if (!empty($associations['BelongsToMany'])) {
            foreach ($associations['BelongsToMany'] as $assocName => $assocData) {
%>
            <?= $this->Form->control('<%= $assocData['property'] %>._ids', ['label' => '<%= Inflector::humanize(Inflector::underscore($label)) %>', 'options' => $<%= $assocData['variable'] %>]) ?>
<%
            }
        }
%>
    </fieldset>

<?php $this->start('boxFooter') ?>
<?= $this->Form->button(__('Salvar'), ['class' => 'btn btn-primary']) ?>
<?php $this->end() ?>

<?php $this->start('formEnd') ?>
<?= $this->Form->end() ?>
<?php $this->end() ?>