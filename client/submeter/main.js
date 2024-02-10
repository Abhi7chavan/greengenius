

// Initialize submeterNames as an empty array
let submeterNames = [];

// Declare backendData outside the fetchUserId function
let backendData = {};

function fetchUserId() {
    const username = localStorage.getItem('username');

    if (!username) {
        console.error('User ID not found in localStorage.');
        return Promise.reject('User ID not found in localStorage.');
    }

    return fetch(`http://127.0.0.1:8000/get_user/${username}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.statuscode !== 200) {
            document.getElementById('errorMessage').innerText = data.message;
            return Promise.reject(data.message);
        } else {
            console.log('Success:', data);

            const submeterCount = data.data.SubmeterCount;
            const householdItems = data.data.HouseholdItems;

            // Update submeterNames with fetched data
            submeterNames = Array.from({ length: submeterCount }, (_, i) => `Submeter ${i + 1}`);

            // Update the global backendData variable
            backendData = {
                submeters: submeterCount,
                items: householdItems,
            };

            console.log('Backend Data:', backendData);
            return backendData;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('errorMessage').innerText = 'Error fetching user data.';
        return Promise.reject('Error fetching user data.');
    });
}


const associations = {};
// const submeterNames = Array.from({ length: backendData.submeters }, (_, i) => `Submeter ${i + 1}`);

function createSubmeterOptions() {
    const submeterContainer = document.getElementById('submeterContainer');
    submeterContainer.innerHTML = ''; // Clear previous content

    for (let i = 0; i < backendData.submeters; i++) {
        const submeterBlock = document.createElement('div');
        submeterBlock.className = 'submeterBlock';

        const blockTitle = document.createElement('div');
        blockTitle.className = 'blockTitle';
        // blockTitle.innerText = submeterNames[i];

        const submeterNameInput = document.createElement('input');
        // submeterNameInput.type = 'text';
        submeterNameInput.value = submeterNames[i];
        submeterNameInput.placeholder = 'Enter Submeter Name';
        submeterNameInput.addEventListener('input', function () {
            submeterNames[i] = submeterNameInput.value;
            // blockTitle.innerText = submeterNames[i];
        });

        const submeterDiv = document.createElement('div');

        const submeterLabel = document.createElement('label');
        submeterLabel.innerText = 'Select Item: ';

        const submeterSelect = document.createElement('select');
        submeterSelect.name = `submeter${i + 1}`;
        submeterSelect.dataset.submeter = i + 1;
        submeterSelect.disabled = i > 0; // Disable subsequent dropdowns

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.innerText = 'Choose Item';
        submeterSelect.appendChild(defaultOption);

        const remainingItems = getRemainingItems();
        remainingItems.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.innerText = item;
            submeterSelect.appendChild(option);
        });

        submeterSelect.addEventListener('change', function () {
            associate(submeterSelect, i + 1);
        });

        const doneButton = document.createElement('button');
        doneButton.innerText = 'Done';
        doneButton.onclick = function () {
            enableNextDropdown(i + 1);
        };
        submeterDiv.appendChild(submeterLabel);
        submeterDiv.appendChild(submeterSelect);
        submeterDiv.appendChild(doneButton);

        const selectedItemsDiv = document.createElement('div');
        selectedItemsDiv.className = 'selectedItems';

        if (associations[i + 1]) {
            associations[i + 1].items.forEach(selectedItem => {
                const span = document.createElement('span');
                span.innerText = selectedItem;
                selectedItemsDiv.appendChild(span);
            });
        }

        submeterBlock.appendChild(submeterNameInput);
        submeterBlock.appendChild(blockTitle);
        submeterBlock.appendChild(submeterDiv);
        submeterBlock.appendChild(selectedItemsDiv);

        submeterContainer.appendChild(submeterBlock);
    }
}

function associate(submeterSelect, submeterIndex) {
    const submeter = parseInt(submeterSelect.dataset.submeter);
    const item = submeterSelect.value;

    if (!associations[submeter]) {
        associations[submeter] = { name: submeterNames[submeter - 1], items: [] };
    }

    associations[submeter].items.push(item);

    for (let i = 1; i <= backendData.submeters; i++) {
        const otherSubmeterSelect = document.querySelector(`select[data-submeter="${i}"]`);
        if (otherSubmeterSelect) {
            const index = Array.from(otherSubmeterSelect.options).findIndex(option => option.value === item);
            if (index !== -1) {
                otherSubmeterSelect.remove(index);
            }
        }
    }
    
    createSubmeterOptions();
}

function enableNextDropdown(currentSubmeter) {
    const nextSubmeter = currentSubmeter + 1;
    const nextSubmeterSelect = document.querySelector(`select[data-submeter="${nextSubmeter}"]`);
    if (nextSubmeterSelect) {
        nextSubmeterSelect.disabled = false;
    }
}

function getRemainingItems() {
    const selectedItems = Object.values(associations).flatMap(association => association.items);
    return backendData.items.filter(item => !selectedItems.includes(item));
}

function submitData() {
    console.log('Associations:', associations);
    alert("Successfully submited data!")
}

window.onload = function () {
    fetchUserId()
        .then(backendData => {
            createSubmeterOptions();
        })
        .catch(error => {
            console.error('Error in window.onload:', error);
        });
};