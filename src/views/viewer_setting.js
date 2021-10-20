const settings3D = {
    select_color: 0x0088fe, // 选中物体的颜色
    repair_color: 0xf26a07, // 设置物体维修状态时的颜色
    link_color: 0x00434D, // 普通状态下传感器与ipt盒子之间蚂蚁线的颜色
    link_color_ipt: 0x9370DB, // 普通状态下ipt盒子与报警器之间蚂蚁线的颜色
    link_select: 0x1E90FF, // 选中状态下传感器与ipt盒子之间蚂蚁线的颜色
    link_select_ipt: 0x1E90FF, // 选中状态下ipt盒子与报警器之间蚂蚁线的颜色
    link_opacity: 0.3, // 所有蚂蚁线外部管的透明度
    link_width: 2.0, // 蚂蚁线的宽度 1.0 - 5.0
    link_speed: 0.4, // 蚂蚁线速度， 0.1-2.0之间
    body_opacity: 0.3, // 设备本身的透明度
    camera_distance: 1000, // 值越大相机与模型相距越远，模型看起来越小，建议增量步长50
}

export {settings3D};