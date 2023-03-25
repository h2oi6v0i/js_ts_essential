const container = document.getElementById('root');
const ajax = new XMLHttpRequest();
const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';
const store = {
    currentPage: 1,
}

/**
 * 데이터 가져오기
 */
function getData(url) {
    ajax.open('GET', url, false); // false : 데이터를 동기적으로 처리하겠다.
    ajax.send(); // 이때 데이터가 들어옴   

    return JSON.parse(ajax.response); // 가져온 JSON 데이터를 객체로 바꾸기
}

/**
 * 글 목록 화면
 */
function newsFeed() {
    const newsFeed = getData(NEWS_URL); // 데이터 가져오고
    const newsList = []; // 빈 배열 만들고

    newsList.push('<ul>');

    for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) { // 문자열로 처리기 만들고
        newsList.push(`
            <li>
                <a href="#/show/${newsFeed[i].id}">
                    ${newsFeed[i].title} (${newsFeed[i].comments_count})
                </a>    
            </li>
        `);
    }

    newsList.push('</<ul>');
    newsList.push(`
        <div>
            <a href="#/page/${store.currentPage > 1 ? store.currentPage - 1 : 1}">이전 페이지</a>
            <a href="#/page/${store.currentPage + 1}">다음 페이지</a>
        </div>
    `);

    container.innerHTML = newsList.join(''); // 마무리
}

/**
 * 글 내용 화면
 */
function newsDetail() {
    const id = location.hash.substr(7); // # 빼기
    // 사용자가 타이틀 클릭하면 CONTENT_URL을 가지고 ajax를 호출해서 데이터 가져옴
    const newsContent = getData(CONTENT_URL.replace('@id', id));

    container.innerHTML = `
        <h1>${newsContent.title}</h1>
        <div>
            <a href="#/page/${store.currentPage}">목록으로</a>
        </div>
    `;
}

/**
 * 라우터
 */
function router() {
    const routePath = location.hash; 

    if (routePath === "") {
        newsFeed();
    } else if (routePath.indexOf("#/page/") >= 0) {
        store.currentPage = Number(routePath.substr(7));
        newsFeed();
    } else {
        newsDetail();
    }
}

window.addEventListener("hashchange", router);

router();