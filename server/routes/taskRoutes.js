const express = require('express');
const { createTask,checkout ,getTasks, updateTaskStatus ,getAllTasksForManager} = require('../controllers/taskController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');





const router = express.Router();

router.post('/',createTask);
router.get('/', getTasks);
router.get('/manager', getAllTasksForManager);
router.put('/',updateTaskStatus);
router.post('/checkout', checkout);

  
module.exports = router;
