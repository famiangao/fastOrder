
> @orderInfo.tsx 按照 @antd 内的form组件修改<form>内内容


> 它<form 双向绑定用的不是:form而是 :model吧


> @orderInfo.tsx 我输入了内容之后发现{JSON.stringify(form.getFieldsValue())}这个里面没有值是为什么


> @orderInfo.tsx 报了这个错是为什么，我不是很熟react


> @skuMapper.ts 仿照orderInfo的dal，ddl，views写法把这个表的相关页面补全


> @orderInfo.tsx 这个地方的skuMapperId其实是这个表的id@skuMapper.ts 在添加和修改的时候改为select选择框，展示skuName选择。
> 然后我在skuMapper加了个skuName属性，你帮我在各个dal ddl view文件补全这个属性@skuMapper.ts


> 我在skuMapper加了个skuName属性，你帮我在各个dal ddl view文件补全这个属性@skuMapper.ts


> @orderInfo.tsx @skuMapper.tsx 这两个页面加一个返回按钮在左上角，把返回按钮封装成公共组件在 components文件夹下


> 这个地方渲染的时候渲染对应skuName


> @orderInfo.tsx 这个地方支持excel导入导入的excel对照字段为
>  订单编号,
> 	address 收货地址,
> 	skuId skuId,
> 	skuMapperId 用当前skuId找skuMapper表skuId相同的第一个即可, 


> 我要安装哪个依赖？npm的语句是什么？


> @ImportExcel.tsx 导入skuId的时候判断，如果已经导入过了，执行修改操作


> const existingOrders = await queryOrderInfoData({});@ImportExcel.tsx 这个地方能别查全量数据嘛，用select xx from xx in （xxx,xxx）查 



> @ImportExcel.tsx 如果导入的skuId带小数点，舍弃小数点后面的东西


> @orderInfo.ts 我又添加了一个status属性在ddl里面，你帮我加一下这个属性，默认有两个值finish和unfinish（你写一个接口在@/type ），新加的一条默认是unfinish，渲染为未执行和已执行 

> 之前的对话看这里@chat.md ，之后我的每次提问你也要记到这里。@orderInfo.tsx status默认是不可修改的

> 我的表达有误，添加和修改都不可以，只能看，你再帮我生成一下

> @orderInfo.tsx @skuMapper.tsx 美化一下这两个页面，让表格占页面100%，不要超出现在如图超出了，别的也美化一下，加上这个页面的标题是xxx页面

> 标题要居中，全局滚动条都美化一下，如果过长加省略号，不要全展示了

> 标题要居中

> @buyGoods.js 这个地方要根据@orderInfo.ts @skuMapper.ts 改造一下，其中"./src/assets/pidMap.xlsx"已经替换成了@skuMapper.ts "./src/assets/importExcel.xlsx"已经替换成了@orderInfo.ts 。逻辑是先查到orderInfo中所有状态是unfinish的数据，然后根据数据的skuMapperId，查到对应的所有skuMapper。然后执行之后的操作，如果成功将对应的一条orderInfo数据改为finish

> @buyGoodsUseExcel.tsx 你生成这个文件的作用是什么

> @buyGoodsUseExcel.tsx 那你写个按钮在主页上把

> 报错了，解决一下吧

> 这个错是为什么呀