<?php
/**
 * @var \App\View\AppView $this
 */
$controller = $this->request->controller;
$action = $this->request->action;
?>
<!DOCTYPE html>
<html>
<head>
    <?= $this->Html->charset() ?>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>
        <?= $this->fetch('title') ?>
    </title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <?= $this->fetch('meta') ?>

    <?= $this->Html->meta('icon') ?>

    <?= $this->Html->css([
        'bootstrap.min',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
        'AdminLTE.min',
        'skins/skin-blue-light',
        'jquery-ui.structure.min',
        'jquery-ui.theme.min',
        'custom'
    ]) ?>
    <?= $this->fetch('css') ?>

    <?= $this->fetch('script') ?>

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>

<body class="hold-transition skin-blue-light sidebar-mini fixed">
<!-- Site wrapper -->
<div class="wrapper">
    <header class="main-header">
        <!-- Logo -->
        <a href="/admin" class="logo">
            <!-- mini logo for sidebar mini 50x50 pixels -->
            <span class="logo-mini"><b>C</b>NX</span>
            <!-- logo for regular state and mobile devices -->
            <span class="logo-lg"><b>C</b>onexão</span>
        </a>
        <!-- Header Navbar: style can be found in header.less -->
        <nav class="navbar navbar-static-top">
            <!-- Sidebar toggle button-->
            <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </a>

            <div class="navbar-custom-menu">
                <ul class="nav navbar-nav">
                    <!-- User Account: style can be found in dropdown.less -->
                    <li class="">
                        <a href="<?= $this->Url->build( ['prefix' => 'admin', 'plugin' => 'Users', 'controller' => 'Users', 'action' => 'logout']) ?>">
                            <span class="hidden-xs"><i class="fa fa-sign-out"></i> Logout</span>
                        </a>
                    </li>
                    <!-- Control Sidebar Toggle Button -->
                </ul>
            </div>
        </nav>
    </header>

    <!-- =============================================== -->

    <!-- Left side column. contains the sidebar -->
    <aside class="main-sidebar">
        <!-- sidebar: style can be found in sidebar.less -->
        <section class="sidebar">
            <?= $this->element('admin/sidebar-menu') ?>
        </section>
        <!-- /.sidebar -->
    </aside>

    <!-- =============================================== -->

    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
        <?= $this->Flash->render() ?>
        <!-- Content Header (Page header) -->
        <section class="content-header">
            <h1>
                <?= $this->fetch('title') ?>
            </h1>
            <!--            <ol class="breadcrumb">-->
            <!--                <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>-->
            <!--                <li><a href="#">Examples</a></li>-->
            <!--                <li class="active">Blank page</li>-->
            <!--            </ol>-->
        </section>

        <!-- Main content -->
        <section class="content">

            <?= $this->fetch('content') ?>

        </section>
        <!-- /.content -->
    </div>
    <!-- /.content-wrapper -->

    <footer class="main-footer">
        <strong>Copyright &copy; <?= date('Y') ?></strong> <a href="http://allurecomunicacao.com.br">Allure Comunicação</a>.
    </footer>
    <!-- /.control-sidebar -->
</div>
<!-- ./wrapper -->
<?= $this->Html->script([
    'jQuery',
    'jquery-ui.min',
    'bootstrap',
    'slimScroll/jquery.slimscroll.min',
    'fastclick/fastclick',
    'app',
    '//cdn.ckeditor.com/4.6.2/basic/ckeditor.js',
    'custom'
]) ?>
</body>
</html>