<?php
use Migrations\AbstractSeed;

/**
 * Settings seed.
 */
class SettingsSeed extends AbstractSeed
{
    /**
     * Run Method.
     *
     * Write your database seeder using this method.
     *
     * More information on writing seeds is available here:
     * http://docs.phinx.org/en/latest/seeding.html
     *
     * @return void
     */
    public function run()
    {
        $i = 300;

        $data = [
            [
                'id' => \Cake\Utility\Text::uuid(),
                'scope' => 'adminLte',
                'name' => 'CakePHPAdminLTE.theme',
                'human_name' => 'Tema a ser utilizado pelo painel',
                'value' => 'skin-blue-dark',
                'description' => 'Tema a ser utilizado pelo painel',
                'sort_order' => $i++,
                'created' => date('Y-m-d H:i:s'),
                'modified' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => \Cake\Utility\Text::uuid(),
                'scope' => 'adminLte',
                'name' => 'CakePHPAdminLTE.logo.lg',
                'human_name' => 'Logo grande',
                'value' => '<b>CakePHP</b> AdminLTE',
                'description' => 'Logo grande',
                'sort_order' => $i++,
                'created' => date('Y-m-d H:i:s'),
                'modified' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => \Cake\Utility\Text::uuid(),
                'scope' => 'adminLte',
                'name' => 'CakePHPAdminLTE.logo.mini',
                'human_name' => 'Logo pequeno',
                'value' => '<b>A</b>LT',
                'description' => 'Logo pequeno',
                'sort_order' => $i++,
                'created' => date('Y-m-d H:i:s'),
                'modified' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => \Cake\Utility\Text::uuid(),
                'scope' => 'adminLte',
                'name' => 'CakePHPAdminLTE.copyright',
                'human_name' => 'Copyright',
                'value' => '<strong>Copyright &copy;</strong> <a href="https://github.com/diego182/CakePHP-AdminLTE">CakePHP AdminLTE</a>.',
                'description' => 'Copyright',
                'sort_order' => $i++,
                'created' => date('Y-m-d H:i:s'),
                'modified' => date('Y-m-d H:i:s'),
            ],
        ];

        $table = $this->table('settings');
        $table->insert($data)->save();
    }
}
