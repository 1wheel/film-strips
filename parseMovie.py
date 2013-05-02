#!/usr/bin/env python

import sys,os,re
from subprocess import *
from PIL import Image
import json


def parseMovie(fileName, outputDir):
	frames = 600

	output = Popen(["ffmpeg", "-i", fileName], stderr=PIPE).communicate()
	print output

	# searching and parsing "Duration: 00:05:24.13," from ffmpeg stderr, ignoring the centiseconds
	re_duration = re.compile("Duration: (.*?)\.")
	duration = re_duration.search(output[1]).groups()[0]

	seconds = reduce(lambda x,y:x*60+y,map(int,duration.split(":")))
	rate = frames/float(seconds)

	print "Duration = %s (%i seconds)" % (duration, seconds)
	print "Capturing one frame every %.1f seconds" % (1/rate)

	output = Popen(["ffmpeg", "-i", fileName, "-r", str(rate), outputDir + '%d.jpg']).communicate()


def parseImage(filename):
	i = Image.open(filename)

	# save thumbnail
	size = 180,101
	i.thumbnail(size, Image.ANTIALIAS)
	i.save(filename + "." + "t", "JPEG")

	h = i.histogram()
	# split into red, green, blue
	r = h[0:256]
	g = h[256:256*2]
	b = h[256*2: 256*3]
 
	# perform the weighted average of each channel:
	# the *index* is the channel value, and the *value* is its weight
	red = sum( i*w for i, w in enumerate(r) ) / sum(r)
	blue = sum( i*w for i, w in enumerate(g) ) / sum(g)
	green = sum( i*w for i, w in enumerate(b) ) / sum(b)

	return str(red) + ',' + str(blue) + ',' + str(green)


imgDir = 'movieStills/';
movieDir = 'oscar/'

movieFiles =  os.listdir(movieDir)
movieJSON = []
for movie in movieFiles:
	movieJSON.append(movie.split(".")[0])

print movieJSON
with open('movies.json', 'w') as outfile:
		json.dump(movieJSON, outfile)

for movieFile in movieFiles:
	outputDir = imgDir + movieFile.split(".")[0] + '/'
	parseMovie(movieDir + movieFile, outputDir)
	colors = []
	
	for i in range(1,600):
		colors.append({'rgb':parseImage(outputDir + str(i) + '.jpg'), 'i': i})

	with open(outputDir + 'colors.json', 'w') as outfile:
		json.dump(colors, outfile)

