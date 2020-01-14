const users = [
  {
    name: "Satya",
    password: 1234,
    id: 1
  },
  {
    name: "Vaishali",
    password: 1111,
    id: 2
  },
  {
    name: "Dan",
    password: 1217,
    id: 3
  }
];

let user = {},
  name = "",
  isAuthorized = false;

const getUser = name => users.find(o => o.name === name);

const isPinValid = (pin, name) => {
  user = getUser(name);
  if (user == undefined || Object.keys(user).length === 0) return false;
  if (user) return user.password == pin;
  return false;
};

exports.handler = (event, context, callback) => {
  switch (event.request.type) {
    case "LaunchRequest":
      context.succeed(
        generateResponse(
          buildSpeechletResponse(
            "Welcome to Join Digital Alexa Connectivity App. Please let me know your name to authorize",
            false
          )
        )
      );
      user = {};
      isAuthorized = false;
      break;
    case "IntentRequest":
      switch (event.request.intent.name) {
        case "UsernameIntent":
          name = event.request.intent.slots.user.value;
          if (getUser(name)) {
            context.succeed(
              generateResponse(
                buildSpeechletResponse(
                  `Hi ${name}, Please tell me your password`,
                  false
                )
              )
            );
          } else {
            context.succeed(
              generateResponse(
                buildSpeechletResponse(
                  `Hi ${name}, You are not authorized to use this app, Please contact the administration for access and try again or, if you are different person please use your name`,
                  false
                )
              )
            );
          }
          break;

        // help intent

        case "AMAZON.HelpIntent":
          context.succeed(
            generateResponse(
              buildSpeechletResponse("Help is on the way.", false)
            )
          );
          break;

        case "AMAZON.CancelIntent":
          context.succeed(
            generateResponse(
              buildSpeechletResponse("Cancelling it", true)
            )
          );
          break;

        case "AMAZON.StopIntent":
          context.succeed(
            generateResponse(
              buildSpeechletResponse("Stopping it", true)
            )
          );
          break;

        // password intent

        case "PasswordIntent":
          const pin = event.request.intent.slots.passcode.value;
          if (isPinValid(pin, name)) {
            isAuthorized = true;
            context.succeed(
              generateResponse(
                buildSpeechletResponse(
                  `Hey ${name}, You are authorized to do the operations`,
                  false
                )
              )
            );
          } else {
            context.succeed(
              generateResponse(
                buildSpeechletResponse(
                  `Hey ${name}, Pin is incorrect, You are not authorized to do the operations, Please try again`,
                  false
                )
              )
            );
          }
          break;
        // connect wifi
        case "ConnectWifi":
          if (isAuthorized) {
            context.succeed(
              generateResponse(
                buildSpeechletResponse("Successfully connected to wifi", false)
              )
            );
          } else {
            context.succeed(
              generateResponse(
                buildSpeechletResponse(
                  "Please login to use this feature",
                  false
                )
              )
            );
          }
          break;

        // disconnect wifi
        case "DisconnectWifi":
          if (isAuthorized) {
            context.succeed(
              generateResponse(
                buildSpeechletResponse("Successfully Turned of the wifi", false)
              )
            );
          } else {
            context.succeed(
              generateResponse(
                buildSpeechletResponse(
                  "Please login to use this feature",
                  false
                )
              )
            );
          }
          break;

        // Heater on

        case "HeaterOnIntent":
          if (isAuthorized) {
            context.succeed(
              generateResponse(
                buildSpeechletResponse("Heater is up and running.", false)
              )
            );
          } else {
            context.succeed(
              generateResponse(
                buildSpeechletResponse(
                  "Please login to use this feature",
                  false
                )
              )
            );
          }
          break;

        // Heater off

        case "HeaterOffIntent":
          if (isAuthorized) {
            context.succeed(
              generateResponse(
                buildSpeechletResponse(
                  "Successfully Turned of the heater",
                  false
                )
              )
            );
          } else {
            context.succeed(
              generateResponse(
                buildSpeechletResponse(
                  "Please login to use this feature",
                  false
                )
              )
            );
          }
          break;

        // Door open

        case "DoorOpenIntent":
          if (isAuthorized) {
            context.succeed(
              generateResponse(
                buildSpeechletResponse("Door is now open!!!", false)
              )
            );
          } else {
            context.succeed(
              generateResponse(
                buildSpeechletResponse(
                  "Please login to use this feature",
                  false
                )
              )
            );
          }
          break;

        // Door close

        case "DoorCloseIntent":
          if (isAuthorized) {
            context.succeed(
              generateResponse(
                buildSpeechletResponse("Successfully Closed the door", false)
              )
            );
          } else {
            context.succeed(
              generateResponse(
                buildSpeechletResponse(
                  "Please login to use this feature",
                  false
                )
              )
            );
          }
          break;

        case "ZoomApiIntent":
          if (isAuthorized) {
            context.succeed(
              generateResponse(
                buildSpeechletResponse(
                  "Successfully created a zoom meeting room.",
                  false
                )
              )
            );
          } else {
            context.succeed(
              generateResponse(
                buildSpeechletResponse(
                  "Please login to use this feature",
                  false
                )
              )
            );
          }
          break;
      }
      break;
  }
};

const buildSpeechletResponse = (outputText, shouldEndSession) => {
  return {
    outputSpeech: {
      type: "PlainText",
      text: outputText
    },
    shouldEndSession: shouldEndSession
  };
};

const generateResponse = speechletResponse => {
  return {
    version: "1.0",
    response: speechletResponse
  };
};
