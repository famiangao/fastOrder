/**
 * @description:查询全部页码传参模板
 * @param {
 * pageSize 每页条数
 * pageNum 页码
 * order  排序 0 升序 1 降序
 * orderString  排序字符串
 * }
 * @return {*}
 */
export interface IQueryParams {
  pageSize: number | string;
  pageNum: number | string;
  order: number;
  orderString: string;
}

/**
 * @description:模糊查询数据模板
 * @param {
 * value 值
 * field 字段
 * }
 * @return {*}
 */
export interface IFuzzyQuery {
  value: string; // 模糊查询值
  field: string; // 模糊查询字段
}

/**
 * @description: 带条件的分页查询
 * @param {
 * data: 分页信息
 * msg: 模糊查询-字段：值
 * }
 * @return {*}
 */
export interface IPagingQueryByField {
  data: IQueryParams;
  msg: {
    [s: string]: string;
  };
}

/**
 * @description:系统资源模型-字段数据模板
 * @param {
 * system_id 系统类型id
 * system_name 系统类型名称
 * system_alias 系统类型别名
 * system_desc 系统类型描述
 * system_tree 系统资源树
 * system_status 系统资源树状态
 * create_time 创建时间
 * author 创建人
 * publish_time 发布时间
 * publisher 发布人
 * sortcode 排序码
 * del_flag 删除标志
 * }
 * @return {*}
 */
export interface ISysSystem {
  system_id: string;
  system_name: string;
  system_alias: string;
  system_desc: string;
  system_tree: string;
  system_status: string;
  create_time: string;
  author: string;
  publish_time: string;
  publisher: string;
  sortcode: string;
  del_flag: string;
}

/**
 * @description:系统资源树模板-字段数据模板
 * @param {
 * res_id 资源id
 * res_name 资源名称
 * res_uri 资源uri
 * res_type 资源类型
 * res_property_id 资源属性id
 * res_ref 资源引用
 * system_id 系统类型id
 * system_name 系统类型名称
 * del_flag 删除标志
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface ISystemRes {
  res_id: string;
  res_name: string;
  res_uri: string;
  res_type: string;
  res_property_id: string;
  res_ref: string;
  res_double_ref: string;
  system_id: string;
  system_name: string;
  del_flag: string;
  sortcode: string;
}

/**
 * @description: 系统节点配置 -字段数据模板
 * @param {
 * config_template_id 配置模板id
 * config_template_name 配置模板名称
 * res_id 资源id
 * config_id 配置id
 * config_name 配置名称
 * config_template_desc 配置模板描述
 * config_version 配置版本
 * condig_file_path 配置文件路径
 * system_id 系统类型id
 * system_name 系统类型名称
 * del_flag 删除标志
 * author 创建人
 * create_time 创建时间
 * publish_time 发布时间
 * publisher 发布人
 * publish_status 发布状态
 * sortcode 排序码
 * }
 * @return {*}
 */

export interface IResNodeConfig {
  config_template_id: string;
  config_template_name: string;
  res_id: string;
  config_id: string;
  config_name: string;
  config_template_desc: string;
  config_version: string;
  config_file_path: string;
  system_id: string;
  system_name: string;
  author: string;
  create_time: string;
  publish_time: string;
  publisher: string;
  publish_status: string;
  sortcode: string;
}

