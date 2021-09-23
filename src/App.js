import React, { Component } from "react";
import "./App.css";
import $ from "jquery";

class App extends Component {
  componentDidMount() {
    // <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>;
    // on input/text enter--------------------------------------------------------------------------------------
    $(".usrInput").on("keyup keypress", function (e) {
      var keyCode = e.keyCode || e.which;
      var text = $(".usrInput").val();
      if (keyCode === 13) {
        if (text == "" || $.trim(text) == "") {
          e.preventDefault();
          return false;
        } else {
          $(".usrInput").blur();
          setUserResponse(text);
          send(text);
          e.preventDefault();
          return false;
        }
      }
    });

    $("#send_btn").click(function (e) {
      var text = $(".usrInput").val();
      if (text == "" || $.trim(text) == "") {
        e.preventDefault();
        return false;
      } else {
        $(".usrInput").blur();
        setUserResponse(text);
        send(text);
        e.preventDefault();
        return false;
      }
    });

    //------------------------------------- Set user response------------------------------------
    function setUserResponse(val) {
      var UserResponse =
        //   '<img class="userAvatar" src=' +
        //   "./static/img/userAvatar.jpg" +
        //   '>
      '<p class="userMsg">' + val + ' </p><div class="clearfix"></div>';
      $(UserResponse).appendTo(".chats").show("slow");
      $(".usrInput").val("");
      scrollToBottomOfResults();
      $(".suggestions").remove();
    }

    //---------------------------------- Scroll to the bottom of the chats-------------------------------
    function scrollToBottomOfResults() {
      var terminalResultsDiv = document.getElementById("chats");
      terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
    }

    function send(message) {
      console.log("User Message:", message);
      $.ajax({
        url: "https://chatbot-q6uoj7vcrq-uc.a.run.app/",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          message: message,
          sender: "AskRC",
        }),
        success: function (data, textStatus) {
          if (data != null) {
            setBotResponse(data);
          }
          console.log("Rasa Response: ", data, "\n Status:", textStatus);
        },
        error: function (errorMessage) {
          setBotResponse("");
          console.log("Error" + errorMessage);
        },
      });
    }

    //------------------------------------ Set bot response -------------------------------------
    function setBotResponse(val) {
      setTimeout(function () {
        if (val.length < 1) {
          //if there is no response from Rasa
          var msg = "I couldn't get that. Let' try something else!";

          var BotResponse =
            // '<img class="botAvatar" src="./static/img/botAvatar.png">
            '<p class="botMsg">' +
            msg + '</p><div class="clearfix"></div>';
          $(BotResponse).appendTo(".chats").hide().fadeIn(1000);
        } else {
          //if we get response from Rasa
          var i;
          for (i = 0; i < val.length; i++) {
            //check if there is text message
            if (val[i].hasOwnProperty("text")) {
              var BotResponse =
                //  '<img class="botAvatar" src="./static/img/botAvatar.png">
                '<p class="botMsg">' +
                val[i].text +
                '</p><div class="clearfix"></div>';
              $(BotResponse).appendTo(".chats").hide().fadeIn(1000);
            }

            //check if there is image
            if (val[i].hasOwnProperty("image")) {
              var BotResponse =
                '<div class="singleCard">' +
                '<img class="imgcard" src="' +
                val[i].image +
                '">' +
                '</div><div class="clearfix">';
              $(BotResponse).appendTo(".chats").hide().fadeIn(1000);
            }

            //check if there is  button message
            if (val[i].hasOwnProperty("buttons")) {
              addSuggestion(val[i].buttons);
            }
          }
          scrollToBottomOfResults();
        }
      }, 500);
    }

    // ------------------------------------------ Toggle chatbot -----------------------------------------------
    $("#profile_div").click(function () {
      $(".profile_div").toggle();
      $(".widget").toggle();
      scrollToBottomOfResults();
    });

    $("#close").click(function () {
      $(".profile_div").toggle();
      $(".widget").toggle();
    });
    
    $("body").on("keyup keypress", function (e) {
      var keyCode = e.keyCode || e.which;
      if(keyCode === 27){
        $(".profile_div").toggle(true);
        $(".widget").toggle(false);
      }
    })

    // ------------------------------------------ Suggestions -----------------------------------------------

    function addSuggestion(textToAdd) {
      setTimeout(function () {
        var suggestions = textToAdd;
        var suggLength = textToAdd.length;
        $(
          ' <div class="singleCard"> <div class="suggestions"><div class="menu"></div></div></diV>'
        )
          .appendTo(".chats")
          .hide()
          .fadeIn(1000);
        // Loop through suggestions
        var i;
        for (i = 0; i < suggLength; i++) {
          $(
            '<div class="menuChips" data-payload=\'' +
              suggestions[i].payload +
              "'>" +
              suggestions[i].title +
              "</div>"
          ).appendTo(".menu");
        }
        scrollToBottomOfResults();
      }, 1000);
    }

    // on click of suggestions, get the value and send to rasa
    $(document).on("click", ".menu .menuChips", function () {
      var text = this.innerText;
      var payload = this.getAttribute("data-payload");
      console.log("button payload: ", this.getAttribute("data-payload"));
      setUserResponse(text);
      send(payload);
      $(".suggestions").remove(); //delete the suggestions
    });
  }

  render() {
    return (
      <div>
        <div className="widget">
          <div className="chat_header">
            <img id="logoimg" src="logo.png" alt="logo" />
            &nbsp;
            <span style={{ color: "white" }}>AskRC</span>
            <span
              style={{
                color: "white",
                marginRight: "5px",
                float: "right",
                marginTop: "5px",
              }}
              id="close"
            >
              <i className="fas fa-caret-down"></i>
            </span>
          </div>
          <div className="chats" id="chats">
            <div className="clearfix"></div>
          </div>

          <div className="keypad">
            <input
              type="text"
              id="keypad"
              className="usrInput browser-default"
              placeholder="Type a message..."
              autoComplete="off"
              autoFocus="autoFocus"
            />
            <i className="far fa-paper-plane" id="send_btn"></i>
          </div>
        </div>
        <div className="profile_div" id="profile_div">
          <button id="widget_btn" className="fas fa-comment-dots">
            <span style={{ fontFamily : "sans-serif", fontWeight:"lighter"}}>&nbsp; &nbsp;AskRC</span>
          </button>
        </div>
      </div>
    );
  }
}
export default App;
