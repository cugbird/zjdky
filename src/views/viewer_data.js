const byq_relation_trees = [
    {
        name: '雾汇聚桥节点1',
        children: [
            {
                name: '特高频局放IPT节点A',
                type: '特高频局放',
                children: [
                    {name: '特高频局放传感器1'},
                    {name: '特高频局放传感器2'},
                ]
            },
            {
                name: '特高频局放IPT节点B',
                type: '特高频局放',
                children: [
                    {name: '特高频局放传感器3'},
                    {name: '特高频局放传感器4'},
                ]
            },
            {
                name: '高频局放IPT节点A',
                type: '高频局放',
                children: [
                    {name: '高频局放传感器1'},
                ]
            },
            {
                name: '高频局放IPT节点B',
                type: '高频局放',
                children: [
                    {name: '高频局放传感器2'},
                ]
            },
            {
                name: '超声局放IPT节点A',
                type: '超声局放',
                children: [
                    {name: '超声局放传感器1'},
                ]
            },
            {
                name: '超声局放IPT节点B',
                type: '超声局放',
                children: [
                    {name: '超声局放传感器2'},
                ]
            },
            {
                name: '超声局放IPT节点C',
                type: '超声局放',
                children: [
                    {name: '超声局放传感器3'},
                ]
            },
            {
                name: '铁芯接地电流IPT节点',
                type: '接地电流',
                children: [
                    {name: '铁芯接地电流传感器1'},
                    {name: '铁芯接地电流传感器2'},
                ]
            },
            {
                name: '温度IPT节点A',
                type: '温度',
                children: [
                    {name: '温度传感器1'},
                ]
            },
            {
                name: '振动IPT节点A',
                type: '振动',
                children: [
                    {name: '振动传感器1'},
                    {name: '振动传感器2'},
                ]
            },
            {
                name: '振动IPT节点B',
                type: '振动',
                children: [
                    {name: '振动传感器3'},
                    {name: '振动传感器4'},
                ]
            },
        ],
        children_ipt: [
            {
                name: 'line1',
                children: [
                    // 补缺失的线 start
                    {name: '雾汇聚桥节点2'},
                    // 补缺失的线 end
                    {name: '特高频局放IPT节点D'},
                    {name: '雾汇聚报警节点2'},
                    // 位置更换 start
                    // {name: '高频局放IPT节点C'},
                    {name: '夹件接地电流IPT节点'},
                    // 位置更换 end
                    {name: '高频局放IPT节点B'},
                    {name: '直流电源节点2'},
                    {name: '超声局放IPT节点F'},
                    {name: '超声局放IPT节点E'},
                    {name: '超声局放IPT节点D'},
                    // 位置更换 start
                    // {name: '夹件接地电流IPT节点'},
                    // 位置更换 end
                    {name: '高频局放IPT节点C'},
                    {name: '特高频局放IPT节点B'},
                    {name: '铁芯接地电流IPT节点'},
                    {name: '雾汇聚桥节点1'},
                ]
            },
            {
                name: 'line2',
                children: [
                    {name: '雾汇聚桥节点2'},
                    {name: '温度IPT节点B'},
                    {name: '振动IPT节点D'},
                    {name: '温度IPT节点A'},
                    {name: '振动IPT节点C'},
                    {name: '特高频局放IPT节点C'},
                    {name: '超声局放IPT节点B'},
                    {name: '超声局放IPT节点A'},
                    {name: '直流电源节点1'},
                    {name: '超声局放IPT节点C'},
                    {name: '高频局放IPT节点A'},
                    {name: '雾汇聚报警节点1'},
                    {name: '特高频局放IPT节点A'},
                    {name: '振动IPT节点A'},
                    {name: '振动IPT节点B'},
                    {name: '雾汇聚桥节点1'},
                ]
            }
        ]
    },
    {
        name: '雾汇聚桥节点2',
        children: [
            {
                name: '特高频局放IPT节点C',
                type: '特高频局放',
                children: [
                    {name: '特高频局放传感器5'},
                    {name: '特高频局放传感器6'},
                ]
            },
            {
                name: '特高频局放IPT节点D',
                type: '特高频局放',
                children: [
                    {name: '特高频局放传感器7'},
                ]
            },
            {
                name: '高频局放IPT节点C',
                type: '高频局放',
                children: [
                    {name: '高频局放传感器3'},
                ]
            },
            {
                name: '超声局放IPT节点D',
                type: '超声局放',
                children: [
                    {name: '超声局放传感器4'},
                ]
            },
            {
                name: '超声局放IPT节点E',
                type: '超声局放',
                children: [
                    {name: '超声局放传感器5'},
                ]
            },
            {
                name: '超声局放IPT节点F',
                type: '超声局放',
                children: [
                    {name: '超声局放传感器6'},
                ]
            },
            {
                name: '夹件接地电流IPT节点',
                type: '接地电流',
                children: [
                    {name: '夹件接地电流传感器1'},
                    {name: '夹件接地电流传感器2'},
                ]
            },
            {
                name: '温度IPT节点B',
                type: '温度',
                children: [
                    {name: '温度传感器2'},
                ]
            },
            {
                name: '振动IPT节点C',
                type: '振动',
                children: [
                    {name: '振动传感器5'},
                    {name: '振动传感器6'},
                ]
            },
            {
                name: '振动IPT节点D',
                type: '振动',
                children: [
                    {name: '振动传感器7'},
                    {name: '振动传感器8'},
                ]
            },
        ],
        children_ipt: [
            {
                name: 'line1',
                children: [
                    {name: '雾汇聚桥节点1'},
                    {name: '铁芯接地电流IPT节点'},
                    {name: '特高频局放IPT节点B'},
                    // 位置更换 start
                    // {name: '夹件接地电流IPT节点'},
                    {name: '高频局放IPT节点C'},
                    // 位置更换 end
                    {name: '超声局放IPT节点D'},
                    {name: '超声局放IPT节点E'},
                    {name: '超声局放IPT节点F'},
                    {name: '直流电源节点2'},
                    {name: '高频局放IPT节点B'},
                    // 位置更换 start
                    // {name: '高频局放IPT节点C'},
                    // 位置更换 end
                    {name: '夹件接地电流IPT节点'},
                    {name: '雾汇聚报警节点2'},
                    {name: '特高频局放IPT节点D'},
                    {name: '雾汇聚桥节点2'},
                ]
            },
            {
                name: 'line2',
                children: [
                    {name: '雾汇聚桥节点1'},
                    {name: '振动IPT节点B'},
                    {name: '振动IPT节点A'},
                    {name: '特高频局放IPT节点A'},
                    {name: '雾汇聚报警节点1'},
                    {name: '高频局放IPT节点A'},
                    {name: '超声局放IPT节点C'},
                    {name: '直流电源节点1'},
                    {name: '超声局放IPT节点A'},
                    {name: '超声局放IPT节点B'},
                    {name: '特高频局放IPT节点C'},
                    {name: '振动IPT节点C'},
                    {name: '温度IPT节点A'},
                    {name: '振动IPT节点D'},
                    {name: '温度IPT节点B'},
                    {name: '雾汇聚桥节点2'},
                ]
            }
        ]
    }
]