/**
 * @description:工程节点配置-字段数据模板
 * @param {
 * config_template_id 配置模板id
 * config_template_name 配置模板名字
 * config_template_desc 配置模板i描述
 * res_id 配置资源id
 * config_id 配置项id
 * config_name 配置项名称
 * config_file_path 配置文件路径
 * system_id 系统类型id
 * system_name 系统类型名称
 * config_version 版本
 * project_id 工程id
 * project_name 工程名称
 * del_flag 删除标志
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface ISysProjectConfig {
  config_template_id: string;
  config_template_name: string;
  config_template_desc: string;
  res_id: string;
  config_id: string;
  config_name: string;
  config_file_path: string;
  config_version: string;
  system_id: string;
  system_name: string;
  project_id: string;
  project_name: string;
  sortcode: string;
}

/**
 * @description:技术配套资源-字段数据模板
 * @param {
 * assort_id 技术配套id
 * system_tree 技术配套资源树
 * system_status 技术配套资源树状态
 * assort_type_id 技术配套类型id
 * assort_type_name 技术配套类型名称
 * system_id 系统类型id
 * system_name 系统类型名称
 * single_img 单架图
 * system_img 系统图
 * create_time 创建时间
 * publish_time 发布时间
 * author 创建人
 * publisher 发布人
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface ISysAssort {
  assort_id: string;
  system_tree: string;
  system_status: string;
  assort_type_id: string;
  assort_type_name: string;
  system_id: string;
  system_name: string;
  single_img: string;
  system_img: string;
  create_time: string;
  publish_time: string;
  author: string;
  publisher: string;
  sortcode: string;
}

/**
 * @description: 技术配套资源树模板-字段数据模板
 * @param {
 * assort_res_id 配套资源id
 * res_id 资源id
 * res_name 资源名称
 * res_uri 资源uri
 * res_property_id 资源属性id
 * res_type 资源类型
 * res_ref 资源引用
 * res_double_ref 资源双引用
 * assort_id 配套资源id
 * assort_name 配套资源名称
 * system_id 系统类型id
 * system_name 系统类型名称
 * del_flag 删除标志
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface ISysAssortRes {
  assort_res_id: string;
  res_id: string;
  res_name: string;
  res_uri: string;
  res_property_id: string;
  res_ref: string;
  res_double_ref: string;
  res_type: string;
  assort_id: string;
  assort_name: string;
  system_id: string;
  system_name: string;
  del_flag: string;
  sortcode: string;
}

/**
 * @description: 工程-字段数据模板
 * @param {
 * project_id 工程id
 * project_name 工程名称
 * project_desc 工程描述
 * project_res 工程资源
 * assort_id 技术配套id
 * assort_name 技术配套名称
 * system_id 系统类型id
 * system_name 系统类型名称
 * create_time 创建时间
 * author 创建人
 * del_flag 删除标志
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface ISysProject {
  project_id: string;
  project_name: string;
  project_desc: string;
  project_res: string;
  assort_id: string;
  assort_name: string;
  system_id: string;
  system_name: string;
  create_time: string;
  author: string;
  del_flag: string;
  sortcode: string;
}

/**
 * @description: 工程资源-字段数据模板
 * @param {
 * project_res_id 工程资源id
 * res_id 资源id
 * res_name 资源名称
 * res_uri 资源uri
 * res_property_id 资源属性id
 * res_ref 资源引用
 * res_double_ref 资源双引用
 * project_id 工程id
 * project_name 工程名称
 * assort_id 技术配套id
 * assort_name 技术配套名称
 * system_id 系统类型id
 * system_name 系统类型名称
 * del_flag 删除标志
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface ISysProjectRes {
  project_res_id: string;
  res_id: string;
  res_name: string;
  res_uri: string;
  res_property_id: string;
  res_ref: string;
  res_type: string;
  res_double_ref: string;
  project_id: string;
  project_name: string;
  assort_id: string;
  assort_name: string;
  system_id: string;
  system_name: string;
  del_flag: string;
  sortcode: string;
}

/**
 * @description:工程资源属性-字段数据模板
 * @param {
 * project_pro_id 工程资源属性id
 * project_id 工程id
 * res_id 资源id
 * res_name 资源名称
 * res_uri 资源uri
 * res_quantity 资源计划数量
 * res_found 资源发现数量
 * del_flag 删除标志
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface ISysProjectResProperty {
  project_pro_id: string;
  project_id: string;
  res_id: string;
  res_name: string;
  res_uri: string;
  res_quantity: string;
  res_found: string;
  del_flag: string;
  sortcode: string;
}

/**
 * @description: 工程发布-字段数据模板
 * @param {
 * publish_id 发布包id
 * project_id 工程id
 * project_name 工程名称
 * publish_list 发布包清单
 * publish_desc 发布包描述
 * pubilsh_version 发布包版本
 * publish_time 发布包时间
 * publish_status 发布包状态
 * del_flag 删除标志
 * publisher 发布人
 * }
 * @return {*}
 */
export interface IProjectPublish {
  publish_id: string;
  project_id: string;
  project_name: string;
  publish_list: string;
  publish_desc: string;
  pubilsh_version: string;
  publish_time: string;
  publish_status: string;
  del_flag: string;
  publisher: string;
}

