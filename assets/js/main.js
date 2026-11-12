const UNKNOWN_TEXT = "待查證";

function createTag(text, extraClass) {
  const span = document.createElement("span");
  span.className = extraClass ? "tag " + extraClass : "tag";
  span.textContent = text;
  return span;
}

function createParagraph(text) {
  const p = document.createElement("p");
  p.textContent = text;
  return p;
}

function loadJson(base, name) {
  return fetch(base + name).then(function (res) { return res.json(); });
}

function loadData(base) {
  return Promise.all([loadJson(base, "shops.json"), loadJson(base, "drink-types.json")]);
}

function showLoadError(container) {
  container.textContent = "資料載入失敗,請透過本機伺服器或 GitHub Pages 開啟此頁。";
}

/* 店家 logo:沒有 logo 時顯示佔位區塊;圖片路徑相對於 data 資料夾的上一層 */
function createShopLogo(shop, base) {
  if (!shop.logo) {
    const empty = document.createElement("div");
    empty.className = "shop-logo shop-logo-empty";
    empty.textContent = shop.name;
    return empty;
  }
  const img = document.createElement("img");
  img.className = "shop-logo";
  img.src = base + "../assets/img/" + shop.logo.file;
  img.alt = shop.logo.alt;
  img.loading = "lazy";
  return img;
}

/* 飲料店列表:logo、店名、創立年份、起源地;點卡片進入店家頁 */
function initShopList() {
  const container = document.querySelector("[data-shop-list]");
  if (!container) return;

  loadData(container.dataset.base)
    .then(function (data) {
      container.replaceChildren();
      data[0].forEach(function (shop) {
        const card = document.createElement("a");
        card.className = "card";
        card.href = "shop.html?id=" + encodeURIComponent(shop.id);

        card.appendChild(createShopLogo(shop, container.dataset.base));

        const title = document.createElement("h3");
        title.textContent = shop.name;
        card.appendChild(title);

        const meta = document.createElement("p");
        meta.appendChild(createTag("創立:" + (shop.founded === null ? UNKNOWN_TEXT : shop.founded + " 年"), "tag-accent"));
        meta.appendChild(createTag("起源:" + (shop.origin === null ? UNKNOWN_TEXT : shop.origin)));
        card.appendChild(meta);

        container.appendChild(card);
      });
    })
    .catch(function () { showLoadError(container); });
}

/* 單一店家頁:pages/shop.html?id=<shop-id> */
function initShopDetail() {
  const container = document.querySelector("[data-shop-detail]");
  if (!container) return;

  const id = new URLSearchParams(location.search).get("id");

  loadData(container.dataset.base)
    .then(function (data) {
      const shop = data[0].find(function (s) { return s.id === id; });
      container.replaceChildren();

      if (!shop) {
        container.appendChild(createParagraph("找不到這間店,請回到飲料店列表重新選擇。"));
        return;
      }

      document.title = shop.name + " | 手搖飲筆記";
      document.querySelector("[data-shop-name]").textContent = shop.name;
      document.querySelector("[data-shop-meta]").textContent =
        "創立:" + (shop.founded === null ? UNKNOWN_TEXT : shop.founded + " 年") +
        "|起源:" + (shop.origin === null ? UNKNOWN_TEXT : shop.origin);

      container.appendChild(createShopLogo(shop, container.dataset.base));

      const storyHeading = document.createElement("h2");
      storyHeading.textContent = "品牌故事";
      container.appendChild(storyHeading);
      container.appendChild(createParagraph(shop.story));

      const h2 = document.createElement("h2");
      h2.textContent = "推薦飲品";
      container.appendChild(h2);

      const grid = document.createElement("div");
      grid.className = "card-grid";
      data[1].forEach(function (type) {
        const items = shop.recommended.filter(function (r) { return r.type === type.id; });
        if (items.length === 0) return;

        const card = document.createElement("article");
        card.className = "card";
        const title = document.createElement("h3");
        title.textContent = type.name;
        card.appendChild(title);

        const tags = document.createElement("p");
        items.forEach(function (r) { tags.appendChild(createTag(r.name, "tag-accent")); });
        card.appendChild(tags);
        grid.appendChild(card);
      });
      container.appendChild(grid);
      container.appendChild(createParagraph("推薦飲品多來自媒體榜單與網友、員工推薦,並非官方排名。"));
    })
    .catch(function () { showLoadError(container); });
}

/* 首頁點餐畫面:一款飲品一格 */
function collectDrinks(shops, types) {
  const typeNames = {};
  types.forEach(function (t) { typeNames[t.id] = t.name; });

  const byName = new Map();
  shops.forEach(function (shop) {
    shop.recommended.forEach(function (r) {
      if (!byName.has(r.name)) {
        byName.set(r.name, { name: r.name, type: r.type, typeName: typeNames[r.type], shops: [] });
      }
      byName.get(r.name).shops.push({ id: shop.id, name: shop.name });
    });
  });

  return Array.from(byName.values()).sort(function (a, b) { return b.shops.length - a.shops.length; });
}

function createMenuTile(drink) {
  const card = document.createElement("article");
  card.className = "card menu-item";

  const title = document.createElement("h3");
  title.textContent = drink.name;
  card.appendChild(title);

  const type = document.createElement("p");
  type.appendChild(createTag(drink.typeName, "tag-accent"));
  card.appendChild(type);

  const label = document.createElement("p");
  label.className = "label";
  label.textContent = "推薦的店";
  card.appendChild(label);

  const shops = document.createElement("p");
  drink.shops.forEach(function (shop) {
    const link = document.createElement("a");
    link.className = "tag";
    link.href = "pages/shop.html?id=" + encodeURIComponent(shop.id);
    link.textContent = shop.name;
    shops.appendChild(link);
  });
  card.appendChild(shops);

  return card;
}

function initMenu() {
  const container = document.querySelector("[data-menu]");
  if (!container) return;
  const filterBar = document.querySelector("[data-menu-filter]");

  loadData(container.dataset.base)
    .then(function (data) {
      const drinks = collectDrinks(data[0], data[1]);

      function render(typeId) {
        container.replaceChildren();
        drinks
          .filter(function (d) { return typeId === "all" || d.type === typeId; })
          .forEach(function (d) { container.appendChild(createMenuTile(d)); });
      }
      render("all");

      [{ id: "all", name: "全部" }].concat(data[1]).forEach(function (t) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "filter-btn";
        btn.textContent = t.name;
        btn.setAttribute("aria-pressed", t.id === "all" ? "true" : "false");
        btn.addEventListener("click", function () {
          filterBar.querySelectorAll(".filter-btn").forEach(function (b) {
            b.setAttribute("aria-pressed", "false");
          });
          btn.setAttribute("aria-pressed", "true");
          render(t.id);
        });
        filterBar.appendChild(btn);
      });
    })
    .catch(function () { showLoadError(container); });
}

initShopList();
initShopDetail();
initMenu();
