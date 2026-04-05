# 🌿 Eco Product Finder - Extended Live Demo Script

**Target Duration:** 8 to 10 Minutes
**Format:** Live screen share / Video recording
**Prerequisites before recording:**
1. Have your IDE (VS Code) open with the project.
2. Have the backend terminal running (`node server.js`).
3. Have Chrome open on the `chrome://extensions` page with the extension loaded.
4. Have an empty tab ready for the live demonstration.

---

### ⏱️ [0:00 - 1:00] Introduction & Problem Statement
**[Visual: Camera view or Title Slide]**

"Hello everyone, and welcome to my presentation. Today, I’m incredibly excited to demonstrate a project I've been working on called the **Eco Product Finder**. 

Let's start with the problem: E-commerce has made shopping incredibly convenient, but it has also contributed heavily to plastic waste and environmental degradation. As consumers, many of us *want* to shop greener. We want to buy sustainable, biodegradable, or zero-waste products, but navigating the internet to find verified eco-friendly alternatives is often time-consuming and confusing. 

To solve this, I built the Eco Product Finder. It is a lightweight, intuitive Chrome extension that integrates directly into your browser. It allows you to search for everyday items—like toothbrushes, water bottles, or grocery bags—and instantly recommends sustainable alternatives ranked by a custom, data-driven 'Eco Score'.

Let me walk you through the architecture that makes this possible."

---

### ⏱️ [1:00 - 2:30] Architecture, Project Structure & Tech Stack
**[Visual: Switch to VS Code. Collapse all folders. Expand the `eco-extension` and `backend` folders slowly as you speak.]**

"Our application architecture is split into two independent ecosystems: a client-side Chrome Extension and a server-side Node.js API with a MongoDB database. 

Let's start with the **`eco-extension`** directory, which holds our frontend code. 
*   Because we are building for modern browsers, we use Manifest V3, defined here in `manifest.json`. This configures our extension's permissions, such as allowing it to communicate with our local backend.
*   The user interface is handled by `popup.html` and `popup.css`, where I focused on a modern, dark-green aesthetic that matches our environmental theme. 
*   `popup.js` acts as the brain of the frontend, handling user inputs, managing loading states, and dynamically injecting the product data into the UI.

Next, looking at the **`backend`** directory, we have a robust Express.js server interacting with a MongoDB database.
*   The `models` folder contains our Mongoose schema for structured database storage.
*   The `routes` folder manages the API endpoints that the extension calls.
*   And the `services` folder contains the core business logic: fetching live data, computing the eco-scores, and managing the cache."

---

### ⏱️ [2:30 - 5:00] Backend Code Deep-Dive & The Eco-Scoring Algorithm
**[Visual: Open `services/productApiServices.js` first.]**

"Let's dive into the backend services to see exactly how data flows through the system. 

When a user searches for a product, our backend first reaches out to the live internet. Inside `productApiServices.js`, we integrate with the RapidAPI Real-Time Product Search API. I engineered this service to automatically append the keywords 'eco friendly' to the user's query to narrow down the live Google Shopping results. The code intelligently parses the deeply nested JSON response, extracting critical data points like price arrays, high-resolution product images, store names, and direct 'Buy' links.

**[Visual: Open `services/ecoScoreService.js`.]**

Once we have this live product data, we need a way to quantify how sustainable it really is. That's where `ecoScoreService.js` comes in. 
I built a custom Eco-Scoring algorithm using an NLP dictionary approach. We map sustainable keywords to specific point values. For example, if a product's title or description contains the word 'biodegradable', it gets 20 points. 'Bamboo' gets 18 points, 'organic' gets 15, and so on. The algorithm scans the text of every single product, tallies up the weights, and caps the maximum Eco Score at 100.

**[Visual: Open `services/productService.js`.]**

Finally, to ensure our extension is lightning-fast and to reduce expensive and redundant API calls, I implemented a database caching layer in `productService.js`. Before calling the external API, the server queries our MongoDB database to see if this exact product search has been performed before. If it has, we return the cached results instantly. If it hasn't, we fetch the live data, run our eco-scoring algorithm, and then save those structured results to MongoDB for future users."

---

### ⏱️ [5:00 - 7:00] Frontend Code Deep-Dive & UI/UX Design
**[Visual: Open `eco-extension/popup.js` and scroll to `renderBestProduct(...)`.]**

"Now, how is all this rich data presented to the user? Let's jump back into the frontend in `popup.js`. 

When the user clicks search, we fire an asynchronous POST request to our local backend. While waiting, we display a spinning loading state so the user knows work is happening behind the scenes. 

When the JSON payload returns, our JavaScript dynamically generates HTML to build beautiful product cards. I wanted the user experience to be highly visual and hierarchical. 

The product with the highest Eco Score is parsed through the `renderBestProduct` function. Notice how we use JavaScript string interpolation here to dynamically build out the UI. We generate an Eco Score progress bar that programmatically changes color—pure green for scores above 70, orange for scores above 40, and red for anything lower. We also dynamically generate star ratings and inject the product image directly into the card.

We use CSS staggering animations for the 'Other Alternatives' list, which creates a really satisfying cascading slide-in effect when the results render."

---

### ⏱️ [7:00 - 9:00] Live Demonstration
**[Visual: Switch to Chrome, open an empty tab, and click the Extension icon to open the popup.]**

"Enough code—let's see it in action. I'm going to open the extension now. 

Let's imagine I need to buy a new toothbrush and I want an environmentally friendly option. I'll type **'bamboo toothbrush'** into the search bar and hit Enter.

*(Type "bamboo toothbrush" and hit Enter. Do not rush, wait for the spinner).*
Notice the loading state. Right now, the backend is reaching out to the live Google Shopping API, pulling dozens of products, running our Eco-Scoring algorithm against their descriptions, saving them to MongoDB, sorting them, and sending them back here.

*(Results load)*
And here are the results! Our top recommendation is a 100% compostable boar-hair bamboo toothbrush. Notice the rich UI elements we discussed: The perfect Eco Score of 100 in bright green, the product thumbnail, the price, the store name, and the clickable direct 'View Product' button. 
Below that, the other alternatives have beautifully slid into view.

Now, let me demonstrate the caching mechanism. Watch how fast this is. I'm going to search for **'bamboo toothbrush'** again. 
*(Hit the Search button again).*
Instantaneous! The server bypassed the live API entirely and pulled our sorted, pre-scored data directly from MongoDB. You can even see the small '📦 Results from cache' indicator at the very bottom.

Let's do one more quick search. Let's look for **'reusable bags'**. 
*(Type "reusable bags" and hit enter)*
Once again, the system fetches fresh data, scores it, and provides us with fantastic alternatives, evaluating them on materials like jute, cotton, and their level of biodegradability."

---

### ⏱️ [9:00 - 10:00] Summary & Future Roadmap
**[Visual: Stay on the Extension UI showing the beautiful results or switch back to the title slide / camera]**

"To wrap up, the Eco Product Finder effectively bridges the gap between a consumer's desire to shop sustainably and their ability to easily find the right products. 

By combining real-time e-commerce data with a custom heuristic scoring algorithm and an efficient MongoDB caching layer, the extension provides immediate, actionable value. 

In the future, I plan to expand the eco-scoring algorithm by using a Large Language Model to semantically analyze the products, and I want to integrate the extension directly into Amazon or Google pages so it can automatically suggest alternatives without the user having to type anything.

Thank you so much for your time, and I'd be happy to take any questions!"