/**
 * @description:技术配套类型模型-字段数据模板
 * @param {
 * assort_type_id 技术配套类型id
 * assort_type_name 技术配套类型名称
 * asssort_type_alias 技术配套类型别名
 * assort_type_desc 技术配套类型描述
 * assort_type_png 技术配套类型图片
 * del_flag 删除标志
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface IAssortTypeDict {
  assort_type_id: string;
  assort_type_name: string;
  assort_type_alias: string;
  assort_type_desc: string;
  assort_type_png: string;
  del_flag: string;
  sortcode: string;
}

/**
 * @description: 资源类型模型-字段数据模板
 * @param {
 * res_type_id 资源类型id
 * res_type_name 资源类型名称
 * res_type_alias 资源类型别名
 * res_type_desc 资源类型描述
 * res_type_classify 资源类型分类
 * res_type_code 资源类型编码
 * res_type_uri 资源类型uri
 * del_flag 删除标志
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface IResourceTypeDict {
  res_type_id?: string;
  res_type_name: string;
  res_type_alias: string;
  res_type_desc: string;
  res_type_classify: string;
  res_type_code: string;
  res_type_uri?: string;
  del_flag?: string;
  sortcode: string;
}

/**
 * @description:节点资源模型-字段数据模板
 * @param {
 * node_id 节点id
 * node_model 节点资源型号
 * node_alias 节点别名
 * res_type_id 资源类型id
 * res_type_name 资源类型名称
 * node_code 节点编码
 * node_desc 节点描述
 * del_flag 删除标志
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface INodeResourceDict {
  node_id: string;
  node_model: string;
  node_alias: string;
  res_type_id: string;
  res_type_name: string;
  node_desc: string;
  node_code: string;
  del_flag: string;
  sortcode: string;
}

/**
 * @description:模组资源模型-字段数据模板
 * @param {
 * module_id 模组id
 * module_module 模组型号
 * module_alias 模组别名
 * module_index 模组索引
 * module_desc 模组描述
 * res_type_id 资源类型id
 * res_type_name 资源类型名称
 * module_role 模组角色
 * module_uri 模组uri
 * code 模组编码
 * del_flag 删除标志
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface IModuleResourceDict {
  module_id: string;
  module_model: string;
  module_alias: string;
  module_index: string;
  module_desc: string;
  res_type_id: string;
  res_type_name: string;
  module_role: string;
  module_uri: string;
  code: string;
  sortcode: string;
  del_flag: String;
}

/**
 * @description:端口资源字典-字段数据模板
 * @param {
 * port_id 端口id
 * module_id 模组id
 * res_type_id 资源类型id
 * res_type_name 资源类型名称
 * port_name 端口名称
 * port_index 端口索引
 * port_type_id 端口类型id
 * port_uri 端口uri
 * port_desc 端口描述
 * del_flag 删除标志
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface IPortResDict {
  port_id: string;
  module_id: string;
  res_type_id: string;
  res_type_name: string;
  port_name: string;
  port_index: string;
  port_type_id: string;
  port_uri: string;
  port_desc: string;
  del_flag: string;
  sortcode: string;
}

/**
 * @description:外设模型-字段数据模板
 * @param {
 * device_model_id 外设模型id
 * device_model_name 外设模型名称
 * device_model_alias 外设模型别名
 * device_model_uri 外设模型uri
 * res_type_id 资源类型id
 * res_type_name 资源类型名称
 * res_type_code 资源类型编码
 * device_model_desc 外设模型描述
 * del_flag 删除标志
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface IDeviceModelDict {
  device_model_id: string;
  device_model_name: string;
  device_model_alias: string;
  device_model_uri: string;
  res_type_id: string;
  res_type_name: string;
  res_type_code: string;
  deivce_model_desc: string;
  del_flag: string;
  sortcode: string;
}

/**
 * @description: 节点配置字典-字段数据模板
 * @param {
 * config_id 配置id
 * config_name 配置名称
 * config_alias 配置别名
 * res_type_id 资源类型id
 * res_type_name 资源类型名称
 * config_desc 配置描述
 * config_uri 配置uri
 * config_key 配置编码
 * del_flag 删除标志
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface INodeConfigDict {
  config_id: string;
  config_name: string;
  config_alias: string;
  res_type_id: string;
  res_type_name: string;
  config_desc: string;
  config_uri: string;
  config_key: string;
  del_flag: string;
  sortcode: string;
}

/**
 * @description:厂商字典-字段数据模板
 * @param {
 * firm_id 厂商id
 * firm_name 厂商名称
 * firm_alias 厂商别名
 * firm_code 厂商编码
 * del_flag 删除标志
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface IFirmDict {
  firm_id: string;
  firm_name: string;
  firm_alias: string;
  firm_code: string;
  del_flag: string;
  sortcode: string;
}

/**
 * @description:端口类型字典模型-字段数据模板
 * @param {
 * port_type_id 端口协议类型
 * port_type_name 端口协议类型名称
 * port_type_alias 端口协议类型别名
 * port_type_desc 端口协议类型描述
 * port_type_code 端口协议类型编码
 * del_flag 删除标志
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface IPortTypeDict {
  port_type_id: string;
  port_type_name: string;
  port_type_alias: string;
  port_type_desc: string;
  port_type_code: string;
  del_flag: string;
  sortcode: string;
}

/**
 * @description: 外设规格模型-字段数据模板
 * @param {
 * device_spec_id 外设规格id
 * device_spec_name 外设规格名称
 * firm_id 厂商id
 * firm_name 厂商名称
 * res_type_id 资源类型id
 * res_type_name 资源类型名称
 * port_type_id 端口协议类型
 * port_type_name 端口协议类型名称
 * device_spec_signal_min 信号最小值
 * device_spec_signal_max 信号最大值
 * device_spec_baudrate 波特率
 * device_spec_img 图片
 * del_flag 删除标志
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface IDeviceSpecDict {
  device_spec_id: string;
  device_spec_name: string;
  firm_id: string;
  firm_name: string;
  res_type_id: string;
  res_type_name: string;
  port_type_id: string;
  port_type_name: string;
  device_spec_signal_min: string;
  device_spec_signal_max: string;
  device_spec_baudrate: string;
  device_spec_img: string;
  del_flag: string;
  sortcode: string;
}

/**
 * @description:OS-字段数据模板
 * @param {
 * os_id OSID
 * os_name OS名称
 * os_alias OS别名
 * os_uri OSuri
 * res_type_id 资源类型id
 * res_type_name 资源类型名称
 * os_desc OS描述
 * code OS编码
 * del_flag 删除标志
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface INodeOsSys {
  os_id: string;
  os_name: string;
  os_alias: string;
  os_uri: string;
  res_type_id: string;
  res_type_name: string;
  os_desc: string;
  code: string;
  del_flag: string;
  sortcode: string;
}

/**
 * @description: APP-字段数据模板
 * @param {
 * app_id APPID
 * app_name APP名称
 * app_alias APP别名
 * app_uri APPuri
 * res_type_id 资源类型id
 * res_type_name 资源类型名称
 * app_desc APP描述
 * code APP编码
 * del_flag 删除标志
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface INodeAppSys {
  app_id: string;
  app_name: string;
  app_alias: string;
  app_uri: string;
  res_type_id: string;
  res_type_name: string;
  app_desc: string;
  code: string;
  del_flag: string;
  sortcode: string;
}

/**
 * @description: 图片资源-字段数据模板
 * @param {
 * img_id 图片id
 * img_path 图片路径
 * purpose_id 用途id
 * purpose_name 用途名称
 * img_type 图片类型
 * project_id 项目id
 * project_name 项目名称
 * del_flag 删除标志
 * }
 * @return {*}
 */
