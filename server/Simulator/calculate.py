from datetime import datetime, timedelta

class EnergySimulator:
    def __init__(self, name, power, active_intervals):
        self.name = name
        self.power = power  # in watts
        self.active_intervals = active_intervals  # List of tuples with start and end times
        self.daily_consumption = 0
        self.weekly_consumption = 0
        self.monthly_consumption = 0
        self.current_runtime = 0
    
    def simulate_usage(self, current_time):
        for start, end in self.active_intervals:
            if start <= current_time < end:
                # Item is on during this interval
                self.current_runtime += 1  # increment runtime by 1 minute (or second)
                return True
        return False
    
    def calculate_consumption(self):
        # Calculate consumption for the current runtime
        current_consumption = (self.power * (self.current_runtime / 60)) / 1000  # kWh (assuming minute intervals)
        
        # Add to daily, weekly, and monthly totals
        self.daily_consumption += current_consumption
        self.weekly_consumption += current_consumption
        self.monthly_consumption += current_consumption
        
        # Reset runtime for the next period
        self.current_runtime = 0
    
    def reset_daily(self):
        self.daily_consumption = 0
    
    def reset_weekly(self):
        self.weekly_consumption = 0
    
    def reset_monthly(self):
        self.monthly_consumption = 0

# Define household items with specific usage patterns
items = [
    EnergySimulator("Fridge", 150, [(datetime.now(), datetime.now() + timedelta(hours=24))]),  # Fridge is always on
    EnergySimulator("TV", 100, [(datetime.now().replace(hour=18, minute=0, second=0), datetime.now().replace(hour=22, minute=0, second=0))]),  # TV runs in the evening
    EnergySimulator("Heater", 2000, [(datetime.now().replace(hour=6, minute=0, second=0), datetime.now().replace(hour=8, minute=0, second=0)),
                                     (datetime.now().replace(hour=18, minute=0, second=0), datetime.now().replace(hour=22, minute=0, second=0))]),  # Heater runs in the morning and evening
]

# Simulate usage over a month with minute intervals
start_time = datetime.now()
end_time = start_time + timedelta(days=30)

current_time = start_time
day_counter = 0

while current_time < end_time:
    print(f"Current time: {current_time.strftime('%Y-%m-%d %H:%M:%S')}")
    for item in items:
        is_on = item.simulate_usage(current_time)
        status = "ON" if is_on else "OFF"
        print(f"{item.name} is {status}")
    
    # Move time forward by 1 minute
    current_time += timedelta(minutes=1)

    # At the end of each day, calculate the daily consumption and reset the daily counter
    if current_time.hour == 0 and current_time.minute == 0:
        day_counter += 1
        for item in items:
            item.calculate_consumption()
            print(f"End of day {day_counter}: {item.name} consumed {item.daily_consumption:.2f} kWh")
            item.reset_daily()

        # At the end of each week (7 days), reset the weekly counter
        if day_counter % 7 == 0:
            for item in items:
                print(f"End of week {day_counter // 7}: {item.name} consumed {item.weekly_consumption:.2f} kWh")
                item.reset_weekly()

        # At the end of the month (30 days), reset the monthly counter
        if day_counter % 30 == 0:
            for item in items:
                print(f"End of month: {item.name} consumed {item.monthly_consumption:.2f} kWh")
                item.reset_monthly()
    
    time.sleep(0.1)  # Simulate time passage (reduce this for faster simulation)

# Final consumption reports
for item in items:
    item.calculate_consumption()  # Final calculation for the last period
    print(f"Total Monthly Consumption for {item.name}: {item.monthly_consumption:.2f} kWh")
