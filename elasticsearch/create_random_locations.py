import requests

URL = 'https://api.3geonames.org/?randomland=yes&json=1'
FILE_NAME = "result_coordinates.txt"


def main():

    output_file = open(FILE_NAME, "a")
    input_file = open('input.csv', 'r')
    i = 821612
    for _ in range(i):
        line = str(input_file.readline())

    while True:

        line = str(input_file.readline())
        if not line:
            break

        result = requests.get(url=URL)
        coordinates = result.json()["nearest"]
        lat = str(coordinates["latt"])
        lon = str(coordinates["longt"])

        values = line.split(',')
        
        values[1] = lat
        values[2] = lon
        
        new_coordinate = ','.join(values) 
        output_file.write(new_coordinate)

        i += 1
        print(i)

    output_file.close()
    input_file.close()

if  __name__ == '__main__':
    main()