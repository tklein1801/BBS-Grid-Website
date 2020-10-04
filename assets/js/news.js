class News {
  constructor() {
    this.apiKey = "ca7dc05f54074f18877366cf72c88385"; // I don't realy care aboutn this api-key
    this.country = "de";
    this.category = ["Business", "Entertainment", "Health", "Science", "Sports", "Technology"];
    this.selectedCatgory = {
      index: 0,
      topic: this.category[0],
    };
  }

  /**
   * @param {string} country de = Germany
   */
  getTopNews(country) {
    return new Promise((res, rej) => {
      var url = `http://newsapi.org/v2/top-headlines?country=${country}&apiKey=${this.apiKey}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => res(data))
        .catch((err) => rej(err));
    });
  }

  /**
   * @param {string} category Choose between business, entertainment, health, science, sports or technology
   */
  getNews(country, category) {
    return new Promise((res, rej) => {
      var url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${this.apiKey}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => res(data))
        .catch((err) => rej(err));
    });
  }

  /**
   * Update the current selected topic
   * @param {string} newCategory Choose between business, entertainment, health, science, sports or technology
   */
  updateTopic(newCategory) {
    this.news.selectedCatgory.topic = newCategory;
  }

  displayTopic(country, category) {
    let news = this.getNews(country, category);

    news.then((data) => {
      let top4 = [];
      data.articles.map((article) => {
        top4.length < 4 && article.urlToImage != null ? top4.push(article) : false;
      });

      top4.map((article) => {
        let headline = article.title;
        let trimmedHeadline = null;
        headline.includes(":") == true
          ? (trimmedHeadline = headline.split(":")[0])
          : (trimmedHeadline = headline.split("?")[0]);

        document.querySelector("#news .news > div").innerHTML += `
          <div style="background-image: url(${article.urlToImage});">
            <div class="more">
              <h2 class="title center">${trimmedHeadline}</h2>
              <p class="text center"><a href="${article.url}">Hier mehr</a></p>
            </div>
          </div>`;
      });
    });
  }
}

let news = new News();
let topNews = news.getTopNews("de");
let topNewsOutput = document.querySelector(".wrapper #top-news div");
topNews.then((data) => {
  let top5 = [],
    done = false;
  // TODO Should we only get 4 articles? There would be more space for them...
  data.articles.map((article) => {
    // key < 5 && done != true ? top5.push(article) : (done = true);
    top5.length < 5 && article.urlToImage != null ? top5.push(article) : false;
  });

  top5.map((article) => {
    let headline = article.title;
    let trimmedHeadline = null;
    headline.includes(":") == true
      ? (trimmedHeadline = headline.split(":")[0])
      : (trimmedHeadline = headline.split("?")[0]);

    document.querySelector("#top-news > div").innerHTML += `
      <div style="background-image: url(${article.urlToImage});">
        <div class="more">
          <h2 class="title center">${trimmedHeadline}</h2>
          <p class="text center"><a href="${article.url}">Hier mehr</a></p>
        </div>
      </div>`;
  });
});

let categoryOutput = document.querySelector("#news .keywords div");
// TODO Translate the categories
let newsCategories = ["Business", "Entertainment", "Health", "Science", "Sports", "Technology"];
let curCategory = {
  index: 0,
  category: newsCategories[0],
};
let catNews = news.getNews("de", curCategory.category);
newsCategories.forEach((category, index) => {
  categoryOutput.innerHTML += `<a id="cat-${index}" href="#">${category}</a>`;
});
categoryOutput.querySelector(`a#cat-${curCategory.index}`).classList.add("active");

news.displayTopic(news.country, news.selectedCatgory.topic);
