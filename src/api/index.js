// 这个模块是将product的4个模块请求的接口函数统一暴露

// 商品管理相关的接口
import * as trademark from './product/tradeMark';
import * as attr from './product/attr';
import * as sku from './product/sku';
import * as spu from './product/spu';
// 权限相关的接口
// 注意：这两个文件的暴露方式和user不同，所以要加上as引入。
import permission from './acl/permission';
import role from './acl/role';
import * as user from './acl/user';

export default {
    trademark,
    attr,
    sku,
    spu,
    permission,
    role,
    user
}
