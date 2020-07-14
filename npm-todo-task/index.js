/*
 * @Description: This is a index file
 * @Author: JeanneWu
 * @Date: 2020-07-13 11:40:36
 */
// js文件头部注释之后的内容

const db = require('./db')
const inquirer = require('inquirer')

module.exports = {
  add,
  clear,
  showAll
}

// 读取之前的文件
// 添加title
// 将任务存到文件里
// 面向接口编程

async function add(title) {
  const list = await db.read()
  const task = {
    title,
    done: false
  }
  list.push(task)

  const result = await db.write(list)
}

async function clear() {
  await db.write([])
}

async function showAll() {
  const list = await db.read()
  printTasks(list)
}

function printTasks(list) {
  inquirer
  .prompt([
    {
      type: 'list',
      name: 'index',
      message: '请选择你想操作的任务?',
      choices: [{
        name: '退出',
        value: '-1'
      }, ...list.map((item, index) => {
        return {name: `${item.done ? '[x]' : '[_]'}${index+1} -- ${item.title}`, value: `${index}`}
      }),{
        name: '创建新任务',
        value: '-2'
      }]
    }
  ])
  .then((answer) => {
    let index = +answer.index
    if (index >= 0) {
      askForAction(list, index)
    } else if (index === -2) {
      askForCreateTask(list)
    }
  });
}
function askForAction(list, index) {
  const actions = {markAsUndone, markAsDone, remove, updateTitle}
  inquirer.prompt({
    type: 'list', name: 'action',
    message: '请选择操作',
    choices: [
      {name: '退出', value: 'quit'},
      {name: '已完成', value: 'markAsDone'},
      {name: '未完成', value: 'markAsUndone'},
      {name: '改标题', value: 'updateTitle'},
      {name: '删除', value: 'remove'},
    ]
  }).then(answer2 => {
    const action = actions[answer2.action]
    action && action(list, index)
  })
}

function askForCreateTask(list) {
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: '输入任务标题'
  }).then(answer => {
    list.push({
      title: answer.title,
      done: false
    })
    db.write(list)
  })
}
function markAsUndone(list, index) {
  list[index].done = false
  db.write(list)
}

function markAsDone(list, index) {
  list[index].done = true
  db.write(list)
}
function remove(list, index) {
  list.splice(index, 1)
  db.write(list)
}
function updateTitle(list, index) {
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: '新的标题',
    default: list[index].title
  }).then(answer => {
    list[index].title = answer.title
    db.write(list)
  })
}