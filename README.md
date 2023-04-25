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

## CHANGES

Render hosting link - https://gideontee-shakesearch.onrender.com

I've added the following features:
1. **Results with line number**. 

    The line number is shown alongside the search results. I believe this is the most helpful feature for a user as it tells the user where in the book the text can be found.


2. **Results with context lines**.

    It shows context before and after the line where the text is found. This provides context to the user. The number of lines for context can be adjusted within the dropdown menu.
    
    
3. **Pagination**. 
    
    By default, it only shows the first 10 results (per line). The user can request for more results. This is both a user feature as well as a nice performance trick. It improves performance as the search wouldn't need to search through the entire text if isn't necessary. And when the user requests for more results, we use an offset to only start the search from that offset.
    
    
4. **Case-Sensitivity Toggle**.

    Search with case-sensitivity off or on. I've added a toggle for that. By default, the search is not case-sensitive.
    
5. **Multi word search**. 

    This are search queries which are space-separated. We treat it as a OR condition. Ex: we should search for text of "hello" OR "world for a search term of "hello world" (without the quotes)
    
    
6. **Exact Phrase search**. 

    The entire string needs to be in double-quotes and it should be the only query in the search bar.
    
---

If I had more time, I would add the following features:

User Facing Features:
1. Add the ability for a user to jump right to the main text from the search results and allow them to scroll and read the main text within the web application.
2. Improve the styling of the web application to look better (CSS)
3. Add the option for auto spelling correction to the search queries

Non-User Facing Features:
1. Improve the search runtime performance. Right now the runtime is linear in terms of the total number of lines of the text.
 