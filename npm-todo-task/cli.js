const program = require('commander')
const api = require('./index')
const pkg = require('./package.json')

program
  .version(pkg.version, '-V')
program
  .command('add')
  .description('To create todo list')
  .action((...args) => {
    // console.log('Add successfully!');
    args.splice(0,1)
    const words = args[0] && args[0].join(' ') || ''
    api.add(words)
})
program
  .command('clear')
  .description('To clear tasks')
  .action(() => {
    api.clear()
})
// console.log(process.argv)
if(process.argv.length === 2) {
  api.showAll()
}
program.parse(process.argv)