const byq_select_items = ['雾汇聚报警节点1','雾汇聚报警节点2','雾汇聚桥节点1','雾汇聚桥节点2','直流电源节点1','直流电源节点2'];
for (let i = 0; i < byq_relation_trees.length; ++i) {
    const item_level_1 = byq_relation_trees[i];
    for (let j = 0; j < item_level_1.children.length; ++j) {
        const item_level_2 = item_level_1.children[j];
        byq_select_items.push(item_level_2.name);
        for (let k = 0; k < item_level_2.children.length; ++k) {
            const item_level_3 = item_level_2.children[k];
            byq_select_items.push(item_level_3.name);
        }
    }
}

const gis_relation_trees = [
    {
        name: '雾汇聚桥节点1',
        children: [
            {
                name: '特高频局放IPT节点A',
                type: '特高频局放',
                children: [
                    {name: '特高频局放传感器1'}
                ]
            },
            {
                name: '特高频局放IPT节点B',
                type: '特高频局放',
                children: [
                    {name: '特高频局放传感器2'}
                ]
            },
            {
                name: '特高频局放IPT节点C',
                type: '特高频局放',
                children: [
                    {name: '特高频局放传感器3'}
                ]
            },
            {
                name: '特高频局放IPT节点D',
                type: '特高频局放',
                children: [
                    {name: '特高频局放传感器4'}
                ]
            },
        ],
        children_ipt: [
            {
                name: 'line1',
                children: [
                    {name: '直流电源节点2'},
                    {name: '特高频局放IPT节点I'},
                    {name: '特高频局放IPT节点H'},
                    {name: '特高频局放IPT节点G'},
                    {name: '特高频局放IPT节点F'},
                    {name: '特高频局放IPT节点E'},
                    {name: '雾汇聚报警节点2'},
                    {name: '特高频局放IPT节点D'},
                    {name: '特高频局放IPT节点C'},
                    {name: '特高频局放IPT节点B'},
                    {name: '特高频局放IPT节点A'},
                    {name: '直流电源节点1'},
                    {name: '雾汇聚报警节点1'},
                    {name: '雾汇聚桥节点1'},
                ]
            }
        ]
    },
    {
        name: '雾汇聚桥节点2',
        children: [
            {
                name: '特高频局放IPT节点E',
                type: '特高频局放',
                children: [
                    {name: '特高频局放传感器5'}
                ]
            },
            {
                name: '特高频局放IPT节点F',
                type: '特高频局放',
                children: [
                    {name: '特高频局放传感器6'}
                ]
            },
            {
                name: '特高频局放IPT节点G',
                type: '特高频局放',
                children: [
                    {name: '特高频局放传感器7'}
                ]
            },
            {
                name: '特高频局放IPT节点H',
                type: '特高频局放',
                children: [
                    {name: '特高频局放传感器8'}
                ]
            },
            {
                name: '特高频局放IPT节点I',
                type: '特高频局放',
                children: [
                    {name: '特高频局放传感器9'}
                ]
            },
        ],
        children_ipt: [
            {
                name: 'line1',
                children: [
                    {name: '雾汇聚报警节点1'},
                    {name: '直流电源节点1'},
                    {name: '特高频局放IPT节点A'},
                    {name: '特高频局放IPT节点B'},
                    {name: '雾汇聚桥节点2'},
                ]
            },
            {
                name: 'line2',
                children: [
                    {name: '直流电源节点2'},
                    {name: '特高频局放IPT节点I'},
                    {name: '特高频局放IPT节点H'},
                    {name: '特高频局放IPT节点G'},
                    {name: '特高频局放IPT节点F'},
                    {name: '特高频局放IPT节点E'},
                    {name: '雾汇聚报警节点2'},
                    {name: '特高频局放IPT节点D'},
                    {name: '特高频局放IPT节点C'},
                    {name: '雾汇聚桥节点2'},
                ]
            }
        ]
    }
]
const gis_select_items = ['雾汇聚报警节点1','雾汇聚报警节点2','雾汇聚桥节点1','雾汇聚桥节点2','直流电源节点1','直流电源节点2'];
for (let i = 0; i < gis_relation_trees.length; ++i) {
    const item_level_1 = gis_relation_trees[i];
    for (let j = 0; j < item_level_1.children.length; ++j) {
        const item_level_2 = item_level_1.children[j];
        gis_select_items.push(item_level_2.name);
        for (let k = 0; k < item_level_2.children.length; ++k) {
            const item_level_3 = item_level_2.children[k];
            gis_select_items.push(item_level_3.name);
        }
    }
}

