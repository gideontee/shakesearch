const Controller = {
  offset: 0,
  query: "",
  caseSensitive: true,
  contextLines: 5,

  setSearchQuery: (ev) => {
    ev.preventDefault();
    const form = document.getElementById("form");
    const data = Object.fromEntries(new FormData(form));

    const loadingNode = document.getElementById("loading");
    loadingNode.classList.remove("hidden");

    const resultList = document.getElementsByClassName("result-item");
    Array.from(resultList).forEach((item) => {
      item.parentNode.removeChild(item);
    });

    const noFoundMessageNode = document.getElementById("no-results");
    if (noFoundMessageNode) {
      noFoundMessageNode.parentNode.removeChild(noFoundMessageNode);
    }

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
    const loadingNode = document.getElementById("loading");
    loadingNode.classList.add("hidden");

    const tableContainer = document.getElementById("results-container");
    tableContainer.classList.remove("hidden");

    const resultList = document.getElementById("results-list");
    const moreButton = document.getElementById("more-button");
    if (results.Rows.length === 0) {
      moreButton.classList.add("hidden");
      const resultItems = document.getElementsByClassName("result-item");
      if (resultItems.length == 0) {
        resultList.classList.add("hidden");
        if (!document.getElementById("no-results")) {
          const noFoundMessageNode = document.createElement("p");
          noFoundMessageNode.setAttribute("id", "no-results");
          noFoundMessageNode.innerHTML =
            "No results found. Please try a different query.";
          tableContainer.appendChild(noFoundMessageNode);
        }
      }
    } else {
      resultList.classList.remove("hidden");
      moreButton.classList.remove("hidden");
      const noFoundMessageNode = document.getElementById("no-results");
      if (noFoundMessageNode) tableContainer.removeChild(noFoundMessageNode[0]);
    }

    for (let result of results.Rows) {
      const node = document.createElement("div");
      node.classList.add("result-item");

      Object.keys(result.Context).forEach((row) => {
        const lineNode = document.createElement("div");
        lineNode.classList.add("flex-row");

        const lineCol = document.createElement("div");
        lineCol.classList.add("line-col");
        lineCol.innerHTML = `${row}`;

        const contentCol = document.createElement("div");
        contentCol.innerHTML = `${result.Context[row]}`;

        lineNode.appendChild(lineCol);
        lineNode.appendChild(contentCol);
        node.appendChild(lineNode);
      });
      resultList.appendChild(node);
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
