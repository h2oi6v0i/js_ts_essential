const container = document.getElementById('root');
const ajax = new XMLHttpRequest();
const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

ajax.open('GET', NEWS_URL, false); // false : 데이터를 동기적으로 처리하겠다.
ajax.send(); // 이때 데이터가 들어옴

const newsFeed = JSON.parse(ajax.response); // 가져온 JSON 데이터를 객체로 바꾸기
const ul = document.createElement('ul');


// NOTE: 타이틀 클릭했을 때 컨텐츠 가져오기
window.addEventListener("hashchange", function () {
    const id = location.hash.substr(1); // # 빼기

    // 사용자가 타이틀을 클릭했을 때 CONTENT_URL을 가지고 ajax를 호출해서 데이터를 가져오는 코드
    ajax.open('GET', CONTENT_URL.replace('@id', id), false);
    ajax.send();

    const newsContent = JSON.parse(ajax.response);
    const title = document.createElement('h1');

    title.innerHTML = newsContent.title;
    content.appendChild(title);
});

for (let i = 0; i < 10; i++) {
    const li = document.createElement('li');
    const a = document.createElement('a');

    a.href = `#${newsFeed[i].id}`; // # : 해시
    a.innerHTML = `${newsFeed[i].title} (${newsFeed[i].comments_count})`;

    li.appendChild(a);
    ul.appendChild(li);
}

container.appendChild(ul);
container.appendChild(content);