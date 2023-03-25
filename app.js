const container = document.getElementById('root');
const ajax = new XMLHttpRequest();
const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

/**
 * NOTE: 반복되는 코드 리팩토링
 * - return 쓰는 이유
 * - 이 부분은 getData 함수 자체가 쓸 부분이 아니고, getData를 사용하는 쪽에서 쓸 데이터이기 때문에!
 */
function getData(url) {
    ajax.open('GET', url, false); // false : 데이터를 동기적으로 처리하겠다.
    ajax.send(); // 이때 데이터가 들어옴   

    return JSON.parse(ajax.response); // 가져온 JSON 데이터를 객체로 바꾸기
}

const newsFeed = getData(NEWS_URL);
const ul = document.createElement('ul');

// NOTE: 타이틀 클릭했을 때 컨텐츠 가져오기
window.addEventListener("hashchange", function () {
    const id = location.hash.substr(1); // # 빼기

    const newsContent = getData(CONTENT_URL.replace('@id', id));  // 사용자가 타이틀 클릭하면 CONTENT_URL을 가지고 ajax를 호출해서 데이터 가져옴
    const title = document.createElement('h1');

    title.innerHTML = newsContent.title;
    
    content.appendChild(title);
});

for (let i = 0; i < 10; i++) {
    const div = document.createElement('div');
    const li = document.createElement('li');
    const a = document.createElement('a');

    div.innerHTML = `
    <li>
        <a href="#${newsFeed[i].id}">
            ${newsFeed[i].title} (${newsFeed[i].comments_count})
        </a>    
    </li>
    `;

    ul.appendChild(div.firstElementChild); // === ul.appendChild(div.children[0]);
}

container.appendChild(ul);
container.appendChild(content);