if (location.host != "localhost") {
  alert("Hoste die Webseite lokal für das ideale Erlebnis");
}

class News {
  constructor() {
    this.apiKey = "ca7dc05f54074f18877366cf72c88385";
    this.country = "de";
    this.topics = [
      {
        german: "Wirtschaft",
        english: "Business",
      },
      {
        german: "Unterhaltung",
        english: "Entertainment",
      },
      {
        german: "Gesundheit",
        english: "Health",
      },
      {
        german: "Wissenschaft",
        english: "Science",
      },
      {
        german: "Sport",
        english: "Sports",
      },
      {
        german: "Technik",
        english: "Technology",
      },
    ];
    this.selectedTopic = this.topics[0];
  }

  getTopNews(country) {
    return new Promise((res, rej) => {
      fetch(`http://newsapi.org/v2/top-headlines?country=${country}&apiKey=${this.apiKey}`)
        .then((response) => {
          if (response.status == 200 /*successfull request*/) {
            res(response.json());
          } else {
            rej(`Status: ${response.status}`);
          }
        })
        .catch((error) => {
          rej(error);
        });
    });
  }

  getNews(category) {
    return new Promise((res, rej) => {
      fetch(
        `http://newsapi.org/v2/top-headlines?country=${this.country}&category=${category}&apiKey=${this.apiKey}`
      )
        .then((response) => {
          if (response.status == 200 /*successfull request*/) {
            res(response.json());
          } else {
            rej(`Status: ${response.status}`);
          }
        })
        .catch((error) => {
          rej(error);
        });
    });
  }

  displayTopics(outputPath) {
    let topics = this.topics;
    topics.map((topic) => {
      document.querySelector(
        outputPath
      ).innerHTML += `<a id="cat-${topic.english}" href="#" data-english="${topic.english}" data-german="${topic.german}">${topic.german}</a>`;
    });
    document.querySelector("#news .news hr").setAttribute("title", this.selectedTopic.german);
    document.querySelector(`#cat-${this.selectedTopic.english}`).classList.add("active");
  }

  displayNews(output, headline, redirectURL, backgroundImageURL) {
    document.querySelector(output).innerHTML += `
      <div style="background-image: url(${backgroundImageURL});">
        <div class="more">
          <h2 class="title center">${headline}</h2>
          <p class="text center"><a href="${redirectURL}">Hier mehr</a></p>
        </div>
      </div>`;
  }

  displayPlaceholder(output, amount) {
    for (let i = 0; i < amount; i++) {
      this.displayNews(
        output,
        "Platzhalter",
        "https:///dulliag.de/Galerie/",
        "https://dulliag.de/Tool/uploads/gallery/all-my-friends-are-dead.png"
      );
    }
  }
}

let news = new News();
news
  .getTopNews(news.country)
  .then((data) => {
    if (typeof data == "object" && data != null) {
      let top5 = [];
      // TODO Should we only display 3 articles in the second row for more space?
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

        news.displayNews("#top-news > div", trimmedHeadline, article.url, article.urlToImage);
      });
    } else {
      news.displayPlaceholder("#top-news > div", 5);
    }
  })
  .catch((err) => {
    console.error("Error: ", err);
    news.displayPlaceholder("#top-news > div", 5);
  });
news.displayTopics("#news .keywords > div");
let topicBtns = document.querySelectorAll("#news .keywords > div a");
topicBtns.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    let curTopic = news.selectedTopic;
    let newTopic = {
      german: this.getAttribute("data-german"),
      english: this.getAttribute("data-english"),
    };
    news.selectedTopic = newTopic;
    document.querySelector(`#cat-${curTopic.english}`).classList.remove("active");
    this.classList.add("active");
    document.querySelector("#news .news hr").setAttribute("title", newTopic.german);
    document.querySelector("#news .news > div").innerHTML = "";
    news
      .getNews(newTopic.english)
      .then((data) => {
        if (typeof data == "object" && data != null) {
          let top4 = [];
          data.articles.map((article) => {
            // key < 5 && done != true ? top5.push(article) : (done = true);
            top4.length < 4 && article.urlToImage != null ? top4.push(article) : false;
          });

          top4.map((article) => {
            let headline = article.title;
            let trimmedHeadline = null;
            headline.includes(":") == true
              ? (trimmedHeadline = headline.split(":")[0])
              : (trimmedHeadline = headline.split("?")[0]);

            news.displayNews("#news .news> div", trimmedHeadline, article.url, article.urlToImage);
          });
        } else {
          news.displayPlaceholder("#news .news > div", 4);
        }
      })
      .catch((err) => {
        console.error("Error: ", err);
        news.displayPlaceholder("#news .news > div", 4);
      });
  });
});
news
  .getNews("business")
  .then((data) => {
    if (typeof data == "object" && data != null) {
      let top4 = [];
      data.articles.map((article) => {
        // key < 5 && done != true ? top5.push(article) : (done = true);
        top4.length < 4 && article.urlToImage != null ? top4.push(article) : false;
      });

      top4.map((article) => {
        let headline = article.title;
        let trimmedHeadline = null;
        headline.includes(":") == true
          ? (trimmedHeadline = headline.split(":")[0])
          : (trimmedHeadline = headline.split("?")[0]);

        news.displayNews("#news .news> div", trimmedHeadline, article.url, article.urlToImage);
      });
    } else {
      news.displayPlaceholder("#news .news > div", 4);
    }
  })
  .catch((err) => {
    console.error("Error: ", err);
    news.displayPlaceholder("#news .news > div", 4);
  });
