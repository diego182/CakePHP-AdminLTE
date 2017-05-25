<?php
/**
 * @var \App\View\AppView $this
 */
$this->Breadcrumbs->add('<i class="fa fa-home" aria-hidden="true"></i>')
?>
<!-- Default box -->
<div class="box box-success">
    <div class="box-header with-border">
        <?= $this->fetch('boxHeader') ?>
    </div>
    <!-- /.box-body -->
    <?= $this->fetch('content') ?>

    <!-- /.box-footer-->
    <div class="box-footer">
        <div class="pull-left">
            <?= $this->Paginator->counter('{{start}} - {{end}} de {{count}}'); ?>
        </div>
        <ul class="pagination pagination-sm no-margin pull-right">
            <?= $this->Paginator->first(__('«')); ?>
            <?= $this->Paginator->prev(__('‹')); ?>
            <?= $this->Paginator->numbers(['before' => null, 'after' => null]); ?>
            <?= $this->Paginator->next(__('›')); ?>
            <?= $this->Paginator->last(__('»')); ?>
        </ul>
    </div>
</div>
<!-- /.box -->