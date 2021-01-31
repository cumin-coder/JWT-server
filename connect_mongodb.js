const mongoose = require('mongoose');

// 连接数据库
mongoose.connect('mongodb://127.0.0.1/login', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
const db = mongoose.connection
db.once('open', () => {
  console.log('数据库连接成功..............欢迎您回家 主人。')
})
db.on('error', console.error.bind(console, 'connection error:'));