export interface IImgResSys {
  img_id: string;
  img_path: string;
  purpose_id: string;
  purpose_name: string;
  img_type: string;
  project_id: string;
  project_name: string;
  del_flag: string;
}

/**
 * @description: 图片用途-字段数据模板
 * @param {
 * purpose_id 用途id
 * purpose_name 用途名称
 * purpose_alias 用途别名
 * purpose_desc 用途描述
 * del_flag 删除标志
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface IImgPurposeSys {
  purpose_id: string;
  purpose_name: string;
  purpose_alias: string;
  purpose_desc: string;
  del_flag: string;
  sortcode: string;
}

/**
 * @description:动作阶段-字段数据模板
 * @param {
 * stage_id 阶段id
 * stage_name 阶段名称
 * stage_alias 阶段别名
 * stage_desc 阶段描述
 * stage_code 阶段编码
 * action_id 阶段类型id
 * action_name 阶段类型名称
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface IActAutoStageDict {
  stage_id: string;
  stage_name: string;
  stage_alias: string;
  stage_desc: string;
  stage_code: string;
  action_id: string;
  action_name: string;
  sortcode: string;
}

/**
 * @description:支架基础动作模型
 * @param {
 * action_id 动作Id
 * action_name 动作名称
 * action_alias 动作别名
 * action_code 动作编码
 * action_type 动作类型
 * widget_id 部件Id
 * widget_name 部件名称
 * action_desc 动作描述
 * action_color 动作支架
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface IActSupportBasicDict {
  action_id: string;
  action_name: string;
  action_alias: string;
  action_code: string;
  action_type: string;
  widget_id: string;
  widget_name: string;
  action_desc: string;
  action_color: string;
  sortcode: string;
}

/**
 * @description:动作阶段-支架自动动作模型
 * @param {
 * action_id 动作Id
 * action_name 动作名称
 * action_alias 动作别名
 * action_code 动作编码
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface IActAutoSupportDict {
  action_id: string;
  action_name: string;
  action_alias: string;
  action_code: string;
  action_desc: string;
  equipment_type_id: string;
  equipment_type_name: string;
  action_color: string;
  sortcode: string;
}

/**
 * @description:动作阶段-支架部件模型
 * @param {
 * widget_id 部件Id
 * widget_code 部件编码
 * widget_name 部件名称
 * widget_alias 部件别名
 * action_desc 部件描述
 * equipment_type_id 设备类型id
 * widget_img 部件图片
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface ISupportWidgetDict {
  widget_id: string;
  widget_code: string;
  widget_name: string;
  widget_alias: string;
  widget_desc: string;
  equipment_type_id: string;
  widget_img: string;
  sortcode: string;
}

/**
 * @description:动作阶段-事件模型
 * @param {
 * event_id 部件Id
 * event_name 部件编码
 * event_alias 部件名称
 * event_shield_type 事件辅助类型
 * event_desc 部件描述
 * event_type 设备类型id
 * sortcode 排序码
 * item_id 事件类型id
 * event_expression 事件表达式
 * strategy_id 策略模型id
 * }
 * @return {*}
 */
