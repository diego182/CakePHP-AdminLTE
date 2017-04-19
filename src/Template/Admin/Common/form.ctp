<?php
/**
 * @var \App\View\AppView $this
 */
?>
<?= $this->fetch('formCreate') ?>
<!-- Default box -->
<div class="box box-info">
    <div class="box-header with-border">
        <?= $this->fetch('boxHeader') ?>
    </div>
    <div class="box-body">
        <!-- /.box-body -->
        <?= $this->fetch('content') ?>
    </div>
        <!-- /.box-footer-->
    <div class="box-footer">
        <?=$this->fetch('boxFooter') ?>
    </div>
</div>
<?= $this->fetch('formEnd') ?>
<!-- /.box -->