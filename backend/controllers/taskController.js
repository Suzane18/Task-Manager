const Task = require('../models/Task');

const normalizeChecklist = (todoChecklist) =>
    todoChecklist.map((item) => ({
        ...item,
        completed:
            item.completed === true ||
            item.completed === "true" ||
            item.completed === 1 ||
            item.completed === "1"
    }));

const countCompletedItems = (todoChecklist) =>
    todoChecklist.filter((item) => item.completed === true).length;

const computeProgressAndStatus = (task) => {
    const totalItems = task.todoChecklist.length;
    const completedCount = countCompletedItems(task.todoChecklist);
    task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

    if (task.progress === 100) {
        task.status = "Completed";
    } else if (task.progress > 0) {
        task.status = "In Progress";
    } else {
        task.status = "Pending";
    }
};

//@desc get all tasks {admin all,users only assigned tasks}
//@route GET /api/tasks
//@access Private
const getTasks = async (req, res) => {
    try {
        const {status}=req.query;
        let filter={};

        if(status){
            filter.status=status;
        }

        const query = {
            ...filter,
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        };
        tasks = await Task.find(query).populate(
            "assignedTo",
            "name email profileImageUrl"
        );
            
        //Add completed todoChecklist count to each task
        tasks=await Promise.all(
            tasks.map(async (task)=>{
                const completedCount=task.todoChecklist.filter(
                    (item) => item.completed === true
                ).length;
                return {
                    ...task._doc,
                    completedCount
                };
            })
        );

        //Status summary counts
        const allTasks=await Task.countDocuments(
            req.user.role==="admin"?{}:{assignedTo:req.user._id}
        );
        
        const pendingTasks=await Task.countDocuments({
            ...filter,
            status:"Pending",
            ...(req.user.role!=="admin" && {assignedTo:req.user._id})
        });

        const inProgressTasks=await Task.countDocuments({
            ...filter,
            status:"In Progress",
            ...(req.user.role!=="admin" && {assignedTo:req.user._id})
        });

        const completedTasks=await Task.countDocuments({
            ...filter,
            status:"Completed",
            ...(req.user.role!=="admin" && {assignedTo:req.user._id})
        });

        res.json({
            tasks,
            summary:{
                all:allTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks
            }
        });


    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

//@desc get task by id
//@route GET /api/tasks/:id
//@access Private
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            task
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};
//@desc create new task {admin only}
//@route POST /api/tasks
//@access Private/Admin
const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments = [],
            todoChecklist = [],
            status
        } = req.body;

        if (!Array.isArray(assignedTo)) {
            return res
                .status(400)
                .json({ message: "assignedTo must be an array of user IDs" });
        }

        const normalizedChecklist = Array.isArray(todoChecklist)
            ? normalizeChecklist(
                  todoChecklist.map((item) => ({
                      text: item.text || "",
                      completed: item.completed || false,
                  }))
              )
            : [];

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
            todoChecklist: normalizedChecklist,
            attachments,
            status: status || "Pending",
        });
        res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

