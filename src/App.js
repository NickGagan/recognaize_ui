import '../node_modules/react-notifications-component/dist/theme.css'

import './App.scss';
import { useState } from "react";
import cx from "classnames";
import { ReactNotifications, Store } from 'react-notifications-component'
import { RECOGNIZE_AI_MESSAGE, RECOGNIZE_AI_RESOURCES, RECOGNIZE_AI_MODEL_DESC } from "./utils/messages";
import report from "./static/Recognize_report_placeholder.pdf"
import {Buffer} from "buffer";
const REDDIT_STATE = "reddit";
const TEXT_STATE = "text";

const API_HOST = process.env.REACT_APP_API_ENV === "dev" ? "http://localhost:3001" : "https://recognize-ai-api.herokuapp.com";
function App() {
  const [currentTab, selectTab] = useState(REDDIT_STATE);
  const [inputText, changeInputText] = useState("");
  const [redditMessageFlag, changeRedditFlag] = useState(false);
  function _changeRedditFlagState(event) {
    changeRedditFlag(event.target.checked);
  }

  function _updateInputText(event) {
    changeInputText(event.target.value);
  }
  function _onPreviewClick() {
    window.open(inputText);
  }
  function _changeTab(type) {
    if (currentTab !== type) {
      selectTab(type);
      changeInputText("");
      changeRedditFlag(false);
    }
  }

  function _isValidInput() {
    if (currentTab === TEXT_STATE){
      return inputText.length >= 80
    }
    const re = new RegExp("https://www.reddit.com/r/[^/]+/comments/[A-Za-z0-9]{6,}/[^/]")
    const urlSplit = inputText.split("/")
    return re.test(inputText) && (urlSplit.length === 8 || (urlSplit.length === 9 && urlSplit[8] === ""))
  }
  function _onAnalyzeButtonClick() {
    console.log(Buffer.from("admin:admin").toString('base64'));
    const options = {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from("admin:admin").toString('base64')}`
      },
      body: JSON.stringify({
        message: `${RECOGNIZE_AI_MESSAGE}
        Post: ${inputText}`,
        messageSubject: "Recognize.ai mental health detector"
      })
    };
    let url = API_HOST
    if (currentTab === REDDIT_STATE) {
      const redditPost = inputText.split("/");
      const redditPostId = `t3_${redditPost[6]}`;
      url += `/health_reddit?id=${redditPostId}`
      if (redditMessageFlag === true) {
        url += `&messageFlag=${redditMessageFlag}`;
      }
    } else {
      url += '/health_text'
      options.body = JSON.stringify({
        text: inputText
      })
    }
    // TODO: text state
    fetch(url, options)
      .then((response) => response.json())
      .then(result => {
        console.log("result");
        let message = "Recognaize.ai has detected no mental health issues in this text. Still concerned? Visit our resources link below.";
        let type = "success";
        if (result.poor_mental_health && currentTab === TEXT_STATE) {
          message = "Recognaize.ai has detected mental health issues in the provided text. Please visit our list of resources for help/more information."
          type = "default";
        }
        if (result.poor_mental_health && currentTab === REDDIT_STATE) {
          message = "Recognaize.ai has detected mental health issues in the provided text. Please visit our list of resources for help/more information."
          type = "default";
          if (result.sent_message) {
            message += ` A message has been sent to the user: ${result.author}.`
          }
        }

        if (result && result.statusCode && result.statusCode !== 200) {
          message = (result.message) ? result.message : "An unknown error has occured. Please try again later";
          type = "danger";
        }
        Store.addNotification({
          title: "Model has run successfully",
          message: message,
          type: type,
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: (type === "danger") ? 5000 : 10000,
            onScreen: true
          }
        });
      })
      .catch(err => {
        console.log(err)
        Store.addNotification({
          title: "An error occured running Recognaize.ai",
          message: "An unknown error has occured. Please try again later",
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true
          }
        });
      });
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
          <button className={redditTabStyle} onClick={() => _changeTab(REDDIT_STATE)}>
            Reddit analysis
          </button>
          <button className={textTabStyle} onClick={() => _changeTab(TEXT_STATE)}>
            Text analysis
          </button>
        </div>
    );
  }

  function _renderTextArea() {
    const invalid = !_isValidInput();
    const textAreaStyles = cx({
      "textArea": true,
      "invalid": invalid
    });
    return (
      <>
        <textarea
          className={textAreaStyles}
          id="textInput"
          rows={10}
          placeholder="Please paste text here..."
          onChange={_updateInputText.bind(this)}
        />
        {invalid && <div className="invalidInputMessage">
          Minimum 80 characters ({80-inputText.length} remaining)
          </div>}
      </>
      
    );
  }

  function _renderRedditUrlInput() {
    const invalidString = "URL format must follow: https://www.reddit.com/r/${SUB_REDDIT}/comments/${POST_ID}/${POST_NAME}"
    const invalid = !_isValidInput();
    const redditInputStyles = cx({
      "redditInput": true,
      "invalid": invalid
    });
    return (
      <>
      <input
        className={redditInputStyles}
        id="redditInput"
        placeholder="Please paste reddit url here..."
        type="url"
        onChange={_updateInputText.bind(this)}
      />
      {invalid && <div className="invalidInputMessage">
          {invalidString}
          </div>}
      </>
    )
    
  }
  function _renderResourcesContent() {
    return (<div className="resourcesSection">
      <div className="resourceHeader">
        Resources
      </div>
      <div className="resourceDescription">
        {RECOGNIZE_AI_RESOURCES}
        <a href="http://www.suicidepreventionlifeline.org" target="_blank"> 
        {"\n National Suicide Prevention Lifeline"}
        </a>
        <div> Phone: 1 800 273 TALK (8255)</div>
        <a href="http://www.befrienders.org" target="_blank"> 
        {"\n Befrienders"}
        </a>
        <div> Confidential support for those in distress</div>
      </div>
    </div>)
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
              Recognize.ai is able to take a reddit url and determine whether the post displays signs of struggling mental health (min 80 chars). 
            </div>
            {_renderRedditUrlInput()}
            <div className="messageUserContainer">
              <div className="messageUserDescription">

              </div>
              <input
                type="checkbox"
                id="messageUserCheckbox"
                name="Message User?"
                value="Message User?"
                onClick={_changeRedditFlagState.bind(this)}/>
              <label className="messageCheckboxLabel">Message User?</label>
              {_renderResourcesContent()}
            </div>
          </div>
          <div className="redditDescriptionContainer">
            <div className="redditHeader">
              Model Description
            </div>
            <div className="redditDescription">
              {RECOGNIZE_AI_MODEL_DESC}
              <a href={report} target="_blank"> Report </a>
            </div>
          </div>

        </div>}



        {currentTab === TEXT_STATE && <div className="textSectionContainer">
          <div className="textInputSection">
            <div className="textHeader">
              Text Input
            </div>
            <div className="textDescription">
              Recognize.ai is able to take a text input and determine whether it displays sign of struggling mental health (min 80 chars). 
            </div>
            {_renderTextArea()}
            {_renderResourcesContent()}
          </div>
          <div className="textDescriptionContainer">
            <div className="textHeader">
              Model Description
            </div>
            <div className="textDescription">
              {RECOGNIZE_AI_MODEL_DESC}
              <a href={report} target="_blank"> Report </a>
            </div>
          </div>
        </div>}
      </div>
    );
  }

  function _renderFooterSection() {
    const primaryButtonClass = cx({
      "button": true,
      "primary": true,
      "disabled": !_isValidInput()
    });
    const secondaryButtonClass = cx({
      "button": true,
      "secondary": true,
      "disabled": !_isValidInput()
    });
    return (
      <div className="footerSection">
          {currentTab === REDDIT_STATE && <button
            className={secondaryButtonClass}
            onClick = {() => _onPreviewClick()}
            disabled={!_isValidInput()}
            >
              Preview
            </button>}
            <button disabled={!_isValidInput()} className={primaryButtonClass} onClick = {() => _onAnalyzeButtonClick()}>
              Analyze
            </button>
      </div>
    );
  }

  return (
    <div className="App">
      <ReactNotifications />
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
