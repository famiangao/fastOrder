import { sqliteTool } from '@/utils/sqliteTool';
import { IQueryParams } from '@/type/resourceDict';
const sqlite = new sqliteTool();
// interface IPage{
//   pageSize:string,//一页几个
//   pageNum:string,//第几页
//   order:number,//排序 0 升序 1降序
//   orderString:string//根据什么排序
// }
// 公共方法
export class sqlManage {
  /**
   * 查询全部数据
   * @param dataname 数据库的名字
   * @param data  分页依据,默认不分页
   * @param lit 要查询的字段
   */
  async queryData(
    dataname: string,
    data: IQueryParams = { pageSize: '', pageNum: '', order: 0, orderString: '' },
    lit: string
  ) {
    let sql = '';
    //判断是否分页
    if (data.pageNum === '' || data.pageSize === '') {
      try {
        if (data.orderString == '' || data.orderString == undefined) {
          sql = `select * from ${dataname}`;
        } else {
          sql = `select * from ${dataname}   order by ${data.orderString} ${
            data.order === 0 ? 'ASC' : 'DESC'
          } `;
        }
        if (await sqlite.open()) {
          const result: any = await sqlite.all(sql);
          // console.log(sql);

          await sqlite.close();
          return {
            code: '0',
            message: '数据查询成功',
            res: result,
          };
        } else {
          return {
            code: '1',
            message: '数据库连接失败,数据查询失败',
            res: '',
          };
        }
      } catch (e) {
        console.log(e);
        throw e;
      }
    } else {
      try {
        const pageNum = (data as any).pageNum;
        const pageSize = (data as any).pageSize;
        if (data.orderString == '' || data.orderString == undefined) {
          sql = `select ${lit} from ${dataname}    limit ${pageSize} offset ${
            (pageNum - 1) * pageSize
          }`;
        } else {
          sql = `select ${lit} from ${dataname}     order by ${data.orderString} ${
            data.order === 0 ? 'ASC' : 'DESC'
          }  limit ${pageSize} offset ${(pageNum - 1) * pageSize}`;
        }
        // const sql = `select ${lit} from ${dataname}  limit ${pageSize} offset ${(pageNum - 1) * pageSize
        //   } `;
        const sql2 = `select count(*) from ${dataname}  `;
        // console.log(sql);

        if (await sqlite.open()) {
          const num: any = await sqlite.all(sql2);
          const result: any = await sqlite.all(sql);
          result.sum = num[0]['count(*)'];
          await sqlite.close();
          // console.log(result);
          return {
            code: '0',
            message: '数据查询成功',
            res: result,
          };
        } else {
          await sqlite.close();
          return {
            code: '1',
            message: '数据库连接失败,数据查询失败',
            res: '',
          };
        }
      } catch (e) {
        console.log(e);
        throw e;
      }
    }
  }
  // 新增数据
  async addData(dataname: string, data: any) {
    try {
      var str = '';
      var str2 = '';
      for (var i in data) {
        str += '' + i + ',';
        str2 += "'" + data[i] + "',";
      }
      str = str.substring(0, str.lastIndexOf(',')) + ',' + 'del_flag';
      str2 = str2.substring(0, str2.lastIndexOf(',')) + ',' + '1';
      if (await sqlite.open()) {
        const sql = `INSERT INTO ${dataname}(${str}) VALUES (${str2})`;
        // console.log(sql);

        const result: any = await sqlite.run(sql);
        await sqlite.close();
        return {
          code: '0',
          message: '数据新增成功',
          res: result,
        };
      } else {
        await sqlite.close();
        return {
          code: '1',
          message: '数据库连接失败,数据新增失败',
          res: '',
        };
      }
    } catch (e) {
      throw e;
    }
  }

  // 编辑数据
  async editData(dataname: string, id: any, data: any) {
    var str = '';
    var str2 = '';
    for (var i in data) {
      str += i + ' =' + "'" + data[i] + "',";
    }
    for (var y in id) {
      str2 += 'WHERE ' + y + ' =' + " '" + id[y] + "'";
    }
    str = str.substring(0, str.lastIndexOf(','));
    try {
      if (await sqlite.open()) {
        const sql = `update ${dataname} set ${str} ${str2}`;
        const result: any = await sqlite.run(sql);
        // console.log(sql);

        await sqlite.close();
        return {
          code: '0',
          message: '数据编辑成功',
          res: result,
        };
      } else {
        await sqlite.close();
        return {
          code: '0',
          message: '数据编辑失败',
          res: '',
        };
      }
    } catch (e) {
      throw e;
    }
  }

