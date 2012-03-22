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

/**
 * @category    Example
 * @package     Example_Testimonials
 * @subpackage  Example_Testimonials_Admin_Controller
 * @author      Axis Core Team <core@axiscommerce.com>
 */
class Example_Testimonials_Admin_IndexController extends Axis_Admin_Controller_Back
{
    public function indexAction()
    {
        $this->view->pageTitle = Axis::translate('Example_Testimonials')->__(
            'Testimonials'
        );
        $this->view->sites = Axis::model('core/site')->select()->fetchAll();

        $this->render();
    }

    public function listAction()
    {
        $select = Axis::model('example_testimonials/testimonials')->select('*')
            ->calcFoundRows()
            ->addFilters($this->_getParam('filter', array()))
            ->limit(
                $this->_getParam('limit', 25),
                $this->_getParam('start', 0)
            )
            ->order(
                $this->_getParam('sort', 'id')
                . ' '
                . $this->_getParam('dir', 'DESC')
            );

        $this->_helper->json
            ->setData($select->fetchAll())
            ->setCount($select->foundRows())
            ->sendSuccess();
    }

    public function loadAction()
    {
        $row = Axis::model('example_testimonials/testimonials')
            ->find($this->_getParam('id'))
            ->current();

        if (!$row) {
            Axis::message()->addError(
                Axis::translate('core')->__(
                    'Record %s not found', $this->_getParam('id', 0)
                )
            );
            return $this->_helper->json->sendFailure();
        }

        $this->_helper->json
            ->setData($row->toArray())
            ->sendSuccess();
    }

    public function saveAction()
    {
        $row = Axis::model('example_testimonials/testimonials')
            ->getRow($this->_getParam('testimonial'));
        $row->save();

        Axis::message()->addSuccess(
            Axis::translate('core')->__(
                'Data was saved successfully'
            )
        );
        $this->_helper->json
            ->setData(array(
                'id' => $row->id
            ))
            ->sendSuccess();
    }

    public function batchSaveAction()
    {
        $dataset = Zend_Json::decode($this->_getParam('data'));
        $mTestimonials = Axis::model('example_testimonials/testimonials');
        foreach ($dataset as $data) {
            $mTestimonials->getRow($data)->save();
        }
        $this->_helper->json->sendSuccess();
    }

    public function removeAction()
    {
        $data = Zend_Json::decode($this->_getParam('data'));
        Axis::single('example_testimonials/testimonials')->delete(
            $this->db->quoteInto('id IN (?)', $data)
        );
        $this->_helper->json->sendSuccess();
    }
}