export interface IActEventsDict {
  event_id: string;
  event_name: string;
  event_alias: string;
  event_shield_type: string;
  event_type: string | number;
  event_desc: string;
  event_expression: string;
  strategy_id: string;
  item_id: string;
  sortcode: string;
}

/**
 * @description:动作阶段-策略模型
 * @param {
 * strategy_id 策略Id
 * strategy_name 策略名称
 * strategy_alias 策略别名
 * strategy_desc 策略描述
 * strategy_type 策略类型
 * extra_data 额外数据
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface IActStrategyDict {
  strategy_id: string;
  strategy_name: string;
  strategy_alias: string;
  strategy_desc: string;
  strategy_type: string | number;
  item_id: string;
  extra_data: string;
  sortcode: string;
}

/**
 * @description:动作阶段-控制器参数模型
 * @param {
 * var_id 变量Id
 * var_name 变量名称
 * var_alias 变量别名
 * var_desc 变量描述
 * var_type 变量类型
 * min_value 最小值
 * max_value 最大值
 * default_value 默认值
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface IActVariableDict {
  var_id: string;
  var_name: string;
  var_alias: string;
  var_desc: string;
  var_type: string;
  min_value: string;
  max_value: string;
  default_value: string;
  sortcode: string;
}

/**
 * @description:动作阶段-配置类型模型
 * @param {
 * config_id 类型Id
 * config_name 类型名称
 * config_alias 类型别名
 * config_desc 类型描述
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface IActConfigTypeDict {
  config_id: string;
  config_name: string;
  config_alias: string;
  config_desc: string;
  sortcode: string;
}

/**
 * @description:动作阶段-配置类型枚举量
 * @param {
 * item_id 枚举项Id
 * item_name 枚举项名称
 * item_alias 枚举项别名
 * item_value 枚举项值
 * item_desc 枚举项描述
 * item_parent_ids 枚举项父级ids
 * autoconfig_type_id 枚举项类别Id
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface IActConfigEnumDict {
  item_id: string;
  item_name: string;
  item_alias: string;
  item_value: string;
  item_desc: string;
  item_parent_ids: string;
  parent_id: string;
  sortcode: string;
}

/**
 * @description:动作阶段-设备类型
 * @param {
 * equipment_type_id 设备类型Id
 * equipment_type_name 设备类型名称
 * equipment_type_alias 设备类型别名
 * equipment_type_code 设备类型编码
 * equipment_type_desc 设备类型描述
 * equipment_type_parent_id 设备父级Id
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface IEquipmentTypeDict {
  equipment_type_id: string;
  equipment_type_name: string;
  equipment_type_alias: string;
  equipment_type_code: string;
  equipment_type_desc: string;
  equipment_type_parent_id: string;
  sortcode: string;
}

/**
 * @description:端口字典-端口故障开关模型
 * @param {
 * id 故障Id
 * name 故障名称
 * alias 故障别名
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface IPortFaultsDict {
  id: string;
  name: string;
  alias: string;
  sortcode: string;
}

/**
 * @description:端口字典-端口预警开关模型
 * @param {
 * id 报警Id
 * name 报警名称
 * alias 报警别名
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface IPortWarnsDict {
  id: string;
  name: string;
  alias: string;
  sortcode: string;
}

/**
 * @description:端口字典-端口上报模型
 * @param {
 * id 上报模型Id
 * name 上报模型名称
 * alias 上报模型别名
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface IPortUploadmodelDict {
  id: string;
  name: string;
  alias: string;
  sortcode: string;
}

/**
 * @description:端口字典-数据屏蔽类型模型
 * @param {
 * id 数据屏蔽类型Id
 * name 数据屏蔽类型名称
 * alias 数据屏蔽类型别名
 * value 数据屏蔽类型值
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface IPortShieldtypeDict {
  id: string;
  name: string;
  alias: string;
  value: string;
  sortcode: string;
}

/**
 * @description:控制器字典-变量类型
 * @param {
 * params_type_id 参数用途Id
 * params_type_name 参数用途名称
 * params_type_alias 参数用途别名
 * params_type_code 参数用途描述
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface IControllParamsStyleDict {
  params_type_id: string;
  params_type_name: string;
  params_type_alias: string;
  params_type_code: string;
  sortcode: string;
}

/**
 * @description:控制器字典-系统函数
 * @param {
 * func_id 函数Id
 * func_name 函数名
 * func_alias 函数别名
 * func_desc 函数描述
 * params_num 参数个数
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface IDictSystemFunction {
  func_id: string;
  func_name: string;
  func_alias: string;
  func_desc: string;
  params_num: string;
  sortcode: string;
}

/**
 * @description:控制器字典-全局变量
 * @param {
 * param_id 参数Id
 * param_name 参数名称
 * param_alias 参数别名
 * param_scope_type 参数作用域
 * param_type_id 参数类型
 * min_value 最小值
 * max_value 最大值
 * default_value 默认值
 * param_desc 描述
 * sortcode 排序码
 * }
 * @return {*}
 */
