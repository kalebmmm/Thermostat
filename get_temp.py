import Adafruit_DHT
humidity, temperature = Adafruit_DHT.read_retry(Adafruit_DHT.AM2302, 4)
print(round(temperature, 4))