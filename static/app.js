const Controller = {
  offset: 0,
  query: "",
  caseSensitive: true,
  contextLines: 5,

  showLoading: (shouldShow) => {
    const loadingNode = document.getElementById("loading");
    if (shouldShow) {
      loadingNode.classList.remove("d-none");
    } else {
      loadingNode.classList.add("d-none");
    }
  },

  showResults: (shouldShow) => {
    const node = document.getElementById("results-container");
    if (shouldShow) {
      node.classList.remove("d-none");
    } else {
      node.classList.add("d-none");
    }
  },

  showNoResultsMessage: (shouldShow) => {
    const node = document.getElementById("no-results");
    if (shouldShow) {
      node.classList.remove("d-none");
    } else {
      node.classList.add("d-none");
    }
  },

  showMoreButton: (shouldShow) => {
    const moreButton = document.getElementById("more-button");
    if (shouldShow) {
      moreButton.classList.remove("d-none");
    } else {
      moreButton.classList.add("d-none");
    }
  },

  clearResults: () => {
    const tbody = document.getElementsByTagName("tbody")[0];
    const resultList = tbody.getElementsByTagName("tr");
    Array.from(resultList).forEach((item) => {
      item.parentNode.removeChild(item);
    });
  },

  createResultItem: (context) => {
    const row = document.createElement("tr");
    const lineCol = document.createElement("td");
    const contentCol = document.createElement("td");
    Object.keys(context).forEach((row) => {
      const lineEntry = document.createElement("div");
      const contentEntry = document.createElement("div");
      lineEntry.innerHTML = `${row}`;
      contentEntry.innerHTML = `${context[row]}`;
      if (contentEntry.innerHTML === "") {
        contentEntry.classList.add("d-inline-block");
      }

      lineCol.appendChild(lineEntry);
      contentCol.appendChild(contentEntry);
    });
    row.appendChild(lineCol);
    row.appendChild(contentCol);
    return row;
  },

  setSearchQuery: (ev) => {
    ev.preventDefault();
    Controller.showResults(false);
    Controller.showNoResultsMessage(false);
    Controller.showLoading(true);
    Controller.clearResults();

    const form = document.getElementById("form");
    const data = Object.fromEntries(new FormData(form));

    Controller.query = data.query;
    Controller.caseSensitive = data.casesensitive ? true : false;
    Controller.contextLines = data.contextlines;
    Controller.offset = 0;
  },

  search: () => {
    const queryStr = Controller.query.trim().split(/\s+/).join("+");
    fetch(
      `/search?q=${queryStr}&offset=${Controller.offset}&case=${Controller.caseSensitive}&contextlines=${Controller.contextLines}`
    ).then((response) => {
      response.json().then((results) => {
        Controller.updateTable(results);
      });
    });
  },

  updateTable: (results) => {
    Controller.showLoading(false);
    Controller.showResults(true);

    const resultList = document.getElementById("content");

    if (results.Rows.length === 0) {
      Controller.showMoreButton(false);
      const resultItems = document.getElementsByClassName("result-item");
      if (resultItems.length == 0) {
        Controller.showResults(false);
        Controller.showNoResultsMessage(true);
      }
    } else {
      Controller.showResults(true);
      Controller.showMoreButton(true);
      Controller.showNoResultsMessage(false);
    }

    for (let result of results.Rows) {
      resultList.appendChild(Controller.createResultItem(result.Context));
    }
    Controller.offset = results.Offset;
  },
};

const form = document.getElementById("form");
form.addEventListener("submit", (e) => {
  Controller.setSearchQuery(e);
  Controller.search();
});

const nextButton = document.getElementById("more-button");
nextButton.addEventListener("click", Controller.search);