export interface IControllParamsGlobalDict {
  param_id: string;
  param_name: string;
  param_alias: string;
  param_scope_type: string;
  param_type_id: string;
  min_value: string;
  max_value: string;
  default_value: string;
  param_desc: string;
  sortcode: string;
}
/**
 * @description: 跟机工艺
 * @return {
 * auto_process_id 自动工艺id
 * auto_process_name 自动工艺名称
 * auto_process_alias 自动工艺别名
 * auto_process_desc 自动工艺描述
 * system_id 系统id
 * sortcode 排序码
 * }
 */
export interface IAutoProcess {
  auto_process_id?: string;
  auto_process_name: string;
  auto_process_alias: string;
  auto_process_desc: string;
  system_id: string;
  sortcode: string;
}

/**
 * @description: 跟机阶段
 * @return {
 * stage_id 阶段id
 * stage_name 阶段名称
 * stage_alias 阶段别名
 * stage_desc 阶段描述
 * start_addr 开始位置
 * last_addr 结束位置
 * stage_expression 阶段表达式
 * forward_position 起始架
 * enable 阶段开关
 * stage_json_id:json中的阶段id
 * system_id 系统id
 * sortcode 排序码
 * }
 */
export interface IAutoStage {
  stage_id?: string;
  stage_name: string;
  stage_alias: string;
  stage_desc: string;
  start_addr: string;
  last_addr: string;
  stage_expression: string;
  forward_position: string;
  enable: string;
  stage_json_id: string;
  system_id: string;
  sortcode: string;
}

/**
 * @description: 区域策略
 * @return {
 * strategy_id 区域策略Id
 * strategy_name 区域策略名称
 * strategy_alias 区域策略别名
 * strategy_desc 区域策略描述
 * strategy_type_id 策略类型id
 * interval_time_value_type 间隔时间类型
 * interval_num 间隔架数
 * sliding_value_type 滑块大小类型
 * sliding_max_num 最大滑块数
 * step_num 步进架数
 * dir 方向
 * only_once 执行次数
 * action_time_out 通讯超时时间
 * interval_time 间隔时间
 * Sliding 滑块变量
 * system_id 系统id
 * sortcode 排序码
 * }
 */
export interface IAutoStrategies {
  strategy_id?: string;
  strategy_name: string;
  strategy_alias: string;
  strategy_desc: string;
  strategy_type_id: string;
  interval_time_value_type: string;
  interval_time: string;
  interval_num: string;
  sliding_value_type: string;
  sliding_max_num: string;
  step_num: string;
  dir: string;
  only_once: string;
  action_time_out: string;
  system_id: string;
  sortcode: string;
  sliding: string;
  IntervalTime: string;
}

/**
 * @description: 区域
 * @return {
 * area_id 区域id
 * area_name 区域名称
 * area_alias 区域别名
 * area_desc 区域描述
 * area_type 区域类型
 * area_process_type 区域工艺类型
 * area_expression 区域表达式
 * strategy_id 关联策略id
 * area_activitie_id 关联区域动作id
 * group_auto_id 成组定义id
 * start_addr 起始位置
 * last_addr 结束位置
 * system_id 系统id
 * sortcode 排序码
 * }
 */
export interface IAutoArea {
  area_id?: string;
  area_name: string;
  area_alias: string;
  area_desc: string;
  area_type: string;
  area_process_type: string;
  area_expression: string;
  strategy_id: string;
  area_activitie_id: string;
  group_auto_id: string;
  start_addr:string;
  last_addr:string;
  // enable: string;
  system_id: string;
  sortcode: string;
}

/**
 * @description:区域工艺对照
 * @return {
 * id id
 * stage_id 阶段id
 * auto_process_id 工艺id
 * }
 */
export interface IStagesProcesses{
  id:string,
  stage_id:string,
  auto_process_id:string
}

/**
 * @description:阶段区域对照
 * @return {
 * area_id 区域id
 * stage_id 策略id
 * }
 */
export interface IAutoAreaStage {
  area_id: string;
  stage_id: string;
}

/**
 * @description: 事件
 * @return {
 * event_id 事件id
 * event_name 事件名称
 * event_alias 事件别名
 * event_desc 事件描述
 * event_expression 事件表达式
 * auto_types 事件类型
 * trigger_position 触发
 * area_id 关联区域id
 * system_id 系统id
 * sortcode 排序码
 * }
 */
