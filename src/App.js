import logo from './logo.svg';
import './App.scss';
import { useCallback, useState } from "react";
import cx from "classnames";
// import { analyzePost } from "./utils/recognize_ai_util";
const REDDIT_STATE = "reddit";
const TEXT_STATE = "text";


function App() {
  const [currentTab, selectTab] = useState(REDDIT_STATE);
  const [inputText, changeInputText] = useState("");
  const [redditMessageFlag, changeRedditFlag] = useState(false);
  const [analyzeButtonDisabled, disableAnalyzeButton] = useState(true);

  function _changeRedditFlagState(event) {
    changeRedditFlag(event.target.checked);
  }

  function _updateInputText(event) {
    changeInputText(event.target.value);
  }

  function _onAnalyzeButtonClick() {
    const options = {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: "Template message body",
        messageSubject: "Template message subject"
      })
    };
    let url = "http://localhost:3001";
    if (currentTab === REDDIT_STATE) {
      const redditPost = "https://www.reddit.com/r/RecognAIze/comments/r8954v/test_post/".split("/");
      const redditPostId = `t3_${redditPost[6]}`;
      url += `/health_reddit?id=${redditPostId}`
      if (redditMessageFlag === true) {
        url += `&messageFlag=${redditMessageFlag}`;
      }
    }
    // TODO: text state
    fetch(url, options)
      .then(response => response.json())
      .then(console.log("test"));
  }
  function _renderTabs() {
    const redditTabStyle = cx({
      "tab": true,
      "clicked": currentTab === REDDIT_STATE
    });
    const textTabStyle = cx({
      "tab": true,
      "clicked": currentTab === TEXT_STATE
    });
    return (
      <div className="tabSection">
          <button className={redditTabStyle} onClick={() => selectTab(REDDIT_STATE)}>
            Reddit analysis
          </button>
          <button className={textTabStyle} onClick={() => selectTab(TEXT_STATE)}>
            Text analysis
          </button>
        </div>
    );
  }

  function _renderPageContent() {
    return (
      <div className="pageContent">
        {currentTab === REDDIT_STATE && <div className="redditSectionContainer">
        <div className="redditInputSection">
            <div className="redditHeader">
              Reddit Input
            </div>
            <div className="redditDescription">
              Recognize.ai is able to take a reddit url and determine whether the post displays signs of struggling mental health (min 150 chars). 
            </div>
            <input
              id="redditInput"
              placeholder="Please paste reddit url here..."
              type="url"
              onChange={_updateInputText.bind(this)}
            />
            <div className="messageUserContainer">
              <div className="messageUserDescription">

              </div>
              <input
                type="checkbox"
                id="messageUserCheckbox"
                name="Message User?"
                value="Message User?"
                onClick={_changeRedditFlagState.bind(this)}/>
              <label>Message User?</label>
            </div>

          </div>
          <div className="redditOutputSection">
            <div className="redditHeader">
              Results
            </div>
            <div className="redditDescription">
              Click analyze to see results
            </div>
          </div>

        </div>}



        {currentTab === TEXT_STATE && <div className="textSectionContainer">
          <div className="textInputSection">
            <div className="textHeader">
              Text Input
            </div>
            <div className="textDescription">
              Recognize.ai is able to take a text input and determine whether it displays sign of struggling mental health (min 150 chars). 
            </div>
            <textarea
              id="textInput"
              rows={10}
              placeholder="Please paste text here..."
              onChange={_updateInputText.bind(this)}
            />
          </div>
          <div className="textOutputSection">
            <div className="textHeader">
              Results
            </div>
            <div className="textDescription">
              Click analyze to see results
            </div>
          </div>
        </div>}
      </div>
    );
  }

  function _renderFooterSection() {
    const primaryButtonClass = cx({
      "button": true,
      "primary": true
    });
    const secondaryButtonClass = cx({
      "button": true,
      "secondary": true
    });
    return (
      <div className="footerSection">
          {currentTab === REDDIT_STATE && <button
            className={secondaryButtonClass}
            >
              Preview
            </button>}
          <button className={primaryButtonClass} onClick = {() => _onAnalyzeButtonClick()}>
            Analyze
          </button>
      </div>
    );
  }
  return (
    <div className="App">
      <div className="creditSection">
        Developed by: Nick Gagan, Dennis Huynh, Christopher Salomons, Randy Lee
      </div>
      <div className="titleSection">
          Recognize.ai
      </div>
      <div className="container">
        {_renderTabs()}
        {_renderPageContent()}
        {_renderFooterSection()}
      </div> 
    </div>
  );
}

export default App;
