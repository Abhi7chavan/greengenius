function displayAssociations(data) {
    const associationsContainer = document.getElementById('associations-container');

    for (const [submeterName, appliances] of Object.entries(data.associations)) {
        const outerContainer = document.createElement('div');
        outerContainer.className = 'outer-container';

        const submeterBlock = document.createElement('div');
        submeterBlock.className = 'submeter-block';

        const submeterNameDiv = document.createElement('div');
        submeterNameDiv.className = 'submeter-name';
        submeterNameDiv.textContent = submeterName;

        const appliancesBlock = document.createElement('div');
        appliancesBlock.className = 'appliances-block';

        appliances.forEach(appliance => {
            const applianceItem = document.createElement('div');
            applianceItem.className = 'appliance-item';
            applianceItem.textContent = appliance;

            const detailsList = document.createElement('ul');
            detailsList.className = 'details-list';

            // Function to update details for a specific appliance
            const updateDetails = (realTimeData) => {
                try {
                    const energyDetails = JSON.parse(realTimeData).items; // Parse the received real-time data
                    let total_consumption = JSON.parse(realTimeData).total_consumption;
                    const details = energyDetails[appliance];
            
                    // Clear previous details
                    detailsList.innerHTML = '';
            
                    // Display total consumption
                    const total_consumption_shower = document.createElement('p');
                    total_consumption_shower.textContent = `Total Consumption: ${total_consumption}`;
                    total_consumption_shower.style.fontWeight = 'bold';
                    detailsList.appendChild(total_consumption_shower);
            
                    // Append new details
                    try {
                        if (details) {
                            // Append new details
                            for (const [key, value] of Object.entries(details)) {
                                const listItem = document.createElement('li');
                                const ison = document.createElement('img');
                                ison.classList.add('weather-icon', 'rounded-full');
                                ison.style.width = '40px'; // Adjust the width as needed
                                ison.style.height = '40px'; // Adjust the height as needed
                                ison.style.display = 'block';
                                ison.style.margin = 'auto';
                                const isonImagePath = '/client/images/switch.png';
                                const isoffImagePath = '/client/images/turn-off.png';
            
                                if (key === "is_on") {
                                    if (value === true) {
                                        ison.setAttribute('src', isonImagePath);
                                    } else {
                                        ison.setAttribute('src', isoffImagePath);
                                    }
                                    detailsList.appendChild(ison);
                                } else {
                                    listItem.textContent = `${key}: ${value}`;
                                    detailsList.appendChild(listItem);
                                }
                            }
                        } else {
                            // Display a message when details are not found
                            const listItem = document.createElement('li');
                            listItem.textContent = 'Data not found';
                            listItem.className = 'details-not-found';
                            detailsList.appendChild(listItem);
                        }
                    } catch (error) {
                        console.error('Error updating details:', error);
                    }
                } catch (error) {
                    console.error('Error parsing real-time data:', error);
                }
            };
            
                    
            
                    
            // Initial call to update details
            updateDetails(data); // Pass the initial data

            // Subscribe to real-time updates
            const socket = io('http://localhost:3000');
            socket.on('message', (realTimeData) => {
                // Call the updateDetails function when real-time data is received
                updateDetails(realTimeData);
            });

            applianceItem.appendChild(detailsList);
            appliancesBlock.appendChild(applianceItem);
        });

        submeterBlock.appendChild(submeterNameDiv);
        submeterBlock.appendChild(appliancesBlock);

        outerContainer.appendChild(submeterBlock);
        associationsContainer.appendChild(outerContainer);
    }
}



function get_submeters(){
    username = localStorage.getItem("username")
    const apiUrl = `http://127.0.0.1:8000/get_submeters/${username}`;
    
    fetch(apiUrl)
      .then(response => response.json())
      .then(data_submeters => {
       
        displayAssociations(data_submeters.data);
    // Listen for server messages
        
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    
    }
    
    function onPageLoad() {
    
    get_submeters()
    }
    
    window.onload = onPageLoad;
    