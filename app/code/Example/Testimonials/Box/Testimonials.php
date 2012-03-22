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
 * @subpackage  Example_Testimonials_Box
 * @copyright   Copyright 2008-2012 Axis
 * @license     GNU Public License V3.0
 */

/**
 *
 * @category    Example
 * @package     Example_Testimonials
 * @subpackage  Example_Testimonials_Box
 * @author      Axis Core Team <core@axiscommerce.com>
 * @abstract
 */
class Example_Testimonials_Box_Testimonials extends Axis_Core_Box_Abstract
{
    protected $_title = 'Client Testimonials';
    protected $_class = 'box-testimonials';
    protected $_count = 10;
    protected $_disableWrapper = true;

    protected function _construct()
    {
        $this->getView()->headLink()->appendStylesheet('testimonials.css');
    }

    protected function _beforeRender()
    {
         $select = Axis::model('example_testimonials/testimonials')
            ->select()
            ->where('site_id = ?', Axis::getSiteId())
            ->where('is_active = 1')
            ->order('date_posted DESC')
            ->limit($this->getCount());

        if (!empty($this->id)) {
            $select->where('id = ?', $this->id);
        }

        $this->testimonials = $select->fetchAll();
    }

    public function getCount()
    {
        if (!is_numeric($this->count)) {
            return $this->_count;
        }
        return $this->count;
    }

    public function getConfigurationFields()
    {
        return array(
            'count' => array(
                'fieldLabel'   => Axis::translate('example_testimonials')->__('Testimonials Count'),
                'xtype'        => 'numberfield',
                'initialValue' => $this->_count
            ),
            'id' => array(
                'fieldLabel'   => Axis::translate('example_testimonials')->__('Testimonial Id'),
                'xtype'        => 'numberfield'
            )
        );
    }

    protected function _getCacheKeyParams()
    {
        return array(
            $this->getCount(),
            $this->id
        );
    }
}
