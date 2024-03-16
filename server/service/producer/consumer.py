from confluent_kafka import Consumer, KafkaError

# Replace with your actual server address and port
bootstrap_servers = "localhost:9092"
# Replace with your desired topic name
topic_name = "real_time_data"

# Consumer configuration
consumer_config = {
    'bootstrap.servers': bootstrap_servers,
    'group.id': 'my-group',  # Specify a unique consumer group ID
    'auto.offset.reset': 'earliest',  # Start consuming from the beginning of the topic if no offset is stored
    # Add more configuration parameters as needed
}

# Create a Kafka consumer instance
consumer = Consumer(consumer_config)

# Subscribe to the specified topic
consumer.subscribe([topic_name])

# Poll for new messages
try:
    while True:
        msg = consumer.poll(1.0)  # Set the timeout as needed

        if msg is None:
            continue
        if msg.error():
            if msg.error().code() == KafkaError._PARTITION_EOF:
                # End of partition event
                print("Reached end of partition, exiting.")
                break
            else:
                print("Error: {}".format(msg.error()))
        else:
            # Process the received message
            print("Received message: Key={}, Value={}".format(msg.key(), msg.value()))

except KeyboardInterrupt:
    pass
finally:
    # Close down consumer to commit final offsets.
    consumer.close()
