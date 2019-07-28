# [Resizehelper](http://www.resizehelper.com/)

**Disclaimer:**
Resizehelper is currently in alpha and I am acively developing it. This means that everything is subject to change and the project should be seen as a prototype for an idea that is constantly evolving. I am still working on the storage of data; which can be cleared without any notice. You have been warned.

## About the project

The project was born out of a problem I have encountered in my previous work that I set out to solve while learning more about knockout.js and everything that is involved with publishing a site.

While this is very much a learning experience I might be hesitant to accept pull requests as I would like to code as much as possible by myself.

Also, I am developing this project on my free time inbetween looking for a job, so updates may be very sporradic.

[You can follow the development on my trello board here.](https://trello.com/b/E59RSVxN/resizehelper)

## What is resizehelper?

Resizehelper is meant to help you decide at which sizes you should resize an image to on your site to provide better loading times across different devices (especially mobile devices).

It should also help you with the srcset syntax for responsive images with its generated output.

[You can read more about the srcset syntax here.](https://css-tricks.com/responsive-images-youre-just-changing-resolutions-use-srcset/)

#### What is resizehelper NOT?

Resizehelper will not resize or optimze your image (it might in the future, but that is not the goal at this moment), it will simply let you test different resizes of your image and provide generated suggestions with your parameters.

Resizehelper only works with the srcset syntax at this moment for switching between different resolutions of the same image, if you need to switch between images you should use the picture tag.

## The Problem

Building responsive sites for the web is always tricky and it is very important to optimize the sizes of all assets for mobile, since users are going to want to view your site even if they are on the subway and their internet connection is really bad.

Images can be one of the heaviest assets on your site, especially for webshops where you might want to display several images per product. Optimization for images are generally done in two ways: compression and reducing their size.

Compression can only help you so much before you start noticing a decrease in quality, often on gradients and text (which is why you probably should extract the text from the image to HTML so it will always look good).

Say you have a image thats 2000px wide, but are rendering it as 300px wide on mobile. The device is very good at downscaling the image so it will look good as 300px wide, but it will have loaded all 2000px for no gain. Here you can very easily shave off a lot of size on the image by resizing it, so you only load what you want to show. The problem now is that the image looks absolute crap on desktop, since it gets that resized version of the image and upscales it - something that completely screws the quality of an image. The smart thing is to have two versions of your image, load the smaller one for mobile and the larger one for desktop. But what about laptops, and tablets, and all the other devices that are in-between? Either they'll load the larger one, which can make the site feel slow, or they load the smaller one, which makes it ugly, and since there are so many devices it's pretty unreasonable to have one size of the image for every device.

## The Solution

After stumbling upon [this article on google developers](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/image-optimization?hl=en#delivering-scaled-image-assets) where they calculate how many unnecessary pixels there would be if you load a larger image than what you will render it at, I got an idea to build this helper that would do the calculation and show you how much could be saved by resizing an image to a smaller format for a specific device.

Hopefully this will make it easier to achieve a good balance between having a small enough size for all devices and having too many different sizes of the same picture (which could lead to slower download, depending on how you switch between the sizes).

## Special Thanks

Dennis Holmén (@deriel) for always finding the time to discuss ideas and showing interest in the project which has invigorated me to continue whenever I was stuck.
