const crypto = require("crypto"),
  jwt = require("jsonwebtoken");
// TODO:使用数据库
// 这里应该是用数据库存储，这里只是演示用
let userList = [];
let index = 0;

class UserController {
  // 用户注册
  static async register(ctx) {
    const data = ctx.request.body;
    const checkUser = userList.find(item => item.name === data.name)
    if (checkUser) {
      return ctx.body = {
        code: '000002',
        message: "该用户名已存在"
      }
    }
    const user = {
      name: data.name,
      password: crypto.createHash('md5').update(data.password).digest('hex')
    };
    
    userList.push(user)

    return ctx.body = {
      code: '0',
      message: "注册成功"
    };
  }
  // 用户登录
  static async login(ctx) {
    const data = ctx.request.body;
    if (!data.name || !data.password) {
      return ctx.body = {
        code: "000002", 
        message: "参数不合法"
      }
    }
    const result = userList.find(item => item.name === data.name && item.password === crypto.createHash('md5').update(data.password).digest('hex'))
    if (result) {
      const token = jwt.sign(
        {
          name: result.name,
          _id: index++,
        },
        "my_token",
        { expiresIn: 60 * 60 }
      );
      return ctx.body = {
        code: "0",
        message: "登录成功",
        data: {
          token
        }
      };
    } else {
      return ctx.body = {
        code: "000002",
        message: "用户名或密码错误"
      };
    }
  }
  // 获取用户信息
  static async userinfo(ctx) {
    const data = ctx.state.user;
    const user = userList.find(item => item._id === data._id)

    if (user) {
      const result = {
        _id: user._id,
        name: user.name,
        email: user.email,
      };
      return ctx.body = {
        code: "0",
        message: "success",
        data: {
          ...result
        }
      }
    } else {
      return ctx.body = {
        code: "000002",
        message: "获取信息失败"
      }
    }
  }
}

module.exports = UserController;