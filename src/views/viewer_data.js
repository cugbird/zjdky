const byq_relation_trees = [
    {
        name: '雾汇聚报警节点1',
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
        ]
    },
    {
        name: '雾汇聚报警节点2',
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
        ]
    }
]

const byq_select_items = [];
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
        name: '雾汇聚报警节点1',
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
        ]
    },
    {
        name: '雾汇聚报警节点2',
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
        ]
    }
]
const gis_select_items = [];
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

export {byq_relation_trees, byq_select_items, gis_relation_trees, gis_select_items};