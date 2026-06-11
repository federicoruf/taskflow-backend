const createTask = async (req, res) => {
    const { title, description, assignedTo } = req.body; 
  
    try {
      const task = await Task.create({
        title,
        description,
        assignedTo,
        user: req.user.id,
      });
  
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la tarea', error: error.message });
    }
  };