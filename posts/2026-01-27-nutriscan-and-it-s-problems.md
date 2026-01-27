---
title: "NutriScan and it's problems"
date: 2026-01-27
---

Honestly nutriscan was my first app.  
<br><br>
Basically I was in a mart and I saw a packet of marshmallows, now I do have a small habit of reading ingredients and checking the expiration date before purchasing anything packaged and on the marshmallows the ingredients were kinda unclear.  
<br><br>
So I had to take help of Gemini Live AI to understand. But looking back explaining gemini what to do was a job itself.  
<br><br>
Then I realised on the cashier counter that all it needs is scan the bar code to know the name of the products then with the name we can look for FSSAI database to know its nutritional value, thats how the idea came.  
<br><br>

## The Idea

So initially I started making a scanner that'll scan and return the data in the barcode.  
<br><br>
While making I found the OpenFoodFacts its an open source database for food info. I thought using their api key will be a reliable way to do as manually searching was slow and I couldn't find FSSAI public database anywhere.  
<br><br>

## Web Version

So I started working on nutriscan for web, I tested on my laptop's webcam.  
<br><br>
once done I felt there's a need for android downloadable app because nobody is going to visit the website, so I started working on it.  
<br><br>

## Android App Choices

While working on android app I had 2 choices,  
<br><br>
make the app webview which is like the app would load the website and it'll behave like a native app, or make a native app.  
<br><br>
I chose native kotlin app because webview could be slow and unreliable when it comes to slow internet, also native apps can have some exclusive features like scan history and starred items.  
<br><br>

## Feedback & Problems

Once android app was done I got alot of positive and negative feedbacks for nutriscan, positive ones included the ease of use and the ui quality.  
<br><br>
But the negative was more. It showed inconsistent results and often incorrect.  
<br><br>
On investigation it was found that OpenFoodFacts have those inconsistencies and as my app is using their api to work, those inconsistencies are being applied on that too.  
<br><br>

## Limitations & Decisions

Fixing it without performance and speed compromise seems very difficult and verifying the accuracy from internet source is also extremely difficult so I decided to keep it slow, for now the database would be hybrid, you get to choose OpenFoodFacts or internet as I get to know more databases I will surely try to improve nutriscan on it.  
<br><br>
Another thing people were saying, that I should make my own database, honestly that is extremely difficult because I am a student surveying each food products and adding requires alot of human work which is not feasible for something that can be done using gemini and 2 prompts.  
<br><br>

## Lastly

NutriScan isn’t a finished product — it’s an ongoing experiment. It solved a problem I personally faced, exposed a lot of limitations I didn’t expect, and taught me more than any tutorial could. That alone makes it worth building.