const ajax = new XMLHttpRequest();
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'

ajax.open('GET', NEWS_URL, false); // false : 데이터를 동기적으로 처리하겠다.
ajax.send(); // 이때 데이터를 가져옴

const newsFeed = JSON.parse(ajax.response); // 가져온 JSON 데이터를 객체로 바꾸기
const ul = document.createElement('ul');

for (let i = 0; i < 10; i++) {
    const li = document.createElement('li');

    li.innerHTML = newsFeed[i].title
    ul.appendChild(li);
}


document.getElementById('root').appendChild(ul);