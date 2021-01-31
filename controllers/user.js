const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const loginModel = require('../models/LoginModel')

class UserController {
  // 用户注册
  static async register(userReg) {
    const data = userReg.request.body
    if (!data.name || !data.password) return userReg.body = {
      message: '注册账号或密码不能为空哦 主人请输入~'
    }

    /**
     * 2.
      * a.将用户名存入 userList 数组中
      * b.将新用户的密码进行加密 并存入 userList 数组中
     */

    // 进行密码加密
    const hashPassword = crypto.createHash('md5').update(data.password).digest('hex')


    // 1. 是否已经注册过（通过用户名来辨别）
    return loginModel.find({ name: data.name }).then(result => {
      if (!result.length) {
        // 存入数据库
        return loginModel.insertMany({
          name: data.name,
          password: hashPassword
        }).then(() => {
          return userReg.body = { code: "0", message: "注册成功" };
        })
      } else {
        return userReg.body = { code: "1", message: '账号已存在' }
      }
    })
  }

  // 用户登录
  static async login(userlog) {
    console.log(userlog)
    const data = userlog.request.body

    if (!data.name || !data.password) return userlog.body = {
      message: '账号或密码不能为空哦 主人请输入~'
    }

    // 进行加密 jwt
    const hashPassword = crypto.createHash('md5').update(data.password).digest('hex')
    // 判断 账号 密码 是否正确
    return loginModel.find({ name: data.name, password: hashPassword }).then(result => {
      if (!result.length) {
        return userlog.response.body = {
          code: "1",
          message: '账号或密码错误 主人请认真输入~'
        }
      } else {
        const token = jwt.sign(
          {
            "name": data.name,
            "password": data.password
          },
          "cuminTOKEN",
          { expiresIn: 60 * 60 * 24} // 60 * 60 s
        )
        return userlog.response.body = {
          code: "0",
          message: '登录成功 欢迎回来主人~',
          data: {
            token
          }
        }
      }
    })
  }

  // 获取用户信息
  static async userinfo(ctx) {
    const data = ctx.state.user;
    console.log(data)
    return ctx.body = {
      code: "0",
      data: {
        ...data
      }
    }
  }
}

module.exports = UserController;
