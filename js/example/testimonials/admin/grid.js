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

var TestimonialGrid = {

    el: null,

    remove: function() {
        var selectedItems = TestimonialGrid.el.getSelectionModel().getSelections();
        if (!selectedItems.length || !confirm('Are you sure?'.l())) {
            return;
        }

        var data = {};
        for (var i = 0; i < selectedItems.length; i++) {
            data[i] = selectedItems[i].id;
        }
        Ext.Ajax.request({
            url: Axis.getUrl('testimonials/index/remove'),
            params: {
                data: Ext.encode(data)
            },
            callback: function() {
                TestimonialGrid.reload();
            }
        });
    },

    reload: function() {
        TestimonialGrid.el.getStore().reload();
    },

    save: function() {
        var modified = TestimonialGrid.el.getStore().getModifiedRecords();
        if (!modified.length) {
            return;
        }

        var data = {};
        for (var i = 0; i < modified.length; i++) {
            data[modified[i]['id']] = modified[i]['data'];
        }

        Ext.Ajax.request({
            url: Axis.getUrl('testimonials/index/batch-save'),
            params: {
                data: Ext.encode(data)
            },
            callback: function() {
                TestimonialGrid.el.getStore().commitChanges();
                TestimonialGrid.reload();
            }
        });
    }
};

Ext.onReady(function(){

    Ext.QuickTips.init();

    var ds = new Ext.data.Store({
        autoLoad: true,
        baseParams: {
            limit: 25
        },
        url: Axis.getUrl('testimonials/index/list'),
        reader: new Ext.data.JsonReader({
            totalProperty: 'count',
            root: 'data',
            id: 'id'
        }, [
            {name: 'id', type: 'int'},
            {name: 'site_id', type: 'int'},
            {name: 'content'},
            {name: 'author'},
            {name: 'date_posted', type: 'date', dateFormat: 'Y-m-d H:i:s'},
            {name: 'is_active', type: 'int'}
        ]),
        sortInfo: {
            field: 'id',
            direction: 'DESC'
        },
        remoteSort: true
    });

    var statusStore = new Ext.data.ArrayStore({
        data: [[0, 'Disabled'.l()], [1, 'Enabled'.l()]],
        fields: ['id', 'name']
    })

    var status = new Axis.grid.CheckColumn({
        header: 'Status'.l(),
        width: 80,
        dataIndex: 'is_active',
        filter: {
            // prependResetValue: false,
            editable: false,
            resetValue: 'reset',
            store: statusStore
        }
    });

    var siteCombo = new Ext.form.ComboBox({
        id            : 'combobox-site',
        editable      : false,
        typeAhead     : true,
        triggerAction : 'all',
        lazyRender    : true,
        mode          : 'local',
        valueField    : 'id',
        displayField  : 'name',
        forceSelection: false,
        store         : new Ext.data.JsonStore({
            local     : true,
            idProperty: 'id',
            fields    : ['id', 'name'],
            data      : sites // see index.phtml
        })
    });

    var cm = new Ext.grid.ColumnModel({
        defaults: {
            sortable: true
        },
        columns: [{
            header   : 'Id'.l(),
            dataIndex: 'id',
            width    : 90
        }, {
            header   : 'Author'.l(),
            dataIndex: 'author',
            id       : 'author',
            editor   : new Ext.form.TextField({
                allowBlank: false,
                maxLength : 32
            })
        }, {
            header   : 'Date'.l(),
            dataIndex: 'date_posted',
            editor   : new Ext.form.DateField(),
            width    : 120,
            renderer : function(v) {
                return Ext.util.Format.date(v)/* + ' ' + Ext.util.Format.date(v, 'H:i:s')*/;
            },
        }, {
            header   : 'Site'.l(),
            dataIndex: 'site_id',
            editor   : siteCombo,
            renderer : function(v) {
                var site = siteCombo.getStore().getById(v);
                return site ? site.get('name') : v;
            },
            filter   : {
                store: new Ext.data.JsonStore({
                    local     : true,
                    idProperty: 'id',
                    fields    : ['id', 'name'],
                    data      : sites // see index.phtml
                })
            }
        }, status]
    });

    TestimonialGrid.el = new Axis.grid.EditorGridPanel({
        autoExpandColumn: 'author',
        ds: ds,
        cm: cm,
        plugins: [
            status,
            new Axis.grid.Filter()
        ],
        tbar: [{
            text: 'Add'.l(),
            icon: Axis.skinUrl + '/images/icons/add.png',
            handler: Testimonial.add
        }, {
            text: 'Edit'.l(),
            icon: Axis.skinUrl + '/images/icons/page_edit.png',
            handler: function() {
                var selected = TestimonialGrid.el.getSelectionModel().getSelected();
                if (!selected) {
                    return;
                }
                Testimonial.load(selected.get('id'));
            }
        }, {
            text: 'Save'.l(),
            icon: Axis.skinUrl + '/images/icons/save_multiple.png',
            handler: TestimonialGrid.save
        }, {
            text: 'Delete'.l(),
            icon: Axis.skinUrl + '/images/icons/delete.png',
            handler: function() {
                TestimonialGrid.remove();
            }
        }, '->', {
            text: 'Reload'.l(),
            icon: Axis.skinUrl + '/images/icons/refresh.png',
            handler: TestimonialGrid.reload
        }],
        bbar: new Axis.PagingToolbar({
            store: ds
        })
    });

    TestimonialGrid.el.on('rowdblclick', function(grid, index, e) {
        Testimonial.load(grid.getStore().getAt(index).get('id'));
    });
});
