<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>AllureCMS | Log in</title>
    <!-- Tell the browser to be responsive to screen width -->
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <?= $this->Html->css([
        'bootstrap.min',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
        'AdminLTE.min',
        'skins/skin-blue-light.css'
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
        <p class="login-box-msg">Faça o login para entrar.</p>
        <!-- content -->
        <?= $this->fetch('content') ?>
        <!-- /content -->

    </div>
    <!-- /.login-box-body -->
</div>
<!-- /.login-box -->

<?= $this->Html->script([
    'jquery-2.2.3.min',
    'bootstrap.min',
    'slimScroll/jquery.slimscroll.min',
    'fastclick/fastclick',
    'app.min',
    'bootstrap-datepicker.min',
    '/locales/bootstrap-datepicker.pt-BR.min',
    'jquery.Jcrop.min',
    'custom'
]).
$this->fetch('scriptBottom')?>
<!-- jQuery 2.2.3 -->
<!-- Bootstrap 3.3.6 -->
<!-- iCheck -->
<script>
    $(function () {
        $('input').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue',
            increaseArea: '20%' // optional
        });
    });
</script>
</body>
</html>
