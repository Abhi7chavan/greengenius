import time
from confluent_kafka import Producer

# Minimal configuration for local Kafka (modify if necessary)
config = {
    'bootstrap.servers': 'localhost:9092',
}

# Create Producer instance
producer = Producer(config)

# Define basic key/value serialization (if needed)
def key_serializer(key):
    return key.encode('utf-8')

def value_serializer(value):
    return value.encode('utf-8')

# Send messages
for message_count in range(1000):
    message = f"Message number {message_count}"
    producer.produce('real_time_data', key=f"key-{message_count}", value=value_serializer(message))

# Poll for delivery results
producer.poll(0.1)

# Flush outstanding messages and close producer
producer.flush()