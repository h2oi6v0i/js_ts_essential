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
    let template = `
        <div class="bg-gray-600 min-h-screen">
            <div class="bg-white text-xl">
                <div class="mx-auto px-4">
                    <div class="flex justify-between items-center py-6">
                        <div class="flex justify-start">
                            <h1 class="font-extrabold">Hacker News</h1>
                        </div>
                        <div class="items-center justify-end">
                            <a href="#/page/{{__prev_page__}}" class="text-gray-500">
                                Previous
                            </a>
                            <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
                                Next
                            </a>
                        </div>
                    </div> 
                </div>
            </div>
            <div class="p-4 text-2xl text-gray-700">
                {{__news_feed__}}        
            </div>
        </div>
  `;

    for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) { // 문자열로 처리기 만들고
        newsList.push(`
            <div class="p-6 ${newsFeed[i].read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
                <div class="flex">
                    <div class="flex-auto">
                        <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>  
                    </div>
                    <div class="text-center text-sm">
                        <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${newsFeed[i].comments_count}</div>
                    </div>
                </div>
                <div class="flex mt-3">
                    <div class="grid grid-cols-3 text-sm text-gray-500">
                        <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
                        <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
                        <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
                    </div>  
                </div>
            </div>    
        `);
    }

    // template의 {{__news_feed__}} 부분을 for문이 다 돈 후 만들어져 있는 li 요소로 교체
    template = template.replace("{{__news_feed__}}", newsList.join(""));
    template = template.replace("{{__prev_page__}}", store.currentPage > 1 ? store.currentPage - 1 : 1);
    template = template.replace("{{__next_page__}}", store.currentPage + 1);

    container.innerHTML = template;
}

/**
 * 글 내용 화면
 */
function newsDetail() {
    const id = location.hash.substr(7); // # 빼기
    // 사용자가 타이틀 클릭하면 CONTENT_URL을 가지고 ajax를 호출해서 데이터 가져옴
    const newsContent = getData(CONTENT_URL.replace('@id', id));

    let template = `
        <div class="bg-gray-600 min-h-screen pb-8">
            <div class="bg-white text-xl">
                <div class="mx-auto px-4">
                    <div class="flex justify-between items-center py-6">
                        <div class="flex justify-start">
                            <h1 class="font-extrabold">Hacker News</h1>
                        </div>
                        <div class="items-center justify-end">
                            <a href="#/page/${store.currentPage}" class="text-gray-500">
                                <i class="fa fa-times"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="h-full border rounded-xl bg-white m-6 p-4 ">
                <h2>${newsContent.title}</h2>
                <div class="text-gray-400 h-20">
                    ${newsContent.content}
                </div>

                {{__comments__}}

            </div>
        </div>
    `;

    /**
     * 댓글
     */
    function makeComment(comments, called = 0) {
        const commentString = [];

        for (let i = 0; i < comments.length; i++) {
            commentString.push(`
                <div style="padding-left: ${called * 40}px;" class="mt-4">
                    <div class="text-gray-400">
                        <i class="fa fa-sort-up mr-2"></i>
                        <strong>${comments[i].user}</strong> ${comments[i].time_ago}
                    </div>
                    <p class="text-gray-700">${comments[i].content}</p>
                </div>      
            `);

            /**
             * 대댓글
             */
            if (comments[i].comments.length > 0) {
                // 재귀 호출
                commentString.push(makeComment(comments[i].comments, called + 1));
              };
        }

        return commentString.join('');
    }

    container.innerHTML = template.replace("{{__comments__}}", makeComment(newsContent.comments));
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