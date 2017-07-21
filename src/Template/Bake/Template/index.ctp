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
%>
<?php
/**
  * @var \<%= $namespace %>\View\AppView $this
  */
$this->extend('/Admin/Common/index');
$this->assign('title', 'Listar <%= $pluralHumanName %>');
$this->Breadcrumbs->add('<%= $pluralHumanName %>');
$this->Breadcrumbs->add('Listar');
?>
<%
use Cake\Utility\Inflector;

$fields = collection($fields)
    ->filter(function($field) use ($schema) {
        return !in_array($schema->columnType($field), ['binary', 'text']);
    });

if (isset($modelObject) && $modelObject->behaviors()->has('Tree')) {
    $fields = $fields->reject(function ($field) {
        return $field === 'lft' || $field === 'rght';
    });
}

if (!empty($indexColumns)) {
    $fields = $fields->take($indexColumns);
}

%>

<?php $this->start('boxHeader') ?>
<h3 class="box-title"><?= __('Listar') ?></h3>
<?php /*= $this->Form->setValueSources(['query', 'context'])->create(null, ['type' => 'get']) ?>
<div class="box-tools">
    <!-- Single button -->
    <div class="input-group input-group-sm" style="width: 200px;">
        <?= $this->Form->text('search', ['placeholder' => 'Busca', 'class' => 'form-control pull-right']) ?>
        <div class="input-group-btn">
            <?= $this->Form->button('<i class="fa fa-search"></i>', ['class' => 'btn btn-default']) ?>
        </div>
    </div>
</div>
<?php//= $this->Form->end() */ ?>
<div class="pull-right box-tools">
    <?= $this->Html->link('<i class="fa fa-plus"></i> ' . __('Adicionar'), ['action' => 'add'], ['class' => 'btn btn-success btn-sm', 'escape' => false]) ?>
</div>
<?php $this->end() ?>

<div class="<%= $pluralVar %> index table-responsive box-body no-padding">
    <table class="table table-striped table-hover">
        <thead>
            <tr>
<% foreach ($fields as $field): %>
<% if($field === 'id') continue; %>
<% if($field === 'created') : %>
                <th scope="col"><?= $this->Paginator->sort('<%= $field %>', __('Criado em')) ?></th>
<% elseif ($field === 'modified') : %>
                <th scope="col"><?= $this->Paginator->sort('<%= $field %>', __('Modificado em')) ?></th>
<% elseif ($field === 'name') : %>
                <th scope="col"><?= $this->Paginator->sort('<%= $field %>', __('Nome')) ?></th>
<% elseif ($field === 'title') : %>
                <th scope="col"><?= $this->Paginator->sort('<%= $field %>', __('Título')) ?></th>
<% else : %>
                <th scope="col"><?= $this->Paginator->sort('<%= $field %>') ?></th>
<% endif %>
<% endforeach; %>
                <th scope="col" class="actions"><?= __('Opções') ?></th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($<%= $pluralVar %> as $<%= $singularVar %>): ?>
            <tr>
<%        foreach ($fields as $field) {
            if($field === 'id') continue;

            $isKey = false;
            if (!empty($associations['BelongsTo'])) {
                foreach ($associations['BelongsTo'] as $alias => $details) {
                    if ($field === $details['foreignKey']) {
                        $isKey = true;
%>
                <td><?= $<%= $singularVar %>->has('<%= $details['property'] %>') ? $this->Html->link($<%= $singularVar %>-><%= $details['property'] %>-><%= $details['displayField'] %>, ['controller' => '<%= $details['controller'] %>', 'action' => 'view', $<%= $singularVar %>-><%= $details['property'] %>-><%= $details['primaryKey'][0] %>]) : '' ?></td>
<%
                        break;
                    }
                }
            }
            if ($isKey !== true) {
                if (!in_array($schema->columnType($field), ['integer', 'biginteger', 'decimal', 'float'])) {
%>
                <td><?= h($<%= $singularVar %>-><%= $field %>) ?></td>
<%
                } else {
%>
                <td><?= $this->Number->format($<%= $singularVar %>-><%= $field %>) ?></td>
<%
                }
            }
        }

        $pk = '$' . $singularVar . '->' . $primaryKey[0];
%>
                <td class="actions">
                    <?= $this->Utilities->editButton($<%= $singularVar %>) ?>
                    <?= $this->Utilities->deleteButton($<%= $singularVar %>) ?>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