const byq_name_code_list = [
    {name: '雾汇聚报警节点1', code: 'TRA_B_A'},
    {name: '雾汇聚报警节点2', code: 'TRA_B_B'},
    {name: '雾汇聚桥节点1', code: 'TRA_B_A'},
    {name: '雾汇聚桥节点2', code: 'TRA_B_B'},
    {name: '特高频局放IPT节点A', code: 'IPT_TRA_TGPJF_A'},
    {name: '特高频局放IPT节点B', code: 'IPT_TRA_TGPJF_B'},
    {name: '特高频局放IPT节点C', code: 'IPT_TRA_TGPJF_C'},
    {name: '特高频局放IPT节点D', code: 'IPT_TRA_TGPJF_D'},
    {name: '高频局放IPT节点A', code: 'IPT_TRA_GPJF_A'},
    {name: '高频局放IPT节点B', code: 'IPT_TRA_GPJF_B'},
    {name: '高频局放IPT节点C', code: 'IPT_TRA_GPJF_C'},
    {name: '超声局放IPT节点A', code: 'IPT_TRA_CSJF_A'},
    {name: '超声局放IPT节点B', code: 'IPT_TRA_CSJF_B'},
    {name: '超声局放IPT节点C', code: 'IPT_TRA_CSJF_C'},
    {name: '超声局放IPT节点D', code: 'IPT_TRA_CSJF_D'},
    {name: '超声局放IPT节点E', code: 'IPT_TRA_CSJF_E'},
    {name: '超声局放IPT节点F', code: 'IPT_TRA_CSJF_F'},
    {name: '铁芯接地电流IPT节点', code: 'IPT_TRA_TXJDDL'},
    {name: '夹件接地电流IPT节点', code: 'IPT_TRA_JJJDDL'},
    {name: '温度IPT节点A', code: 'IPT_TRA_WD_A'},
    {name: '温度IPT节点B', code: 'IPT_TRA_WD_B'},
    {name: '振动IPT节点A', code: 'IPT_TRA_ZD_A'},
    {name: '振动IPT节点B', code: 'IPT_TRA_ZD_B'},
    {name: '振动IPT节点C', code: 'IPT_TRA_ZD_C'},
    {name: '振动IPT节点D', code: 'IPT_TRA_ZD_D'},
    {name: '特高频局放传感器1', code: 'IPT_TRA_TGPJF_1'},
    {name: '特高频局放传感器2', code: 'IPT_TRA_TGPJF_2'},
    {name: '特高频局放传感器3', code: 'IPT_TRA_TGPJF_3'},
    {name: '特高频局放传感器4', code: 'IPT_TRA_TGPJF_4'},
    {name: '特高频局放传感器5', code: 'IPT_TRA_TGPJF_5'},
    {name: '特高频局放传感器6', code: 'IPT_TRA_TGPJF_6'},
    {name: '特高频局放传感器7', code: 'IPT_TRA_TGPJF_7'},
    {name: '高频局放传感器1', code: 'IPT_TRA_GPJF_1'},
    {name: '高频局放传感器2', code: 'IPT_TRA_GPJF_2'},
    {name: '高频局放传感器3', code: 'IPT_TRA_GPJF_3'},
    {name: '超声局放传感器1', code: 'IPT_TRA_CSJF_1'},
    {name: '超声局放传感器2', code: 'IPT_TRA_CSJF_2'},
    {name: '超声局放传感器3', code: 'IPT_TRA_CSJF_3'},
    {name: '超声局放传感器4', code: 'IPT_TRA_CSJF_4'},
    {name: '超声局放传感器5', code: 'IPT_TRA_CSJF_5'},
    {name: '超声局放传感器6', code: 'IPT_TRA_CSJF_6'},
    {name: '铁芯接地电流传感器1', code: 'IPT_TRA_TXJDDL_1'},
    {name: '铁芯接地电流传感器2', code: 'IPT_TRA_TXJDDL_2'},
    {name: '夹件接地电流传感器1', code: 'IPT_TRA_JJJDDL_1'},
    {name: '夹件接地电流传感器2', code: 'IPT_TRA_JJJDDL_2'},
    {name: '温度传感器1', code: 'IPT_TRA_WD_1'},
    {name: '温度传感器2', code: 'IPT_TRA_WD_2'},
    {name: '振动传感器1', code: 'IPT_TRA_ZD_1'},
    {name: '振动传感器2', code: 'IPT_TRA_ZD_2'},
    {name: '振动传感器3', code: 'IPT_TRA_ZD_3'},
    {name: '振动传感器4', code: 'IPT_TRA_ZD_4'},
    {name: '振动传感器5', code: 'IPT_TRA_ZD_5'},
    {name: '振动传感器6', code: 'IPT_TRA_ZD_6'},
    {name: '振动传感器7', code: 'IPT_TRA_ZD_7'},
    {name: '振动传感器8', code: 'IPT_TRA_ZD_8'},
]

