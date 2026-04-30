const Task = require('../models/Task');
const Project = require('../models/Project');

exports.createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, priority, dueDate } = req.body;
    
    const proj = await Project.findById(project);
    if (!proj) return res.status(404).json({ message: 'Project not found' });
    
    // Only Admin or project creator can create tasks
    const isProjectCreator = proj.createdBy.toString() === req.user._id.toString();
    if (req.user.role !== 'Admin' && !isProjectCreator) {
        return res.status(403).json({ message: 'Only Admins or Project Creators can create tasks' });
    }

    let task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      priority,
      dueDate,
      createdBy: req.user._id
    });
    
    // Populate the assignedTo field before sending it back
    task = await Task.findById(task._id).populate('assignedTo', 'name email avatar');
    
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const tasks = await Task.find({ project: projectId })
        .populate('assignedTo', 'name email avatar')
        .populate('createdBy', 'name')
        .populate('comments.user', 'name avatar');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    const proj = await Project.findById(task.project);
    if (!proj) return res.status(404).json({ message: 'Project not found' });
    
    const isAssigned = task.assignedTo && task.assignedTo?.toString() === req.user?._id?.toString();
    const isMember = proj.members && proj.members.some(id => id?.toString() === req.user?._id?.toString());
    const isProjectCreator = proj.createdBy && proj.createdBy?.toString() === req.user?._id?.toString();
    
    // If Admin or assigned user or project member or creator, can update
    // If Admin or assigned user or project creator, can update
    if (req.user.role === 'Admin' || isAssigned || isProjectCreator) {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('assignedTo', 'name email avatar')
            .populate('createdBy', 'name')
            .populate('comments.user', 'name avatar');
        res.json(updatedTask);
    } else {
        res.status(403).json({ message: 'Not authorized: Only the assignee, project creator, or admin can update this task.' });
    }
  } catch (error) {
    console.error("Update Task Error: ", error);
    res.status(500).json({ message: 'Internal Server Error: ' + error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    // Only Admin can delete task
    if (req.user.role === 'Admin') {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted' });
    } else {
        res.status(403).json({ message: 'Not authorized to delete tasks' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    // Check if user is authorized to comment (Admin, member of project, or assigned)
    const proj = await Project.findById(task.project);
    if (!proj) return res.status(404).json({ message: 'Project not found' });
    
    const isAssigned = task.assignedTo && task.assignedTo?.toString() === req.user?._id?.toString();
    const isMember = proj.members && proj.members.some(id => id?.toString() === req.user?._id?.toString());
    const isProjectCreator = proj.createdBy && proj.createdBy?.toString() === req.user?._id?.toString();
    
    if (req.user.role === 'Admin' || isAssigned || isMember || isProjectCreator) {
        task.comments.push({ text, user: req.user._id });
        await task.save();
        
        const updatedTask = await Task.findById(req.params.id)
            .populate('assignedTo', 'name email avatar')
            .populate('createdBy', 'name')
            .populate('comments.user', 'name avatar');
            
        res.status(201).json(updatedTask);
    } else {
        res.status(403).json({ message: 'Not authorized to comment on this task' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
