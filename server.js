const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Setup
app.use(cors());
app.use(express.json());

// MongoDB Local Connection (Week 3 Requirement)
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/project_manager_db';
mongoose.connect(mongoURI)
  .then(() => console.log('🛡️ MongoDB Database Connected Successfully!'))
  .catch(err => console.error('❌ Database Connection Error:', err));

// 1. PROJECT SCHEMA & MODEL
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  createdAt: { type: Date, default: Date.now }
});
const Project = mongoose.model('Project', projectSchema);

// 2. TASK SCHEMA & MODEL
const taskSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  text: { type: String, required: true },
  status: { type: String, enum: ['todo', 'progress', 'done'], default: 'todo' }
});
const Task = mongoose.model('Task', taskSchema);

// --- API ROUTES ---

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running smoothly', week: 3 });
});

// GET all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new project
app.post('/api/projects', async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET tasks by project ID
app.get('/api/projects/:projectId/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new task to a project
app.post('/api/projects/:projectId/tasks', async (req, res) => {
  try {
    const newTask = new Task({
      projectId: req.params.projectId,
      text: req.body.text,
      status: req.body.status || 'todo'
    });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT (Update) a task's status (for Kanban Board drag/drop logic)
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the Express Server
app.listen(PORT, () => {
  console.log(`🚀 Node.js Backend Server is live on port: ${PORT}`);
});
