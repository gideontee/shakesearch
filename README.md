# ShakeSearch

Welcome to the Pulley Shakesearch Take-home Challenge! In this repository,
you'll find a simple web app that allows a user to search for a text string in
the complete works of Shakespeare.

You can see a live version of the app at
https://pulley-shakesearch.onrender.com/. Try searching for "Hamlet" to display
a set of results.

In it's current state, however, the app is in rough shape. The search is
case sensitive, the results are difficult to read, and the search is limited to
exact matches.

## Your Mission

Improve the app! Think about the problem from the **user's perspective**
and prioritize your changes according to what you think is most useful.

You can approach this with a back-end, front-end, or full-stack focus.

## Evaluation

We will be primarily evaluating based on how well the search works for users. A search result with a lot of features (i.e. multi-words and mis-spellings handled), but with results that are hard to read would not be a strong submission.

## Submission

1. Fork this repository and send us a link to your fork after pushing your changes.
2. Render (render.com) hosting, the application deploys cleanly from a public url.
3. In your submission, share with us what changes you made and how you would prioritize changes if you had more time.

---
## CHANGES

Render hosting link - https://gideontee-shakesearch.onrender.com

Note: the time to return a result seems to be slow on onrender.com (~3secs). The results returns within 200ms on my local machine. 

### User Features
Since the mission is to think about the problem from the user's perspective, I've prioritized the user-facing features and improving their search experience.

1. **Results with line number**. 

    The line number is shown alongside the search results. I believe this is the most helpful feature for a user as it tells the user where in the book the text can be found.


2. **Results with context lines**.

    It shows the lines before and after the search query. This provides context to the user. The number of lines for context can be adjusted within the dropdown menu.
    
    
3. **Pagination**. 
    
    By default, it only shows the first 10 results (per line). The user can request for more results. This is both a user feature as well as a nice performance trick. It improves performance as the search wouldn't need to search through the entire text if isn't necessary. And when the user requests for more results, we use an offset to only start the search from that offset.
    
    
4. **Case-Sensitivity Toggle**.

    Search with case-sensitivity off or on. I've added a toggle for that. By default, the search is not case-sensitive.
    
5. **Multi word search**. 

    This are search queries which are space-separated. We treat it as a OR condition. Ex: we should search for text of "hello" OR "world for a search term of "hello world" (without the quotes)
    
    
6. **Exact Phrase search**. 

    The entire string needs to be in double-quotes and it should be the only query in the search bar.

### Code Structure

I have made changes to both the front-end and the back-end of the code. 

**Front-end Changes**

- Integrated with [Bootstrap](https://getbootstrap.com/) for styling enhancements.
- Removed the provided css file.
- Add toggles and a dropdown menu for customizing the search functionality.


**Back-end Changes**
- Changed the search functionality to search by line. This allows us to provide the user the line number. However, this increases the search runtime complexity from O(log(N)*len(s) + len(result)) where N is the size of the text and s is the search query to O(M*log(N)*len(s) + len(result)) where M is the number of lines of the text and N is the size of the text.

### If I had more time

#### User Features
1. Allow the user to expand the context lines of a particular search result. We would have a "top" and "bottom" button for users to expand more text to the top or bottom from the query. This is similar to Github Pull Request Code Review where you can expand to see more code from the diff.

2. Add the ability for a user to jump right to the main text from the search results and allow them to scroll and read the main text within the web application.

3. Add the option for auto spelling correction to the search queries. This would require integrating an external library or building a framework to detect wrong spellings and choose the closest valid word from it. 

#### Code Health
If this code was meant for production, I would add the following:

- Unit tests

    Unit tests to the back-end functions (`formatResults`, `markResults`). 
    
- Integration Tests

    Integration tests between the front-end and back-end APIs.
    
- Front-end tests. UI tests

- End-to-end tests

I would also encapsulate the functions better to make it extensible. 

For the front-end, I would consider using a UI framework such as Vue.js or React.js to make it easier to manage the state on the front-end. Right now, we just pure JavaScript to query and modify the HTML elements, which is not ideal for a application in production.


#### Backend Performance

I would improve the search runtime complexity. Right now, it scans line by line and does a suffix search on the line. I would want to improve this to try to make this logarithmic time generally. One idea I have is to mark each word in the text to a line number. So when we search the entire text, each index would be associated with the line number.