export interface IAutoEvent {
  event_id?: string;
  event_name: string;
  event_alias: string;
  event_desc: string;
  event_expression: string;
  auto_types: string;
  trigger_position: string;
  area_id: string;
  system_id: string;
  sortcode: string;
}

/**
 * @description: 事件触发类型
 * @return {
 * event_type_id 事件触发类型id
 * event_type_name 事件触发类型名称
 * event_type_alias 事件触发类型别名
 * event_type_desc 事件触发类型描述
 * event_type_value 事件触发类型值
 * system_id 系统id
 * sortcode 排序码
 * }
 */
export interface IAutoEventType {
  event_type_id?: string;
  event_type_name: string;
  event_type_alias: string;
  event_type_value: string;
  event_type_desc: string;
  system_id: string;
  sortcode: string;
}

/**
 * @description: 工艺类型
 * @return {
 * autos_type_id 工艺类型id
 * autos_type_name 工艺类型名称
 * autos_type_alias 工艺类型别名
 * autos_type_desc 工艺类型描述
 * autos_type_value   工艺类型值
 * system_id 系统id
 * sortcode 排序码
 * }
 */
export interface IAutoAutosType {
  autos_type_id?: string;
  autos_type_name: string;
  autos_type_alias: string;
  autos_type_value: string;
  autos_type_desc: string;
  system_id: string;
  sortcode: string;
}

/**
 * @description: 区域类型
 * @return {
 * area_type_id 区域类型id
 * area_type_name区域类型名称
 * area_type_alias 区域类型别名
 * area_type_desc 区域类型描述
 * area_type_value   区域类型值
 * system_id 系统id
 * sortcode 排序码
 * }
 */
export interface IAutoAreaType {
  area_type_id?: string;
  area_type_name: string;
  area_type_alias: string;
  area_type_value: string;
  area_type_desc: string;
  system_id: string;
  sortcode: string;
}

/**
 * @description: 自动跟机局部变量变量类型
 * @return {
 * variable_type_id 变量类型id
 * variable_type_name 变量类型名称
 * variable_type_alias 变量类型别名
 * variable_type_desc 变量类型描述
 * variable_type_value   变量类型值
 * system_id 系统id
 * sortcode 排序码
 * }
 */
export interface IAutoVariableType {
  variable_type_id?: string;
  variable_type_name: string;
  variable_type_alias: string;
  variable_type_value: string;
  variable_type_desc: string;
  system_id: string;
  sortcode: string;
}

/**
 * @description: 策略类型
 * @return {
 * strategy_type_id    策略类型id
 * strategy_type_name  策略类型名称
 * strategy_type_alias 策略类型别名
 * strategy_type_desc  策略类型描述
 * strategy_type_value 策略类型值
 * system_id 系统id
 * sortcode 排序码
 * }
 */
export interface IAutoStrategyType {
  strategy_type_id?: string;
  strategy_type_name: string;
  strategy_type_alias: string;
  strategy_type_value: string;
  strategy_type_desc: string;
  system_id: string;
  sortcode: string;
}

/**
 * @description: 成组定义
 * @return {
 * group_auto_id    成组动作id
 * group_auto_name  成组动作名称
 * group_auto_alias 成组动作别名
 * group_auto_desc  成组动作描述
 * group_auto_type  成组动作类型
 * system_id 系统id
 * sortcode 排序码
 * }
 */
export interface IGroupAutos {
  group_auto_id?: string;
  group_auto_name: string;
  group_auto_alias: string;
  group_auto_type: string;
  group_auto_desc: string;
  system_id: string;
  sortcode: string;
  group_auto_code: string;
}
/**
 * @description: 区域动作
 * @return {
 * area_activitie_id    区域动作id
 * area_activitie_name  区域动作名称
 * area_activitie_alias 区域动作别名
 * area_activitie_code  区域动作code
 * enable               开关
 * enable_value_type    开关值类型
 * start_time           开始时间
 * keep_time            持续时间
 * system_id            系统id
 * sortcode             排序码
 * }
 */
export interface IAutoAreaActivitie {
  area_activitie_id?: string;
  area_activitie_name: string;
  area_activitie_alias: string;
  area_activitie_code: string;
  enable: string;
  enable_value_type: string;
  start_time: string;
  keep_time: string;
  system_id: string;
  sortcode: string;
}

/**
 * @description: 支架区域类型
 * @return {
 * support_type_id   支架区域类型id
 * support_type_name 支架区域类型名称
 * support_type_alias 支架区域类型别名
 * support_type_desc 支架区域类型描述
 * support_type_value 支架区域类型值
 * system_id 系统id
 * sortcode 排序码
 *
 * }
 */
