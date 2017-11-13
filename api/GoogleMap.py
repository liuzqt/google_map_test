# encoding: utf-8

'''

@author: ZiqiLiu


@file: GoogleMap.py

@time: 2017/11/12 上午2:27

@desc:
'''
import requests

KEY = 'AIzaSyB4IjJwNSGX9FNGnMW1nKgaLcuqN8s7hv0'
URL = 'https://maps.googleapis.com/maps/api/geocode/json?address=%s&key=%s'


def geocoding(address):
    encoding_addr = '+'.join(address.split())
    res = requests.get(URL % (encoding_addr, KEY)).json()[
        'results'][0]
    coordinate = res['geometry']['location']
    viewpoint = res['geometry']['viewport']

    return coordinate, viewpoint


if __name__ == '__main__':
    print(geocoding(
        'DFO Homebush, Underwood Road, Homebush, New South Wales, Australia'))
