---
guid: "UPDATE THIS"
title: "GET FROM GDOC"
description: "FILL THIS IN"
pubDate: "CONVERT THIS FROM THE EPISODE DATE AND RFC FORMAT" # 6pm New York time
itunes-explicit: false
itunes-episode: GET_FROM_GDOC
itunes-episodeType: Full

# More info
youtube-full: GET_FROM_GDOC
#youtube-cuts: 
#  - name: ADD_ELEMENTS_IF_ANY
#    url: ADD_IF_ANY
discussion: GET_TWITTER_WRAP_UP_LINK_FROM_GDOC

# Timeline
timeline:
# USE CODEX TO CONVERT YOUTUBE FORMAT TO REQUIRED FORMAT HERE

# File information
enclosure-url: "GET THIS EPISODE DATE AND NUMBER"
enclosure-length: NEED_FINAL_FILE_WITH_METADATA_FOR_THIS
enclosure-type: "audio/x-m4a"
itunes-duration: NEED_FINAL_FILE_WITH_METADATA_FOR_THIS
---



That is incorrect. I need the following:
```
title: "[EPISODE NAME]" # Do not include the episode number here.
description: "[DESCRIPTION]"
pubDate: "[DDD, DD MM YYYY 18:00:00 -0500]" # 6pm New York time
itunes-explicit: false
itunes-episode: [EPISODE NUMBER]
itunes-episodeType: Full

# More info
youtube-full: [YOUTUBE LINK]
discussion: [WRAP UP TWEET LINK]

# Timeline
timeline:
  - seconds: [FIRST TIMESTAMP]
    title: [FIRST TIMESTAMP TITLE] # The titles here should not be in quotation marks.
  - seconds: [SECOND TIMESTAMP]
    title: [SECOND TIMESTAMP TITLE]
  ...
```