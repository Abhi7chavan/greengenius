from confluent_kafka import Consumer

conf = {'bootstrap.servers': 'localhost:9092',
        'group.id': 'foo',
        'enable.auto.commit': 'false',
        'auto.offset.reset': 'earliest'}

consumer = Consumer(conf)