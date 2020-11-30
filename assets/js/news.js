class News {
  constructor() {
    this.apiKey = "3fdc2bb41fmsh5ec2b6042922965p151aaajsn491236298b38";
    this.topics = [
      {
        name: "Globales",
        topic: "World",
      },
      {
        name: "Wirtschaft",
        topic: "Business",
      },
      {
        name: "Unterhaltung",
        topic: "Entertainment",
      },
      // {
      //   name: "Politik",
      //   topic: "Politics",
      // },
      {
        name: "Wissenschaft",
        topic: "ScienceAndTechnology",
      },
      {
        name: "Technologie",
        topic: "ScienceAndTechnology",
      },
      {
        name: "Sport",
        topic: "Sports",
      },
    ];
    this.placeholder = {
      headline: "Platzhalter",
      redirectTo: "https://dulliag.de",
      backgroundImage: "https://dulliag.de/Tool/uploads/gallery/all-my-friends-are-dead.png",
    };
    this.selectedTopic = this.topics[0];
  }

  getTopNews(amount) {
    return new Promise((res, rej) => {
      fetch(`https://bing-news-search1.p.rapidapi.com/news?category=World&originalImg=true`, {
        headers: {
          "x-rapidapi-host": "bing-news-search1.p.rapidapi.com",
          "x-rapidapi-key": this.apiKey,
          "x-bingapis-sdk": "true",
          useQueryString: true,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          let temp = {
            _type: data._type,
            webSearchUrl: data.webSearchUrl,
            value: [],
          };

          for (let i = 0; i < amount; i++) {
            temp.value.push(data.value[i]);
          }
          res(temp);
        })
        .catch((err) => {
          rej(err);
        });
    });
  }

  getTopicNews(topic, amount) {
    return new Promise((res, rej) => {
      fetch(`https://bing-news-search1.p.rapidapi.com/news?category=${topic}&originalImg=true`, {
        headers: {
          "x-rapidapi-host": "bing-news-search1.p.rapidapi.com",
          "x-rapidapi-key": this.apiKey,
          "x-bingapis-sdk": "true",
          useQueryString: true,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          let temp = {
            _type: data._type,
            webSearchUrl: data.webSearchUrl,
            value: [],
          };

          for (let i = 0; i < amount; i++) {
            temp.value.push(data.value[i]);
          }
          res(temp);
        })
        .catch((err) => {
          rej(err);
        });
    });
  }

  displayTopics(outputPath) {
    let topics = this.topics;
    topics.map((topic) => {
      document.querySelector(
        outputPath
      ).innerHTML += `<a id="cat-${topic.topic}" href="#" data-topic="${topic.topic}" data-name="${topic.name}">${topic.name}</a>`;
    });
    document.querySelector("#news .news hr").setAttribute("title", this.selectedTopic.name);
    document.querySelector(`#cat-${this.selectedTopic.topic}`).classList.add("active");
  }

  trimHeadline(headline) {
    // Trim for :, ""[2], -, /
    var trimmedHeadline = headline;
    if (headline.includes(":")) {
      trimmedHeadline = headline.split(":")[0];
    } else if (headline.includes('"')) {
      trimmedHeadline = headline.split('"')[1];
    } else if (headline.includes("/")) {
      trimmedHeadline = headline.split("/")[0];
    }
    return trimmedHeadline;
  }

  renderNews(outputPath, headline, redirectTo, backgroundImage) {
    document.querySelector(outputPath).innerHTML += `
      <div style="background-image: url(${backgroundImage});">
        <div class="more">
          <h2 class="title center">${headline}</h2>
          <p class="text center"><a href="${redirectTo}">Hier mehr</a></p>
        </div>
      </div>`;
  }

  renderPlaceholder(outputPath, amount) {
    let { headline, redirectTo, backgroundImage } = this.placeholder;
    for (let i = 0; i < amount; i++) {
      this.renderNews(outputPath, headline, redirectTo, backgroundImage);
    }
  }
}

const news = new News();

// Get the top headlines
const topNews = {
  amount: 5,
  output: "#top-news > div",
};
news
  .getTopNews(topNews.amount)
  .then((data) => {
    const articles = data.value;
    articles.map((article) => {
      news.renderNews(
        topNews.output,
        news.trimHeadline(article.name),
        article.url,
        article.image.contentUrl
      );
    });
  })
  .catch((err) => {
    console.error(err);
    // Bcause we ran into an error we wanna display some placeholders instead of the actual news
    news.renderPlaceholder(topNews.output, topNews.amount);
  });

// Display category sorted news
const categoryNews = {
  selected: news.selectedTopic,
  amount: 4,
  output: "#news .news> div",
};
news
  .getTopicNews(categoryNews.selected.topic, categoryNews.amount)
  .then((data) => {
    const articles = data.value;
    articles.map((article) => {
      news.renderNews(
        categoryNews.output,
        news.trimHeadline(article.name),
        article.url,
        article.image.contentUrl
      );
    });
  })
  .catch((err) => {
    console.error(err);
    // Bcause we ran into an error we wanna display some placeholders instead of the actual news
    news.renderPlaceholder(categoryNews.output, categoryNews.amount);
  });

// Display all avaiable topics
news.displayTopics("#news .keywords > div");
const topicBtns = document.querySelectorAll("#news .keywords > div a");
topicBtns.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    let curTopic = news.selectedTopic,
      newTopic = {
        name: this.getAttribute("data-name"),
        topic: this.getAttribute("data-topic"),
      };
    news.selectedTopic = newTopic;
    document.querySelector(`#cat-${curTopic.topic}`).classList.remove("active");
    this.classList.add("active");
    document.querySelector("#news .news hr").setAttribute("title", newTopic.name);
    document.querySelector("#news .news > div").innerHTML = "";
    news
      .getTopicNews(newTopic.topic, categoryNews.amount)
      .then((data) => {
        const articles = data.value;
        articles.map((article) => {
          news.renderNews(
            categoryNews.output,
            news.trimHeadline(article.name),
            article.url,
            article.image.contentUrl
          );
        });
      })
      .catch((err) => {
        console.error(err)
        // Bcause we ran into an error we wanna display some placeholders instead of the actual news
        // We also gonna reset the topics
        topicBtns.forEach((topicBtn) => topicBtn.classList.remove("active"));
        news.selectedTopic = news.topics[0];
        document.querySelector(`#news #cat-${news.selectedTopic.topic}`).classList.add("active");
        document.querySelector("#news .news hr").setAttribute("title", news.selectedTopic.name);
        news.renderPlaceholder(categoryNews.output, categoryNews.amount);
      });
  });
});
