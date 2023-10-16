document.addEventListener('DOMContentLoaded', function () {

    const tasksAndNotes = {};

    // Function to handle the form submission
    document.getElementById('taskForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const taskInput = document.getElementById('taskInput');
        const taskDate = document.getElementById('taskDate');
        
        if (taskInput.value === '' || taskDate.value === '') {
            alert('Please add a task and date.');
            return;
        }

        // Create a new task element
        const taskElement = document.createElement('div');
        taskElement.classList.add('task-item');

        // Create a separate notes array for this task
        const notesArray = [];

        // Add the task text and the "Days since progress: 0" text
        taskElement.innerHTML = `
            <div class="listObject">
                <p>${taskInput.value} - <span class="task-date">${taskDate.value}</span></p>
                <div class="days-since"> Days since progress: 0 </div> <!-- Initialize with 0 -->
                <img id='notes' src='./images/notepad1.png' alt='image of a notepad'>
                <img id='delete' src='./images/trash.png' alt='image of a trash can'>
            </div>
        `;

        taskElement.classList.add("itemsClass");

        // Append the task to the task list
        document.getElementById('taskList').appendChild(taskElement);

        // Start the days since progress counter
        updateDaysSince(taskElement, taskDate.value);

        // Clear the input
        taskInput.value = '';
        taskDate.value = '';

        // Create a notes pop-up
        const notesImage = taskElement.querySelector('#notes');
        notesImage.addEventListener('click', function () {
            openNotesModal(taskElement);
        })

        // Delete a list item
        const deleteItem = taskElement.querySelector('#delete');

        deleteItem.addEventListener('click', function() {
            taskElement.remove();
        });

        // Store the task element and its associate notes array
        tasksAndNotes[taskElement.id] = {
            element: taskElement,
            notesArray: notesArray
        };    
    });

    function updateDaysSince(taskElement, dateString) {
        // Ensure dateString is in a valid format, e.g., "YYYY-MM-DD"
        if (!dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            console.error('Invalid date format. Expected YYYY-MM-DD');
            return;
        }

        const startDate = new Date(dateString);
        startDate.setHours(0, 0, 0, 0); // Reset the time part to the start of the day

        const daysSinceDiv = taskElement.querySelector('.days-since');

        function update() {
            // Get the current date and reset the time part to the start of the day
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Calculate the difference in days
            const diffTime = today - startDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            // Update the div content
            daysSinceDiv.textContent = `Days since progress: ${diffDays}`;
        }

        update(); // Update immediately
        setInterval(update, 60000); // Update every minute
    }
    function openNotesModal(taskElement) {
        const notesArray = []
        const notesWindow = document.createElement('div');
        notesWindow.classList.add('popup');
        notesWindow.innerHTML = `
            <div class="notes-popup">
                <h2>Add note:</h2>
                <textarea id="noteInput" rows="4" cols="50"></textarea>
                <button id="saveNote">Save.</button>
            </div>
        `;

    // Append the modal to the task element
    taskElement.appendChild(notesWindow);

    // Add an event listener to the save button inside the modal
    const saveButton = notesWindow.querySelector('#saveNote');
    saveButton.addEventListener('click', function() {
        const noteInput = notesWindow.querySelector('#noteInput').value;
        
        // Reset the days since progress tracker
        const taskDate = taskElement.querySelector('.task-date').textContent;
        updateDaysSince(taskElement, taskDate);

        // Store the note in the notesArray
        notesArray.push({
            taskDate: taskDate,
            note: noteInput
        });

        // Display the notes below the list item
        let noteItem = '';
        const noteLog = document.createElement('div');
        noteLog.classList.add('noteLog');

        for (const i of notesArray) {
            const noteItem = document.createElement('div');
            noteItem.classList.add('noteItem');
            noteItem.innerHTML = `
                <p><strong>Date</strong>: ${i.taskDate}</p>
                <p><strong>Note</strong>: ${i.note}</p>
            `;
            noteLog.appendChild(noteItem);
        }

        taskElement.appendChild(noteLog);

        // Remove the modal
        notesWindow.remove();
    });
    }
});

