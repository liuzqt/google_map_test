# encoding: utf-8

'''

@author: ZiqiLiu


@file: google_place.py

@time: 2017/11/12 下午8:45

@desc:
'''
import requests
from api.GooglePlaces import GooglePlaces, types, GooglePlacesError
import time
import pickle
from tqdm import tqdm

KEY = 'AIzaSyB4IjJwNSGX9FNGnMW1nKgaLcuqN8s7hv0'


class GooglePlaceWrap:
    KEY = 'AIzaSyCuCW_ZKBu7U07oEcKz_7hcElbiI02k2VE'
    TYPE = types.TYPE_REAL_ESTATE_AGENCY
    RADIUS = 600

    def __init__(self):
        self.google = GooglePlaces(self.KEY)

    def search_agency(self, coordinate, radius=RADIUS):
        places = []

        result_set = self.google.nearby_search(
            lat_lng=coordinate,
            radius=radius, type=self.TYPE)
        places.extend(result_set.places)
        while result_set.has_next_page_token:
            try:
                time.sleep(2)
                next_page = self.google.nearby_search(
                    pagetoken=result_set.next_page_token)
                result_set = next_page
                places.extend(result_set.places)
            except GooglePlacesError as e:
                print(e)
                time.sleep(1)
        print(places)
        return places


if __name__ == '__main__':
    wrapper = GooglePlaceWrap()
    wrapper.search_agency(30.2699278, -97.7531634)
