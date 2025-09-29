document.addEventListener('DOMContentLoaded', () => {
    const addGoalForm = document.getElementById('add-goal-form');
    const goalContentInput = document.getElementById('goal-content');
    const activeGoalsList = document.getElementById('active-goals-list');
    const completedGoalsList = document.getElementById('completed-goals-list');

    let goals = [];

    // --- API Functions ---
    const api = {
        getGoals: async () => {
            try {
                const res = await fetch('/api/goals');
                return await res.json();
            } catch (err) {
                console.error("Error fetching goals:", err);
                return { goals: [] };
            }
        },
        addGoal: async (content) => {
            try {
                await fetch('/api/goals', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content }),
                });
            } catch (err) {
                console.error("Error adding goal:", err);
            }
        },
        updateGoalStatus: async (id, status) => {
            try {
                await fetch(`/api/goals/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status }),
                });
            } catch (err) {
                console.error("Error updating goal:", err);
            }
        },
        deleteGoal: async (id) => {
            try {
                await fetch(`/api/goals/${id}`, { method: 'DELETE' });
            } catch (err) {
                console.error("Error deleting goal:", err);
            }
        }
    };

    // --- Render Function ---
    const renderGoals = () => {
        activeGoalsList.innerHTML = '';
        completedGoalsList.innerHTML = '';

        if (!goals || goals.length === 0) {
            activeGoalsList.innerHTML = '<li>No active goals yet. Add one above!</li>';
            return;
        }

        goals.forEach(goal => {
            const li = document.createElement('li');
            li.className = goal.status;
            li.dataset.id = goal.id;

            const contentSpan = document.createElement('span');
            contentSpan.className = 'goal-content';
            contentSpan.textContent = goal.content;
            li.appendChild(contentSpan);

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'goal-actions';

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => handleDelete(goal.id);

            if (goal.status === 'active') {
                const completeBtn = document.createElement('button');
                completeBtn.className = 'complete-btn';
                completeBtn.textContent = 'Complete';
                completeBtn.onclick = () => handleStatusUpdate(goal.id, 'completed');
                actionsDiv.appendChild(completeBtn);
                activeGoalsList.appendChild(li);
            } else {
                const undoBtn = document.createElement('button');
                undoBtn.className = 'undo-btn';
                undoBtn.textContent = 'Undo';
                undoBtn.onclick = () => handleStatusUpdate(goal.id, 'active');
                actionsDiv.appendChild(undoBtn);
                completedGoalsList.appendChild(li);
            }

            actionsDiv.appendChild(deleteBtn);
            li.appendChild(actionsDiv);
        });
    };

    // --- Event Handlers ---
    const handleAddGoal = async (e) => {
        e.preventDefault();
        const content = goalContentInput.value.trim();
        if (content) {
            await api.addGoal(content);
            goalContentInput.value = '';
            await fetchAndRenderGoals();
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        await api.updateGoalStatus(id, newStatus);
        await fetchAndRenderGoals();
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this goal?')) {
            await api.deleteGoal(id);
            await fetchAndRenderGoals();
        }
    };

    // --- Initial Load ---
    const fetchAndRenderGoals = async () => {
        const data = await api.getGoals();
        goals = data.goals;
        renderGoals();
    };

    addGoalForm.addEventListener('submit', handleAddGoal);
    fetchAndRenderGoals();
});