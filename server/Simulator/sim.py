import time
from datetime import datetime, timedelta

class EnergySimulator:
    def __init__(self, name, power, active_intervals):
        self.name = name
        self.power = power  # in watts
        self.active_intervals = active_intervals  # List of tuples with start and end times
        self.current_runtime = 0
        self.total_consumption = 0
    
    def simulate_usage(self, current_time):
        for start, end in self.active_intervals:
            if start <= current_time < end:
                # Item is on during this interval
                self.current_runtime += 1  # increment runtime by 1 minute (or second)
                return True
        return False
    
    def calculate_consumption(self):
        self.total_consumption = (self.power * (self.current_runtime / 60)) / 1000  # kWh (assuming minute intervals)
        return self.total_consumption

# Define household items with specific usage patterns
items = [
    EnergySimulator("Fridge", 150, [(datetime.now(), datetime.now() + timedelta(hours=24))]),  # Fridge is always on
    EnergySimulator("TV", 100, [(datetime.now().replace(hour=18, minute=0, second=0), datetime.now().replace(hour=22, minute=0, second=0))]),  # TV runs in the evening
    EnergySimulator("Heater", 2000, [(datetime.now().replace(hour=6, minute=0, second=0), datetime.now().replace(hour=8, minute=0, second=0)),
                                     (datetime.now().replace(hour=18, minute=0, second=0), datetime.now().replace(hour=22, minute=0, second=0))]),  # Heater runs in the morning and evening
]

# Simulate usage over a day with minute intervals
start_time = datetime.now()
end_time = start_time + timedelta(hours=24)

current_time = start_time

while current_time < end_time:
    print(f"Current time: {current_time.strftime('%Y-%m-%d %H:%M:%S')}")
    for item in items:
        is_on = item.simulate_usage(current_time)
        status = "ON" if is_on else "OFF"
        print(f"{item.name} is {status}")
    
    time.sleep(1)  # Simulate 1 minute passing in 1 second
    current_time += timedelta(minutes=1)  # Move time forward by 1 minute

# Calculate and print total consumption for each item
    for item in items:
        consumption = item.calculate_consumption()
        print(f"{item.name} consumed {consumption:.2f} kWh in total.")
