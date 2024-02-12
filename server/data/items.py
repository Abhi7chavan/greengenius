import random
import time
import json

household_items = {
    "Dishwasher": {"watt_range": (1200, 1500), "is_on": True, "status": "cool"},
    "Microwave": {"watt_range": (966, 1723), "is_on": True, "status": "cool"},
    "Oven": {"watt_range": (2150, 2150), "is_on": True, "status": "cool"},
    "Coffee Maker": {"watt_range": (800, 1400), "is_on": True, "status": "cool"},
    "Refrigerator": {"watt_range": (150, 400), "is_on": True, "status": "cool"},
    "Laptop": {"watt_range": (50, 100), "is_on": True, "status": "cool"},
    "Flat screen TV": {"watt_range": (60, 115), "is_on": True, "status": "cool"},
    "Washing Machine": {"watt_range": (500, 500), "is_on": True, "status": "cool"},
    "Dryer": {"watt_range": (1000, 4000), "is_on": True, "status": "cool"},
    "AC": {"watt_range": (1000, 4000), "is_on": True, "status": "cool"},
    "Window AC": {"watt_range": (800, 2000), "is_on": True, "status": "cool"},
}

electric_parameters = {"voltage": 120, "power_factor": 0.9}

def generate_real_time_data():
    while True:
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        data = {"timestamp": timestamp, "items": []}
        total_consumption = 0

        for item, details in household_items.items():
            if details["is_on"]:
                wattage = random.randint(details["watt_range"][0], details["watt_range"][1])
                total_consumption += wattage
                status = "hot" if wattage == details["watt_range"][1] else "cool"
                details["status"] = status
                item_data = {"name": item, "wattage": wattage, "status": status}
                data["items"].append(item_data)
            else:
                item_data = {"name": item, "wattage": 0, "status": "OFF"}
                data["items"].append(item_data)

        data["total_consumption"] = total_consumption
        data["electric_parameters"] = electric_parameters
        json_data = json.dumps(data, indent=2)
        print(json_data)  # Print the JSON data
        time.sleep(60)  # Generate data every minute

if __name__ == "__main__":
    generate_real_time_data()
