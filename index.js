const fs = require('fs');
const prompt = require("prompt-sync")();
//import list from '/files.js';

//initialized the corpus
let corpus = [];

//function to traverse the documents and add to the corpus
function makeCorpus(docs) {
    for(let i in docs) {
      try {
        let data = fs.readFileSync(docs[i], {encoding: 'utf8'});
        //does basic preprocessing to split into tokens and adds to corpus
        corpus.push(data.replace(/[\r\n]/g," ").trim().split(" "));
      } catch (err) {
        throw err;
      }
    }
    return corpus;
  }

makeCorpus(["docs/1.txt", "docs/2.txt", "docs/3.txt", 
"docs/4.txt", "docs/5.txt",
 "docs/6.txt", "docs/7.txt", "docs/8.txt", "docs/9.txt", "docs/10.txt", "docs/11.txt", "docs/12.txt",
  "docs/13.txt", "docs/14.txt", "docs/15.txt", "docs/16.txt", "docs/17.txt", "docs/18.txt", "docs/19.txt", 
  "docs/20.txt", "docs/21.txt", "docs/22.txt", "docs/23.txt",
  "docs/24.txt", "docs/25.txt", "docs/26.txt", "docs/27.txt", "docs/28.txt", "docs/29.txt", "docs/30.txt",
  "docs/31.txt", "docs/32.txt", "docs/33.txt", "docs/34.txt", "docs/35.txt", "docs/36.txt", "docs/37.txt", 
  "docs/38.txt", "docs/39.txt", "docs/40.txt", "docs/41.txt", "docs/42.txt", "docs/43.txt", "docs/44.txt",
  "docs/45.txt", "docs/46.txt", "docs/47.txt", "docs/48.txt", "docs/49.txt", "docs/50.txt", "docs/51.txt",
  "docs/52.txt", "docs/53.txt", "docs/54.txt", "docs/55.txt", "docs/56.txt", "docs/57.txt", "docs/58.txt", 
  "docs/59.txt", "docs/60.txt", "docs/61.txt", 
]);

//length of the document, in order to perform document normalization
let N = corpus.length;

/**
 * calculates the term frequency of a particular term in a document
 * term frequency is computed as:
 * number of occurrences of term/ document length
 */
function termFreq(term, doc) {
    let frequency = 0;
    let lower = term.toLowerCase();
    let doc_length = doc.length +1;
    for (let i in doc){
      if (doc[i].toLowerCase() == lower){
        frequency++;
      }
    }
    //return normalized term frquency
    return frequency/ doc_length;
  }


  /**
   * calculates inverse document frequency of a term in a particular document
   * idf = log(no. of docs the term appears in/ term freq)
   */
  function invDocFreq(term) {
    if (corpus == null){
        return -1;
    } else {
        //N = corpus.length;
        let docFreq = 0;
        for (let i in N){
            for (let j in corpus[i]) {
                if (corpus[i][j] == term.toLowerCase()){
                docFreq++;
                break;
                }
            }
        }
        let idf = Math.log((N) / (docFreq + 1)) + 1;
        return idf;
    }
  }

  /**
   * creates an idf model, an individual vector of the idf
   * of the given input query term in a document
   */
  function createIdf(query) {
    let model = [];
    query instanceof Array ? query: query.split(" ");
    if (corpus == null) {
        return null;
    }
    for(let i in query){model.push(invDocFreq(query[i]));}
    return model;
  }


/**
 * creates a vector for tf-idf values for every given query
 * multiplies tf by idf and returns vector
 */
  function createVSM(query, doc) {
    let tf = [];
    let vsm = []
    let idf = createIdf(query);

    query instanceof Array ? query: query.split(" ");
    if (corpus == null) {
            return null;
        }    
   
    for (let i in query){
        let x = termFreq(query[i], doc);
        tf.push(x);
    }

    for (let j in idf){
      vsm[j] = idf[j] * tf[j];
    }
    return vsm;
  }

  /**
   * finds the cosine similarity between a pair of vectors
   * cosine similarity is directly proportional to the relevance 
   * of the query to the document
   */
  function cosineSimilarity(query, doc){
    let sim_idx = 0;

    query instanceof Array ? query: query.split(" ");
    let q_vec = createVSM(query, query);
    let doc_vec = createVSM(query, doc);

    for (let i in query){
      isNaN(q_vec[i] * doc_vec[i])? sim_idx += 0: sim_idx += q_vec[i] * doc_vec[i];
    }
    let product = findMag(q_vec) * findMag(doc_vec);

    if(isNaN(1.0 * sim_idx / (product))){
        return 0;
    } else {
        return 1.0 * sim_idx / (product);
    }
  }


  /*
  * ranks the documents in the given corpus according to a query
  */
  function rank(query){
    let ranking = [];

    query = query.split(" ");
    for(let i = 0; i < N; i++) {
      ranking.push({
        document: corpus[i],
        similarityIndex: cosineSimilarity(query, corpus[i]),
        index: i,
        });
    }
    //sorts the documents based on the cosine similarity values of the document
    ranking.sort((a, b) => {
      return b.similarityIndex - a.similarityIndex;
    })

    let ranks = [];
    
    //finds the top 10 relevant documents to the given query
    ranking.slice(0,10).map((val)=>{
      //console.log(val.index);
      ranks.push(val.similarityIndex, val.index + 1);
    });
    return ranks;
  }


/*
* function to find the magnitude of a given input vector
*/
  function findMag(vec) {
    let mag = 0
    for (let i = 0; i < vec.length; i++){
      if (isNaN(vec[i])) {
        mag += 0;
      } else {
        mag += (vec[i] * vec[i]);
      }
    }
    //console.log(Math.sqrt(mag));
    return Math.sqrt(mag);
  }


  const input_query = prompt('Enter your query: ');
  console.log(rank(input_query));

