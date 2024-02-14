// const responseData = {
//     "statuscode": 200,
//     "data": {
//         "associations": {
//             "kichan": [
//                 "Refrigerator",
//                 "Washing Machine",
//                 "Laptop/Desktop Computer"
//             ],
//             "bedroom": [
//                 "LED Light Bulbs"
//             ]
//             ,
//             "hall":["TV"]
//             ,"Bathroom":["hiter"]
//         },
//         "username": "abhi07",
//         "created_at": 1707757713,
//         "updated_at": 0,
//         "id": "5a0cf337-c9c9-11ee-a89a-28d0ea322e3a"
//     }
// };

// Sample data for energy consumption details
// const energyConsumptionDetails = {
//     "Refrigerator": {
//         "usage_duration": 2,
//         "usage_frequency": 0.1,
//         "electricity":"22 watt"
//     },
//     "Washing Machine": {
//         "usage_duration": 1.5,
//         "usage_frequency": 0.2
//     },
//     "Laptop/Desktop Computer": {
//         "usage_duration": 3,
//         "usage_frequency": 0.15
//     },
//     "LED Light Bulbs": {
//         "usage_duration": 1,
//         "usage_frequency": 0.3
//     }
//     ,
//     "TV":{
//         "usage_duration": 1,
//         "usage_frequency": 0.3

//     },
//     "hiter":{
//         "usage_duration": 1,
//         "usage_frequency": 0.3
//     }
// };

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

            // Add energy consumption details to each appliance item
            const energyDetails = getitemdata();
            const details = energyDetails[appliance];
            if (details) {
                const detailsList = document.createElement('ul');
                detailsList.className = 'details-list';

                for (const [key, value] of Object.entries(details)) {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${key}: ${value}`;
                    detailsList.appendChild(listItem);
                }

                applianceItem.appendChild(detailsList);
            }

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
  .then(data => {
    debugger
    displayAssociations(data.data);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

}

function getitemdata() {
    username = localStorage.getItem("username")
    debugger
    const apiUrl = `http://127.0.0.1:8000/get_electric/${username}`;

    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            debugger
            const energyConsumptionDetails = data.items;
            return energyConsumptionDetails;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Use the async/await pattern to handle asynchronous code

    


// Call fetchData to initiate the process
function onPageLoad() {
get_submeters()
}

window.onload = onPageLoad;
// displayAssociations(responseData.data);
