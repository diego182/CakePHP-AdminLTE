<?php
/**
 * @var \App\View\AppView $this
 */
?>
<!DOCTYPE html>
<html>
<head>
    <?= $this->Html->charset() ?>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title><?= $this->fetch('title') ?></title>
    <!-- Tell the browser to be responsive to screen width -->
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <?= $this->Html->css([
        'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic',
        'style.min',
    ]) ?>
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>
<body class="hold-transition login-page">
<div class="login-box">
    <div class="login-logo">
        <b>Allure</b>CMS
    </div>
    <?= $this->Flash->render(); ?>

    <!-- /.login-logo -->
    <div class="login-box-body">
        <?= $this->fetch('request-form-message') ?>
        <!-- content -->
        <?= $this->fetch('content') ?>
        <!-- /content -->
        <?= $this->fetch('request-form-links') ?>
    </div>
    <!-- /.login-box-body -->
</div>
<!-- /.login-box -->

<?php
echo $this->Html->script(['script.min']);
echo $this->fetch('scriptBottom');
?>
</body>
</html>