export interface ISupportAreaType {
  support_type_id?: string;
  support_type_name: string;
  support_type_alias: string;
  support_type_value: string;
  support_type_desc: string;
  system_id: string;
  sortcode: string;
}

/**
 * @description: 阶段实例
 * @return {
 * stages_instantiation_id  阶段实例id
 * stage_id 跟机阶段id
 * stages_instantiation_name 阶段实例名称
 * stages_instantiation_alias 阶段实例别名
 * stages_instantiation_variable:阶段切换点
 * next_stage_id:下一阶段的id
 * auto_process_id 对应的工艺的id
 * system_id 系统id
 * sortcode 排序码
 *
 * }
 */
export interface IAutoStagesInstantiation {
  stages_instantiation_id: string;
  stage_id: string;
  stages_instantiation_name: string;
  stages_instantiation_alias: string;
  stages_instantiation_variable: string;
  next_stage_id: string;
  auto_process_id:string;
  system_id: string;
  sortcode: string;
}

/**
 * @description: 支架类型范围
 * @return {
 * support_scope_id?   支架类型范围id
 * support_scope_name 支架类型范围名称
 * support_scope_alias 支架类型范围别名
 * support_scope_desc 支架类型范围描述
 * support_scope_value 支架类型范围值
 * support_type_id 支架类型范围类型id
 * system_id 系统id
 * sortcode 排序码
 *
 * }
 */
export interface ISupportScope {
  support_scope_id?: string;
  support_scope_name: string;
  support_scope_alias: string;
  support_scope_value: string;
  support_scope_desc: string;
  support_type_id: string;
  system_id: string;
  sortcode: string;
}

/**
 * @description:  按键字典
 * @return {
 * key_id?   按键id
 * key_name 按键名称
 * key_alias 按键别名
 * key_desc 按键描述
 * key_value 按键值
 * system_id 系统id
 * sortcode 排序码
 *
 * }
 */
export interface IKeyBoard {
  key_id?: string;
  key_name: string;
  key_alias: string;
  key_value: string;
  key_desc: string;
  system_id: string;
  sortcode: string;
}

/**
 * @description:  按键字典类型
 * @return {
 * key_type_id?   按键id
 * key_type_name 按键名称
 * key_type_alias 按键别名
 * key_type_desc 按键描述
 * key_type_value 按键值
 * system_id 系统id
 * sortcode 排序码
 *
 * }
 */
export interface IKeyBoardType {
  key_type_id?: string;
  key_type_name: string;
  key_type_alias: string;
  key_type_value: string;
  key_type_desc: string;
  system_id: string;
  sortcode: string;
}

/**
 * @description: 按键范围
 * @return {
 * key_scope_id?   按键范围id
 * key_scope_name 按键范围名称
 * key_scope_alias 按键范围别名
 * key_scope_desc 按键范围描述
 * key_scope_value 按键范围值
 * system_id 系统id
 * sortcode 排序码
 * }
 */
export interface IKeyBoardScope {
  key_scope_id?: string;
  key_scope_name: string;
  key_scope_alias: string;
  key_scope_value: string;
  key_scope_desc: string;
  system_id: string;
  sortcode: string;
}

/**
 * @description: 局部参数
 * @return {
 * id   局部参数id
 * name 局部参数名字
 * desc 局部参数描述
 * expression 局部参数表达式
 * type 局部参数类型
 * system_id 系统id
 * sortcode 排序码
 * }
 */
export interface ILocalParamsRes {
  id: string;
  name: string;
  desc: string;
  expression: string;
  system_id: string;
  sortcode: string;
  type: string;
}

/**
 * @description:控制器变量
 * @return {
 * param_id 参数Id
 * system_id 系统id
 * param_name 参数名称
 * param_alias 参数别名
 * param_scope_type 参数作用域
 * param_type_id 参数类型
 * min_value 最小值
 * max_value 最大值
 * default_value 默认值
 * param_desc 描述
 * del_flag 标识
 * sortcode 排序码
 * }
 */
export interface IControlParamsDict {
  param_id: string;
  system_id: string;
  param_name: string;
  param_alias: string;
  param_scope_type: string;
  param_type_id: string;
  min_value: string;
  max_value: string;
  default_value: string;
  param_desc: string;
  del_flag: string;
  sortcode: string;
  params_type_name?: string; ////数据库返回的多余数据
}

/**
 * @description:按键配置JSON中的数据
 * @return {
 * Code : 动作码,
 * DispText : 动作名称,
 * Type: 动作类型,
 * WidgetId : 部件ID,
 * Name": 执行动作的部件名称
 * }
 */
export interface IActDisplay {
  Code: string;
  DispText: string;
  Type: string;
  WidgetId: string;
  Name: string;
}
