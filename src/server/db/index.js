const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const lowdb = low(adapter)

lowdb.defaults({ active: null, projects: [] }).write()

module.exports = {
  addproject: data => {
    data = JSON.parse(data)
    return lowdb.get('projects').push({
      name: data.title,
      key: data.key,
      description: data.description,
      mock: []
    }).write()
  },
  getprojectlist: data => 
    lowdb.get('projects').value(),
  getactiveprojectkey: data =>
    lowdb.get('active').value(),
  getactiveproject: data => {
    let activeKey = lowdb.get('active').value()
    return lowdb.get('projects').find({key: activeKey}).value()
  },
  activeprojectkey: data => {
    data = JSON.parse(data)
    let output = lowdb.set('active', data.key).write()
    return output
  },
  deleteproject: data => {
    data = JSON.parse(data)
    return lowdb.get('projects').remove({key: data.key}).write()
  },
  getinterface: data => {
    data = JSON.parse(data)
    return lowdb.get('projects').find({key: data.key}).value()
  },
  createinterface: data => {
    data = JSON.parse(data)
    let targetdb = lowdb.get('projects').find({key: data.key}).value()
    targetdb.mock.push(data.value)
    return lowdb.get('projects').find({key: data.key}).assign(targetdb).write()
  },
  modifyinterface: data => {
    data = JSON.parse(data)
    let targetdb = lowdb.get('projects').find({key: data.key}).value()
    targetdb.mock = targetdb.mock.filter(item => item.key != data.value.key)
    targetdb.mock.push(data.value)
    return lowdb.get('projects').find({key: data.key}).assign(targetdb).write()
  },
  deleteinterface: data => {
    data = JSON.parse(data)
    let targetdb = lowdb.get('projects').find({key: data.key}).value()
    targetdb.mock = targetdb.mock.filter(item => item.key != data.mockKey)
    return lowdb.get('projects').find({key: data.key}).assign(targetdb).write()
  }
}