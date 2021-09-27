# vector-space-model

This is a Node.js implementation of a ranked retrieval model, or a vector space model

## CORPUS:
We are using 61 documents, each being a chapter from the book 'Pride and Prejudice' by Jane Austen.

## HOW TO RUN THE PROJECT:
Requirement: It is necessary for you to have Node.js installed in your system.
run 
```javascript
npm install
```

to obtain rankings for a particular query, run

```javascript
node index.js
```

and enter your query.

## EXAMPLES OF QUERIES:
In this project, you can input free text queries, query operators like AND/ OR/ NOT are not required
Similar to those you type into a web search engine's search bar, you can input queries like:

1) bingley is a good man
2) life and death
3) one of the party
4) summer outside the house

## OUTPUT
Returns the 10 most relevant documents to the input query, ranked according to their cosine similarity