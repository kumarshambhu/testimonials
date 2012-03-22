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
 * @copyright   Copyright 2008-2012 Axis
 * @license     GNU Public License V3.0
 */

var TestimonialWindow = {

    el: null,

    form: null,

    show: function() {
        TestimonialWindow.el.show();
    },

    hide: function() {
        TestimonialWindow.el.hide();
    },

    save: function(closeWindow) {
        TestimonialWindow.form.getForm().submit({
            url    : Axis.getUrl('testimonials/index/save'),
            success: function(form, action) {
                TestimonialGrid.reload();
                if (closeWindow) {
                    TestimonialWindow.hide();
                    TestimonialWindow.form.getForm().clear();
                } else {
                    var response = Ext.decode(action.response.responseText);
                    Testimonial.load(response.data.id);
                }
            },
            failure: function(form, action) {
                if (action.failureType == 'client') {
                    return;
                }
            }
        });
    }

};

Ext.onReady(function() {

    var fields = [
        {name: 'testimonial[id]', type: 'int', mapping: 'id'},
        {name: 'testimonial[site_id]', type: 'int', mapping: 'site_id'},
        {name: 'testimonial[content]', mapping: 'content'},
        {name: 'testimonial[author]', mapping: 'author'},
        {name: 'testimonial[date_posted]', type: 'date', dateFormat: 'Y-m-d H:i:s', mapping: 'date_posted'},
        {name: 'testimonial[is_active]', type: 'int', mapping: 'is_active'}
    ];

    var siteCombo = Ext.getCmp('combobox-site').cloneConfig({
        fieldLabel  : 'Site'.l(),
        name        : 'testimonial[site_id]',
        hiddenName  : 'testimonial[site_id]',
        editable    : false,
        anchor      : '100%',
        initialValue: sites[0].id // see index.phtml
    });

    TestimonialWindow.form = new Axis.FormPanel({
        bodyStyle: 'padding: 10px 10px 0;',
        method   : 'post',
        reader   : new Ext.data.JsonReader({
            root      : 'data',
            idProperty: 'id'
        }, fields),
        defaults: {
            anchor: '100%'
        },
        items: [{
            layout: 'column',
            border: false,
            defaults: {
                layout     : 'form',
                columnWidth: .5,
                border     : false
            },
            items: [{
                items: [{
                    anchor    : '-10',
                    allowBlank: false,
                    fieldLabel: 'Author'.l(),
                    xtype     : 'textfield',
                    name      : 'testimonial[author]',
                }]
            }, {
                items: [{
                    anchor      : '100%',
                    fieldLabel  : 'Date'.l(),
                    xtype       : 'datefield',
                    editable    : false,
                    initialValue: new Date(),
                    name        : 'testimonial[date_posted]'
                }]
            }]
        }, {
            layout: 'column',
            border: false,
            defaults: {
                layout     : 'form',
                columnWidth: .5,
                border     : false
            },
            items: [{
                items: [{
                    columns     : [100, 100],
                    fieldLabel  : 'Status'.l(),
                    name        : 'testimonial[is_active]',
                    xtype       : 'radiogroup',
                    initialValue: 1,
                    items       : [{
                        boxLabel  : 'Enabled'.l(),
                        checked   : true,
                        name      : 'testimonial[is_active]',
                        inputValue: 1
                    }, {
                        boxLabel  : 'Disabled'.l(),
                        name      : 'testimonial[is_active]',
                        inputValue: 0
                    }]
                }]
            }, {
                items: [siteCombo]
            }]
        }, {
            fieldLabel: 'Content'.l(),
            xtype     : 'ckeditor', // see index.phtml
            name      : 'testimonial[content]',
            height    : 170,
            allowBlank: false
        }, {
            xtype: 'hidden',
            name : 'testimonial[id]'
        }]
    });

    TestimonialWindow.el = new Axis.Window({
        title  : 'Testimonial'.l(),
        items  : TestimonialWindow.form,
        height : 470,
        buttons: [{
            icon   : Axis.skinUrl + '/images/icons/database_save.png',
            text   : 'Save'.l(),
            handler: function() {
                TestimonialWindow.save(true);
            }
        }, {
            icon   : Axis.skinUrl + '/images/icons/database_save.png',
            text   : 'Save & Continue Edit'.l(),
            handler: function() {
                TestimonialWindow.save(false);
            }
        }, {
            icon   : Axis.skinUrl + '/images/icons/cancel.png',
            text   : 'Cancel'.l(),
            handler: TestimonialWindow.hide
        }]
    });
});
