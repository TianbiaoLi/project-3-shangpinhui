// 将商品管理的四个模块请求接口统一暴露
import * as trademark from './product/TradeMark'
import * as attr from './product/Attr'
import * as spu from './product/Spu'
import * as sku from './product/Sku'
// 引入权限管理相关接口
import * as user from './acl/user'
import role from './acl/role'
import permission from './acl/permission'
// 对外暴露
export default {
  trademark,
  attr,
  spu,
  sku,
  user,
  role,
  permission
}
