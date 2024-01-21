import time
import random
from datetime import datetime

def generate_realtime_data():
    while True:
        # Get current date and time
        current_datetime = datetime.now().strftime("%Y-%m-%d;%H:%M:%S")

        # Generate random values for other fields
        global_active_power = round(random.uniform(0.5, 5.0), 2)
        global_reactive_power = round(random.uniform(0.1, 2.0), 2)
        voltage = round(random.uniform(220, 240), 2)
        global_intensity = round(global_active_power / voltage, 2)  # Assuming Ohm's Law: P = IV
        sub_metering_1 = round(random.uniform(0.0, 2.0), 2)
        sub_metering_2 = round(random.uniform(0.0, 2.0), 2)
        sub_metering_3 = round(random.uniform(0.0, 2.0), 2)

        # Format the data
        data = f"{current_datetime};{global_active_power};{global_reactive_power};{voltage};{global_intensity};{sub_metering_1};{sub_metering_2};{sub_metering_3}"

        # Print or send the generated data (you can modify this part based on your requirements)
        print(data)

        # Sleep for a specified interval (e.g., 1 second)
        time.sleep(1)

if __name__ == "__main__":
    generate_realtime_data()