const gis_name_code_list = [
    {name: '雾汇聚桥节点1', code: 'TRA_B_A'},
    {name: '雾汇聚桥节点2', code: 'TRA_B_B'},
    {name: '特高频局放IPT节点A', code: 'IPT_GIS_TGPJF_A'},
    {name: '特高频局放IPT节点B', code: 'IPT_GIS_TGPJF_B'},
    {name: '特高频局放IPT节点C', code: 'IPT_GIS_TGPJF_C'},
    {name: '特高频局放IPT节点D', code: 'IPT_GIS_TGPJF_D'},
    {name: '特高频局放IPT节点E', code: 'IPT_GIS_TGPJF_E'},
    {name: '特高频局放IPT节点F', code: 'IPT_GIS_TGPJF_F'},
    {name: '特高频局放IPT节点G', code: 'IPT_GIS_TGPJF_G'},
    {name: '特高频局放IPT节点H', code: 'IPT_GIS_TGPJF_H'},
    {name: '特高频局放IPT节点I', code: 'IPT_GIS_TGPJF_I'},
    {name: '特高频局放传感器1', code: 'IPT_GIS_TGPJF_1'},
    {name: '特高频局放传感器2', code: 'IPT_GIS_TGPJF_2'},
    {name: '特高频局放传感器3', code: 'IPT_GIS_TGPJF_3'},
    {name: '特高频局放传感器4', code: 'IPT_GIS_TGPJF_4'},
    {name: '特高频局放传感器5', code: 'IPT_GIS_TGPJF_5'},
    {name: '特高频局放传感器6', code: 'IPT_GIS_TGPJF_6'},
    {name: '特高频局放传感器7', code: 'IPT_GIS_TGPJF_7'},
    {name: '特高频局放传感器8', code: 'IPT_GIS_TGPJF_8'},
    {name: '特高频局放传感器9', code: 'IPT_GIS_TGPJF_9'},
]

export {byq_relation_trees, byq_select_items, gis_relation_trees, gis_select_items, byq_name_code_list, gis_name_code_list};