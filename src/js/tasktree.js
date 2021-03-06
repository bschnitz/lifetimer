export const TaskStatusEnum = Object.freeze({
  open:      1,
  completed: 2,
  rejected:  4
})

export class TaskNode {
  constructor (id=null, parent=null, data={}) {
    this.data = {
      id:        id,
      parent:    parent,
      tasks:     [],
      status:    undefined,
      text:      undefined,
      timeStart: undefined,
      timeEnd:   undefined,
      deadline:  undefined
    };

    this.setData(data);
  }

  getFieldValue (field) {
    return this.data[field];
  }

  getData () {
    return this.data;
  }

  getRawDataCopy () {
    let data = Object.assign({}, this.data);
    delete data.parent;
    data.tasks = [];
    for (let task of this.data.tasks) {
      data.tasks.push(task.getRawDataCopy())
    }
    return data;
  }

  getId () {
    return this.data.id;
  }

  hasId () {
    return this.data.id !== null;
  }

  getText() {
    return this.data.text;
  }

  getParent () {
    return this.data.parent;
  }

  getChildNodes () {
    return this.data.tasks;
  }

  countChilds () {
    return this.data.tasks.length;
  }

  hasChilds () {
    return this.countChilds() > 0;
  }

  getStatus () {
    return this.data.status;
  }

  addChildNode (node) {
    this.data.tasks.push(node);
  }

  removeChildNode (node) {
    this.data.tasks = this.data.tasks.filter(t => t.getId() !== node.getId());
  }

  isEqual (task) {
    return this.getId() === task.getId();
  }

  setField (fieldName, newValue, fallback) {
    if (newValue !== undefined) {
      this.data[fieldName] = newValue;
    }
    else if (this.data[fieldName === undefined] && fallback !== undefined) {
      this.data[fieldName] = fallback;
    }
  }

  setData (data) {
    this.setField('status',    data.status,   TaskStatusEnum.open);
    this.setField('text',      data.text,     '');
    this.setField('timeStart', data.timeStart);
  }

  toggleComplete() {
    if (this.data.status !== TaskStatusEnum.completed) {
      this.data.status = TaskStatusEnum.completed;
    }
    else {
      this.data.status = TaskStatusEnum.open;
    }
  }
}

export class TaskTree {
  constructor () {
    this.maxId = 0;
    this.root = new TaskNode(this.maxId);
  }

  initFromRawData (task, parent=null) {
    this.maxId = Math.max(this.maxId, task.id)
    let node = new TaskNode(task.id, parent, task);

    if (parent === null) {
      this.root = node;
    }

    for (let child of task.tasks) {
      let childNode = this.initFromRawData(child, node);
      node.addChildNode(childNode);
    }

    return node;
  }

  getRawDataCopy () {
    return this.root.getRawDataCopy();
  }

  static loadFromLocalStorage (key) {
    let rawData = JSON.parse(localStorage.getItem(key));
    let taskTree = new TaskTree();
    rawData.id = 0;
    if (rawData !== null) {
      taskTree.initFromRawData(rawData);
    }

    return taskTree;
  }

  saveToLocalStorage (key) {
    let rawData = JSON.stringify(this.getRawDataCopy());
    localStorage.setItem(key, rawData);
  }

  *getRecursiveNodeIterator(root) {
    root = root === undefined ? this.root : root
    for (let node of root.getChildNodes())
    {
      yield node;
      yield* this.getRecursiveNodeIterator(node);
    }
  }

  getNodeById(id) {
    if (id === undefined) {
      return this.root;
    }

    for (let node of this.getRecursiveNodeIterator()) {
      if (node.getId() === id) {
        return node;
      }
    }
  }

  getRootNode () {
    return this.root;
  }

  addTask(parent, data) {
    this.maxId += 1;
    parent.addChildNode(new TaskNode(this.maxId, parent, data));
  }

  /* private methods */

  _recalculateMaxId () {
    this.maxId = -Infinity;

    for (let node of this.getRecursiveNodeIterator()) {
      this.maxId = Math.max(this.maxid, node.id);
    }

    this.maxId = this.maxId === -Infinity ? 0 : this.maxId;
  }
}
