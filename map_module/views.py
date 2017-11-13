# encoding: utf-8

'''

@author: ZiqiLiu


@file: views.py

@time: 2017/11/12 上午12:22

@desc:
'''

from django.shortcuts import render


def get_map(request):
    return render(request, 'search.html')