  // 删除数据
  async delData(dataname: string, data: any) {
    // console.log(data);

    var str = '';
    for (var y in data) {
      str += 'WHERE ' + y + ' =' + " '" + data[y] + "'";
    }
    try {
      if (await sqlite.open()) {
        const sql = `delete from ${dataname} ${str}`;
        const result: any = await sqlite.run(sql);
        // console.log(sql);
        await sqlite.close();
        return {
          code: '0',
          message: '数据删除成功',
          res: result,
        };
      } else {
        await sqlite.close();
        return {
          code: '0',
          message: '数据删除失败',
          res: '',
        };
      }
    } catch (e) {
      throw e;
    }
  }

  // 精确查询数据
  async queryOneData(data: any, newData: any) {
    try {
      if (await sqlite.open()) {
        const sql = `select  ${newData} from ${data.dataName} where ${data.idName} = ?`;
        const result: any = await sqlite.each(sql, data.id);
        await sqlite.close();
        // console.log(sql);
        return {
          code: '0',
          message: '数据查询成功',
          res: result,
        };
      } else {
        await sqlite.close();
        return {
          code: '1',
          message: '数据查询失败',
          res: '',
        };
      }
    } catch (e) {
      throw e;
    }
  }

  // 根据某个条件查询多个数据
  async queryTrueData(data: any, isExited?: boolean) {
    try {
      if (await sqlite.open()) {
        let sql;
        if (isExited) {
          sql = `select * from ${data.dataName} where ${data.idName} = '${data.id}'`;
        } else {
          sql = `select * from ${data.dataName} where ${data.idName} = '${data.id}' order by sortcode`;
        }
        const result: any = await sqlite.all(sql);
        await sqlite.close();

        // console.log(sql);
        return {
          code: '0',
          message: '数据查询成功',
          res: result,
        };
      } else {
        await sqlite.close();
        return {
          code: '0',
          message: '数据查询失败',
          res: '',
        };
      }
    } catch (e) {
      throw e;
    }
  }

  // 校验数据是否完整
  async checkData(normData: any, data: any) {
    var list = JSON.parse(JSON.stringify(data));

    for (var i in normData) {
      list[i] = list[i] || '';
    }
    return list;
  }

  // 连表查询,

  async findData(name1: any, name2: any, id: any) {
    try {
      if (await sqlite.open()) {
        const sql = `select * from ${name1} inner join ${name2} on ${name1}.${id} = ${name2}.${id}`;

        const result: any = await sqlite.all(sql);
        await sqlite.close();
        // console.log(sql);
        return {
          code: '0',
          message: '数据查询成功',
          res: result,
        };
      } else {
        await sqlite.close();
        return {
          code: '0',
          message: '数据查询失败',
          res: '',
        };
      }
    } catch (e) {
      throw e;
    }
  }
  // 查询 数据库数据 跟现有数据进行对比，有的先删除再添加，没有的和剩下的删除
  async delAndEdit(data: any) {
    try {
      if (await sqlite.open()) {
        var _this = this;
        try {
          sqlite.db.serialize(() => {
            sqlite.db.run('begin transaction');
            data.forEach((el: any) => {
              sqlite.db.run(el);
            });
            sqlite.db.run('commit');
          });
          await sqlite.close();
          return {
            code: '0',
            message: '数据操作成功',
            res: '',
          };
        } catch (err: any) {
          await sqlite.close();
          sqlite.db.run('rollback');
          return {
            code: '1',
            message: '数据操作失败',
            res: '',
          };
        }
      } else {
        await sqlite.close();
        return {
          code: '1',
          message: '数据操作失败',
          res: '',
        };
      }
    } catch (e) {
      throw e;
    }
  }

