
    // Array to store selected items
    var selectedItems = []; 

    function generateLicense() {
        // Collect form data
        const formData = {
            name: document.getElementById('name').value,
            lastname: document.getElementById('lastname').value,
            username:document.getElementById('username').value, 
            email:document.getElementById('email').value,
            location: document.getElementById('location').value,
            information: Array.from(document.getElementsByName('information'))
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.value),
            householdItems: selectedItems, // Use the selectedItems array here
            submeters: document.getElementById('submeters').value,
        };
        if (formData.name === '' || formData.lastname === '' || formData.location === '') {
            document.getElementById('errorMessage').innerText = 'Please fill in all required fields.';
            return;
        }

        // Clear the error message if there are no issues
        document.getElementById('errorMessage').innerText = '';
        
        console.log(formData);


        fetch('http://127.0.0.1:8000/submit_license',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            document.getElementById('successMessage').innerText = 'Form submitted successfully!';
            document.getElementById('successMessage').style.display = 'block'; // Show the success message

        })
        .catch((error) => {
            console.error('Error:', error);
            // Handle errors here
        });
    }
        // document.getElementById('errorMessage').innerText = '';
        // Example: Display the generated license data in the console
        

        // You can send this data to your backend for further processing

        // Add your code to send the formData to the server or perform other actions


    $(document).ready(function () {
        // Event handler for dropdown item click
        $('#householdItems li').click(function () {
            var selectedItem = $(this).text();

            // Check if item is already selected
            if (selectedItems.indexOf(selectedItem) === -1) {
                // Add item to the array
                selectedItems.push(selectedItem);
            } else {
                // Remove item from the array if already selected
                selectedItems.splice(selectedItems.indexOf(selectedItem), 1);
            }

            // Update the display of selected items
            $('#selectedItems').text(selectedItems.join(', '));
        });
    });
