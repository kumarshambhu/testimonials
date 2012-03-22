<?php
/**
 * Axis
 *
 * This file is part of Axis.
 *
 * Axis is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Axis is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Axis.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @category    Example
 * @package     Example_Testimonials
 * @copyright   Copyright 2008-2012 Axis
 * @license     GNU Public License V3.0
 */

class Example_Testimonials_Upgrade_1_0_0 extends Axis_Core_Model_Migration_Abstract
{
    protected $_version = '1.0.0';
    protected $_info = 'install';

    public function up()
    {
        $installer = Axis::single('install/installer');

        $installer->run("

        -- DROP TABLE IF EXISTS `{$installer->getTable('testimonials')}`;
        CREATE TABLE IF NOT EXISTS `{$installer->getTable('testimonials')}` (
            `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
            `site_id` SMALLINT(5) UNSIGNED DEFAULT NULL,
            `content` TEXT NOT NULL,
            `author` VARCHAR(32) NOT NULL DEFAULT '',
            `date_posted` DATETIME NOT NULL,
            `is_active` TINYINT(1) UNSIGNED NOT NULL DEFAULT 1,
            PRIMARY KEY (`id`),
            INDEX `IDX_TESTIMONIALS_DATE_POSTED` (`date_posted`),
            INDEX `IDX_TESTIMONIALS_IS_ACTIVE` USING HASH(`is_active`),
            CONSTRAINT `FK_TESTIMONIALS_SITE` FOREIGN KEY (`site_id`)
                REFERENCES `{$installer->getTable('core_site')}` (`id`)
                    ON DELETE SET NULL
                    ON UPDATE CASCADE
        ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

        ");

        Axis::single('core/page')
            ->add('testimonials/*/*')
            ->add('testimonials/index/*')
            ->add('testimonials/index/index');
    }

    public function down()
    {
        $installer = Axis::single('install/installer');

        $installer->run("

        DROP TABLE IF EXISTS `{$installer->getTable('testimonials')}`;

        ");

        Axis::single('core/page')
            ->remove('testimonials/*/*')
            ->remove('testimonials/index/*')
            ->remove('testimonials/index/index');
    }
}
