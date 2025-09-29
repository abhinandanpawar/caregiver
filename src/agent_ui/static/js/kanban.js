document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('kanban-board');
    const modal = document.getElementById('add-task-modal');
    const addTaskBtn = document.getElementById('add-task-btn');
    const closeModalBtn = document.querySelector('.close-btn');
    const addTaskForm = document.getElementById('add-task-form');

    let boardData = null;

    // --- API Functions ---
    const api = {
        getBoard: async () => {
            try {
                const response = await fetch('/api/board');
                if (!response.ok) throw new Error('Failed to fetch board data.');
                return await response.json();
            } catch (error) {
                console.error('Error fetching board:', error);
                return null;
            }
        },
        saveBoard: async (data) => {
            try {
                const response = await fetch('/api/board', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                if (!response.ok) throw new Error('Failed to save board data.');
                return await response.json();
            } catch (error) {
                console.error('Error saving board:', error);
            }
        }
    };

    // --- Render Functions ---
    const renderBoard = () => {
        if (!boardData || !board) return;
        board.innerHTML = ''; // Clear existing board

        boardData.columns.forEach(column => {
            const columnEl = document.createElement('div');
            columnEl.className = 'kanban-column';
            columnEl.dataset.columnId = column.id;

            const titleEl = document.createElement('h3');
            titleEl.textContent = column.title;
            columnEl.appendChild(titleEl);

            const tasksContainer = document.createElement('div');
            tasksContainer.className = 'tasks-container';
            tasksContainer.dataset.columnId = column.id; // For SortableJS
            columnEl.appendChild(tasksContainer);

            column.tasks.forEach(task => {
                const taskEl = document.createElement('div');
                taskEl.className = 'kanban-task';
                taskEl.textContent = task.content;
                taskEl.dataset.taskId = task.id;
                tasksContainer.appendChild(taskEl);
            });
            board.appendChild(columnEl);
        });
    };

    // --- Modal Handling ---
    addTaskBtn.onclick = () => modal.style.display = 'block';
    closeModalBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // --- Form Handling ---
    addTaskForm.onsubmit = async (event) => {
        event.preventDefault();
        const taskContentInput = document.getElementById('task-content');
        const content = taskContentInput.value.trim();

        if (content && boardData) {
            const newTask = {
                id: `task-${Date.now()}`,
                content: content,
            };

            // Add new task to the first column ("To Do")
            boardData.columns[0].tasks.push(newTask);

            await api.saveBoard(boardData);
            renderBoard(); // Re-render the board with the new task

            taskContentInput.value = '';
            modal.style.display = 'none';
        }
    };

    const setupDragAndDrop = () => {
        const containers = document.querySelectorAll('.tasks-container');
        containers.forEach(container => {
            new Sortable(container, {
                group: 'kanban', // Allows moving items between containers
                animation: 150,
                onEnd: async (evt) => {
                    const taskId = evt.item.dataset.taskId;
                    const newColumnId = evt.to.dataset.columnId;
                    const oldColumnId = evt.from.dataset.columnId;

                    // Find the task and move it in the data structure
                    const oldColumn = boardData.columns.find(c => c.id === oldColumnId);
                    const taskIndex = oldColumn.tasks.findIndex(t => t.id === taskId);
                    const [task] = oldColumn.tasks.splice(taskIndex, 1);

                    const newColumn = boardData.columns.find(c => c.id === newColumnId);
                    // Insert at the new position
                    newColumn.tasks.splice(evt.newDraggableIndex, 0, task);

                    // Save the updated board state
                    await api.saveBoard(boardData);
                },
            });
        });
    };

    // --- Initial Load ---
    const init = async () => {
        boardData = await api.getBoard();
        renderBoard();
        setupDragAndDrop(); // Initialize SortableJS after rendering
    };

    // Re-initialize drag and drop after re-rendering
    const originalRenderBoard = renderBoard;
    renderBoard = () => {
        originalRenderBoard();
        setupDragAndDrop();
    };

    init();
});