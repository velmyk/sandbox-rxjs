const refreshButton = document.querySelector('.refresh');
const refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');

const requestStream = refreshClickStream
    .startWith('startup click')
    .map(() => {
        const randomOffset = Math.floor(Math.random()*500);
        return 'https://api.github.com/users?since=' + randomOffset;
    });

const responseStream = requestStream
    .flatMap(requestUrl => Rx.Observable.fromPromise(jQuery.getJSON(requestUrl)));

const close1Button = document.querySelector('.close1');

const close1ClickStream = Rx.Observable.fromEvent(close1Button, 'click');

const suggestion1Stream = close1ClickStream.startWith('startup click') // we added this
    .combineLatest(responseStream,             
        (click, listUsers) => listUsers[Math.floor(Math.random()*listUsers.length)]
    )
    .merge(
        refreshClickStream.map(() => null)
    )
    .startWith(null);

suggestion1Stream.subscribe(suggestion => renderSuggestion(suggestion, '.suggestion1'));

const suggestion2Stream = responseStream
    .map(listUsers => listUsers[Math.floor(Math.random()*listUsers.length)])
    .merge(
        refreshClickStream.map(() => null)
    )
    .startWith(null);

suggestion2Stream.subscribe(suggestion => renderSuggestion(suggestion, '.suggestion2'));

const suggestion3Stream = responseStream
    .map(listUsers => listUsers[Math.floor(Math.random()*listUsers.length)])
    .merge(
        refreshClickStream.map(() => null)
    )
    .startWith(null);

suggestion3Stream.subscribe(suggestion => renderSuggestion(suggestion, '.suggestion3'));

function renderSuggestion(suggestedUser, selector) {
    var suggestionEl = document.querySelector(selector);
    if (suggestedUser === null) {
        suggestionEl.style.visibility = 'hidden';
    } else {
        suggestionEl.style.visibility = 'visible';
        var usernameEl = suggestionEl.querySelector('.username');
        usernameEl.href = suggestedUser.html_url;
        usernameEl.textContent = suggestedUser.login;
        var imgEl = suggestionEl.querySelector('img');
        imgEl.src = "";
        imgEl.src = suggestedUser.avatar_url;
    }
}