  // 查询表中符合某一个字段的所有参数
  async queryFuzzytype(
    dataname: string,
    data: any = { pageSize: '', pageNum: '', order: 0, orderString: '', type: '', typelist: '' }
  ) {
    let sql = '';
    try {
      const pageNum = (data as any).pageNum;
      const pageSize = (data as any).pageSize;

      sql = `select * from ${dataname}  where ${data.type} in (${data.typelist})  order by ${
        data.orderString
      } ${data.order === 0 ? 'ASC' : 'DESC'}  limit ${pageSize} offset ${(pageNum - 1) * pageSize}`;

      const sql2 = `select count(*) from ${dataname} where ${data.type} in (${data.typelist})`;
      console.log(sql);

      if (await sqlite.open()) {
        const num: any = await sqlite.all(sql2);
        const result: any = await sqlite.all(sql);
        result.sum = num[0]['count(*)'];
        await sqlite.close();
        // console.log(result);
        return {
          code: '0',
          message: '数据查询成功',
          res: result,
        };
      } else {
        await sqlite.close();
        return {
          code: '1',
          message: '数据库连接失败,数据查询失败',
          res: '',
        };
      }
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  // 模糊查询
  async queryFuzzy(data: any, newData: any) {
    var str = '';
    let pageSize = data.pageSize || 15;
    let pageNum = data.pageNum || 1;

    for (var y in newData) {
      if (Number(y) + Number(1) == newData.length) {
        str += `${newData[y]} like '%${data.value}%'`;
      } else {
        str += `${newData[y]} like '%${data.value}%' or `;
      }
    }
    try {
      if (await sqlite.open()) {
        let sql = '';
        // 如果data中有system_id，则查询系统表
        if (data.system_id) {
          sql =
            `select ${newData} from ${data.dataName} where ` +
            str +
            ` and system_id = '${data.system_id}' order by sortcode limit ${pageSize} offset ${
              (pageNum - 1) * pageSize
            }`;
        } else {
          sql =
            `select ${newData} from ${data.dataName} where ` +
            str +
            ` order by sortcode limit ${pageSize} offset ${(pageNum - 1) * pageSize}`;
        }

        // console.log(sql);
        const result: any = await sqlite.all(sql);

        await sqlite.close();
        return {
          code: '0',
          message: '数据查询成功',
          res: result,
        };
      } else {
        await sqlite.close();
        return {
          code: '1',
          message: '数据查询失败',
          res: '',
        };
      }
    } catch (e) {
      throw e;
    }
  }

  // 查询某一列最大的值
  async queryMax(data: any) {
    try {
      if (await sqlite.open()) {
        const sql = `select MAX(${data.str}) from ${data.dataName}`;

        const result: any = await sqlite.all(sql);
        // console.log(sql);
        if (data.str == 'sortcode' && result['MAX(sortcode)'] == null) {
          result['MAX(sortcode)'] = '000';
        }
        await sqlite.close();
        // console.log('0000', result);

        return {
          code: '0',
          message: '最大值查询成功',
          res: result,
        };
      } else {
        return {
          code: '1',
          message: '最大值查询失败',
          res: '',
        };
      }
    } catch (e) {
      throw e;
    }
  }

  // 校验字典字段的唯一性
  /**
   *
   * @param data {dataName："数据库名称",dataString："被校验的字段"，value：'值'}
   */
  async checkString(data: any) {
    try {
      if (await sqlite.open()) {
        const sql = `select count(*) from ${data.dataName} where ${data.dataString} = '${data.value}'`;
        const result: any = await sqlite.all(sql);
        // console.log(sql);
        await sqlite.close();   
        return {
          code: '0',
          message: '数据查询成功',
          res: result[0]['count(*)'],
        };
      } else {
        return {
          code: '1',
          message: '数据查询失败',
          res: '',
        };
      }
    } catch (e) {
      throw e;
    }
  }

  // 查询全部数据 带参数
  async queryChooseData(
    dataname: string,
    data: any = { pageSize: '', pageNum: '', order: 0, orderString: '' },
    lit: string,
    msg: any
  ) {
    let sql = '';
    if ((data as any).pageNum === '' || (data as any).pageSize === '') {
      try {
        if (data.orderString == '' || data.orderString == undefined) {
          sql = `select ${lit} from ${dataname} where ${msg.idName} = "${msg.id}"`;
        } else {
          sql = `select ${lit} from ${dataname} where ${msg.idName} = "${msg.id}"   order by ${
            data.orderString
          } ${data.order === 0 ? 'ASC' : 'DESC'} `;
        }
        if (await sqlite.open()) {
          const result: any = await sqlite.all(sql);
          // console.log(sql);
          await sqlite.close();
          return {
            code: '0',
            message: '数据查询成功',
            res: result,
          };
        } else {
          return {
            code: '1',
            message: '数据库连接失败,数据查询失败',
            res: '',
          };
        }
      } catch (e) {
        console.log(e);
        throw e;
      }
    } else {
      try {
        const pageNum = (data as any).pageNum;
        const pageSize = (data as any).pageSize;

        if (data.orderString == '' || data.orderString == undefined) {
          sql = `select ${lit} from ${dataname} where ${msg.idName} =" ${
            msg.id
          }"    limit ${pageSize} offset ${(pageNum - 1) * pageSize}`;
        } else {
          sql = `select ${lit} from ${dataname} where ${msg.idName} =  "${msg.id}"     order by ${
            data.orderString
          } ${data.order === 0 ? 'ASC' : 'DESC'}  limit ${pageSize} offset ${
            (pageNum - 1) * pageSize
          }`;
        }
        // const sql = `select ${lit} from ${dataname}  limit ${pageSize} offset ${(pageNum - 1) * pageSize
        //   } `;
        const sql2 = `select count(*) from ${dataname} where ${msg.idName} = "${msg.id}" `;
        // console.log(sql);

        if (await sqlite.open()) {
          const num: any = await sqlite.all(sql2);
          const result: any = await sqlite.all(sql);
          result.sum = num[0]['count(*)'];
          await sqlite.close();
          // console.log(sql);
          // console.log(result);
          return {
            code: '0',
            message: '数据查询成功',
            res: result,
          };
        } else {
          await sqlite.close();
          return {
            code: '1',
            message: '数据库连接失败,数据查询失败',
            res: '',
          };
        }
      } catch (e) {
        console.log(e);
        throw e;
      }
    }
  }
}
