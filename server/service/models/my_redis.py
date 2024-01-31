import redis

redis_host = 'localhost'
redis_port = 6379
redis_password = 'redis123'

redis_client = redis.StrictRedis(
    host=redis_host,
    port=redis_port,
    password=redis_password,
    decode_responses=True,
    db = 0
)



try:
    response = redis_client.ping()
    print(f"Connected to Redis: {response}")
except redis.ConnectionError:
    print("Unable to connect to Redis server")