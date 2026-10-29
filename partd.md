
# Part D: PC Game Deals — Project Reflection

## Setup

Part A uses Python, while Parts B and C use HTML, CSS and JavaScript.

To run Part A, I open a terminal in the project folder and run:

    python part_a.py

To run the website, I start a local server with:

    python -m http.server 8000

I then open http://localhost:8000 in a web browser.

The project uses deals.json as the source of game data. The website fetches this file, so it should be run through a local server rather than by opening index.html directly.

## Choices

I used Python for Part A because it provides straightforward functions for filtering, searching and finding the cheapest game. I used plain HTML, CSS and JavaScript for the website because these technologies run directly in a browser without requiring a framework.

I separated the data, page structure, styling and browser logic into different files to make the project easier to understand and maintain.

For Part C, I added live search, a sale-only filter and sorting options. I also show the discount percentage and saving amount to make the deals easier to compare.

## Obstacles

One important detail was distinguishing a genuine sale from a game whose sale price is equal to its normal price. I handled this by checking whether salePrice is strictly less than normalPrice.

I also needed to make sure the cheapest game is selected using its current price. I used a local web server so JavaScript could fetch the JSON data.


## Resources

I used the exercise instructions and the supplied game data. I also used youtube , stackflow.

## Time

I took 3 days tyring to solve this game

## Next time

I would improve accessibility, and investigate integrating the free CheapShark API. I would also validate the data and add clearer loading and error states.