//@desc update task
//@route PUT /api/tasks/:id
//@access Private
const updateTask = async (req, res) => {
    try {
    const task=await Task.findById(req.params.id);

    if(!task) return res.status(404).json({ message: "Task not found" });

    task.title=req.body.title || task.title;
    task.description=req.body.description || task.description;
    task.priority=req.body.priority || task.priority;
    task.dueDate=req.body.dueDate || task.dueDate;
    task.attachments=req.body.attachments || task.attachments;

    if(req.body.assignedTo){
        if(!Array.isArray(req.body.assignedTo)){
            return res
            .status(400)
            .json({ message: "assignedTo must be an array of user IDs" });
        }
        task.assignedTo=req.body.assignedTo;
    }

    if (req.body.todoChecklist) {
        if (!Array.isArray(req.body.todoChecklist)) {
            return res.status(400).json({
                message: "todoChecklist must be an array"
            });
        }

        task.todoChecklist = normalizeChecklist(req.body.todoChecklist);
        task.markModified("todoChecklist");
        computeProgressAndStatus(task);
    }

    const updatedTask=await task.save();
    res.json({ message: "Task updated successfully", updatedTask });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

//@desc delete task {admin only}
//@route DELETE /api/tasks/:id
//@access Private/Admin
const deleteTask = async (req, res) => {
    try {    
        const task=await Task.findById(req.params.id);

        if(!task) return res.status(404).json({ message: "Task not found" });

        await task.deleteOne();
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

//@desc update task status
//@route PUT /api/tasks/:id/status
//@access Private
const updateTaskStatus = async (req, res) => {
    try {    
        const task=await Task.findById(req.params.id);

        if(!task) return res.status(404).json({ message: "Task not found" });

        const isAssigned=task.assignedTo.some(
            (userId) => userId.toString() === req.user._id.toString()
        );

        if (!isAssigned&&req.user.role!=="admin") {
            return res.status(403).json({ message: "Not Authorized" });
        }

        task.status = req.body.status|| task.status;
        if(task.status==="Completed"){
            task.todoChecklist.forEach(item=>item.completed=true);
            task.progress=100;
        }
        await task.save();
        res.json({ message: "Task status updated successfully", task });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

//@desc update task checklist
//@route PUT /api/tasks/:id/todo
//@access Private
const updateTaskChecklist = async (req, res) => {
    try {

        const { todoChecklist } = req.body;

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // Check if current user is assigned to the task
        const isAssigned = task.assignedTo.some(
            (userId) =>
                userId.toString() === req.user._id.toString()
        );

        // Allow only assigned users or admin
        if (!isAssigned && req.user.role !== "admin") {
            return res.status(403).json({
                message: "Not Authorized"
            });
        }

        if (!Array.isArray(todoChecklist)) {
            return res.status(400).json({
                message: "todoChecklist must be an array"
            });
        }

        task.todoChecklist = normalizeChecklist(todoChecklist);
        task.markModified("todoChecklist");
        computeProgressAndStatus(task);

        // Save task
        await task.save();

        // Fetch updated task with populated users
        const updatedTask = await Task.findById(req.params.id)
            .populate("assignedTo", "name email profileImageUrl");
        res.json({
            message: "Task checklist updated successfully",
            updatedTask
        });

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};
//@desc get dashboard data {admin only}
//@route GET /api/tasks/dashboard-data
//@access Private/Admin
const getDashboardData = async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({ status: "Pending" });
        const completedTasks = await Task.countDocuments({ status: "Completed" });
        const overdueTasks = await Task.countDocuments({
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() }
        });
        const taskStatuses = ["Pending", "In Progress", "Completed"];
        const taskDistributionRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);
        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, "");
            acc[formattedKey] =
                taskDistributionRaw.find((item) => item._id === status)?.count || 0;
            return acc;
        }, {});
        taskDistribution["All"] = totalTasks;

        //ensure all priority levels are included
        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelsRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 }
                }
            }
        ]);
        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority]=
            taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
            return acc;
        },{});

        //fetch recent 10 tasks
        const recentTasks = await Task.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt assignedTo")
            .populate("assignedTo", "name");
    res.status(200).json({
        statistics: {
            totalTasks,
            pendingTasks,
            completedTasks,
            overdueTasks,
        },
        charts: {
            taskDistribution,
            taskPriorityLevels
        },
        recentTasks,
    });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


//@desc get user dashboard data
//@route GET /api/tasks/user-dashboard-data
//@access Private
const getUserDashboardData = async (req, res) => {
    try {
        const userId=req.user._id;

        const totalTasks = await Task.countDocuments({ assignedTo: userId });

        const pendingTasks = await Task.countDocuments({
            assignedTo: userId,
            status: "Pending"
        });

        const completedTasks = await Task.countDocuments({
            assignedTo: userId,
            status: "Completed"
        });

        const overdueTasks = await Task.countDocuments({
            assignedTo: userId,
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() }
        });

        //task distribution by status
        const taskStatuses=["Pending","In Progress","Completed"]
        const taskDistributionRaw=await Task.aggregate([
            {$match: {assignedTo: userId,}},
            {$group: {_id:"$status",count:{$sum:1}}},
        ]
        );

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, "");
            acc[formattedKey] =
                taskDistributionRaw.find((item) => item._id === status)?.count || 0;
            return acc;
        }, {});

        taskDistribution["All"] = totalTasks;

        //task distribution by priority
        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelsRaw = await Task.aggregate([
            {$match: {assignedTo: userId,}},
            {$group: {_id:"$priority",count:{$sum:1}}},
        ]
        );

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority]=
            taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
            return acc;
        },{});

        //fetch recent 10 tasks fro the logged in user
        const recentTasks = await Task.find({ assignedTo: userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt");

        res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels
            },
            recentTasks,
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask, 
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData,
    getUserDashboardData
};[]