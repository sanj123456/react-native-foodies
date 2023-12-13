import React, {useState} from 'react';
import {ActivityIndicator, View, Text} from 'react-native';
import {WebView, WebViewMessageEvent, WebViewProps} from 'react-native-webview';
import {isStag} from '../constants/constants';
import {useAppSelector} from '../redux';
import {prettyPrint} from '../utils/functions';

type PaymentEnvironment = 'sandbox' | 'live';

const VGSWebView = ({onMessage}: WebViewProps) => {
  const {subMerchantId, enableEnhancedSecurity} = useAppSelector((state) => state.gateway);
  const restaurant = useAppSelector((state) => state.restaurant);
  const [webViewHeight, setWebViewHeight] = useState(15);
  const [isLoading, setIsloading] = useState(true);

  const injectedJavaScript = `subMerchantId="${subMerchantId}";enableEnhancedSecurity=${enableEnhancedSecurity};`;
  console.log(restaurant);
  console.log(injectedJavaScript);
  const _onMessage = (event: WebViewMessageEvent) => {
    const {_webViewHeight} = JSON.parse(event.nativeEvent.data) ?? {};
    if (_webViewHeight) {
      setWebViewHeight(_webViewHeight);
      setIsloading(false);
    } else {
      onMessage?.(event);
    }
  };

  return (
    <View style={{height: webViewHeight}}>
      {isLoading && <ActivityIndicator />}
      <WebView
        originWhitelist={['*']}
        source={{
          html: VGSCollectFormHTMl,
        }}
        onMessage={_onMessage}
        injectedJavaScript={injectedJavaScript}
        scrollEnabled={true}
        automaticallyAdjustContentInsets={false}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onError={prettyPrint}
      />
    </View>
  );
};
export default VGSWebView;

const VGSCollectFormHTMl = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1"
    />
    <title>Jupiter Tokenization Credit Card Example</title>
    <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
      integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
      crossorigin="anonymous"
    />
    <script
      type="text/javascript"
      src="https://js.verygoodvault.com/vgs-collect/2.6.0/vgs-collect.js"
    ></script>
    <style>
      body {
        padding: 0px 1px 0px 1px;
      }

      span[id*="cc-"] {
        display: block;
        height: 40px;
        margin-bottom: 15px;
      }

      span[id*="cc-"] iframe {
        height: 100;
        width: 100%;
      }

      pre {
        font-size: 12px;
      }

      .form-field {
        display: block;
        width: 100%;
        height: calc(2.25rem + 2px);
        padding: 0.375rem 0.75rem;
        font-size: 1rem;
        line-height: 1.5;
        color: #495057;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid #ced4da;
        border-radius: 0.25rem;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
      }

      .form-field iframe {
        border: 0 none transparent;
        height: 100%;
        vertical-align: middle;
        width: 100%;
      }

      p {
        margin-bottom: 10px;
      }

      #errors li {
        font-size: 11px;
        color: #ff1721;
      }

      #errors i.error-msg {
        font-weight: 400;
        letter-spacing: 0;
        font-style: normal;
      }

      .custom-control-input:checked ~ .custom-control-label::before {
        border-color: #dc4135 !important;
        background-color: #dc4135 !important;
      }

      .custom-control-input:focus ~ .custom-control-label::before {
        box-shadow: 0 0 0 0.2rem #dc413540 !important;
      }

      .lds-dual-ring {
        display: inline-block;
        width: 24px;
        height: 24px;
      }
      .lds-dual-ring:after {
        content: " ";
        display: block;
        width: 24px;
        height: 24px;
        margin: auto 0px;
        border-radius: 50%;
        border: 6px solid #fff;
        border-color: #fff transparent #fff transparent;
        animation: lds-dual-ring 0.5s linear infinite;
      }
      @keyframes lds-dual-ring {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

    </style>
  </head>

  <body>
    <main>
      <div class="d-flex justify-center">
        <form id="cc-form" class="w-100">
          <div class="form-group">
            <label for="cc-name">Name</label>
            <span id="cc-name" class="form-field"></span>
          </div>
          <div class="form-group">
            <label for="cc-number">Card number</label>
            <span id="cc-number" class="form-field"></span>
          </div>
          <div class="form-group">
            <label for="cc-cvc">CVC</label>
            <span id="cc-cvc" class="form-field"></span>
          </div>
          <div class="form-group">
            <label for="cc-expiration-date">Expiration date</label>
            <span id="cc-expiration-date" class="form-field"></span>
          </div>
          <div class="form-group" id="enableEnhancedSecurityId" style="display:none">
            <label for="card-name-element">Zip Code</label>
            <input
              class="form-field"
              id="card-zip-element"
              name="billingZip"
              placeholder="12345"
              type="text"
            />
          </div>
          <div class="custom-control custom-checkbox my-2">
            <input
              type="checkbox"
              class="custom-control-input"
              id="saveThisCardForFutureCheckout"
            />
            <label
              class="custom-control-label"
              for="saveThisCardForFutureCheckout"
              >Save this card for future checkout</label
            >
          </div>
          <button
            id="submitButton"
            type="submit"
            class="btn btn-md float-right btn-block"
            style="background-color: #dc4135; color: #fff"
          >
            Place Order
          </button>
          <div id="btnLoader" style="background-color: #dc4135;height:38px;width:100%;display:none;" class="btn text-center"> 
            <div  class="lds-dual-ring"></div>
          </div>
        </form>
        <ul
          id="errors"
          style="display: none; margin-bottom: 0; margin-top: 10px"
        >
          <li><i id="nameOnCardError" class="error-msg"></i></li>
          <li><i id="cardNumberError" class="error-msg"></i></li>
          <li><i id="cvcError" class="error-msg"></i></li>
          <li><i id="expirationDateError" class="error-msg"></i></li>
        </ul>
      </div>
    </main>
    <script>
      let subMerchantId = ""; // Replace with the merchant associated with Branch or Location
      let env = "";
      let vaultId = "";
      let environment = "";

      let isLive = ${!isStag};
      let enableEnhancedSecurity = false;

      if (isLive) {
        env = "platform";
        vaultId = "tntaxfujub5";
        environment = "live";
      } else {
        env = "sandbox-platform";
        vaultId = "tntne5koztu";
        environment = "sandbox";
      }

      window.addEventListener("load", (event) => {
        setTimeout(()=>{
          console.log(subMerchantId);
          console.log('enableEnhancedSecurity',enableEnhancedSecurity)
        
        
        if(enableEnhancedSecurity){
          document.getElementById("enableEnhancedSecurityId").style.display = "block";
        }
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            _webViewHeight: document.body.scrollHeight,
          })
        );
      },1000)
      });

      const form = VGSCollect.create(
        vaultId,
        environment,
        (state) => (formState = state)
      );

      let formState = {};

      form.field("#cc-name", {
        type: "text",
        name: "CardHolderName",
        placeholder: "Joe Business",
        validations: ["required"],
      });

      form.field("#cc-number", {
        type: "card-number",
        name: "CreditCardNumber",
        successColor: "#4F8A10",
        errorColor: "#D8000C",
        placeholder: "4111 1111 1111 1111",
        validations: ["required", "validCardNumber"],
      });

      form.field("#cc-cvc", {
        type: "card-security-code",
        name: "Cvv",
        placeholder: "344",
        validations: ["required", "validCardSecurityCode"],
      });

      form.field("#cc-expiration-date", {
        type: "card-expiration-date",
        yearLength: 2,
        name: "ExpirationDate",
        placeholder: "01 / 25",
        serializers: [
          {
            name: "separate",
            options: {
              monthName: "ExpirationMonth",
              yearName: "ExpirationYear",
            },
          },
        ],
        validations: ["required", "validCardExpirationDate"],
      });


      function showPlaceOrderLoader() {
        document.getElementById("submitButton").style.display = "none";
        document.getElementById("btnLoader").style.display = "block";
        
        document
          .getElementById("submitButton")
          .setAttribute("disabled", true);
      }

      const removePlaceOrderLoader = () => {
        document.getElementById("submitButton").style.display = "block";
        document.getElementById("submitButton").innerHTML = "Place Order";
        document.getElementById("btnLoader").style.display = "none";
        document
          .getElementById("submitButton")
          .removeAttribute("disabled");
      }

      const submitForm = async function (e) {
        e.preventDefault();

        const { CreditCardNumber, Cvv, ExpirationDate, CardHolderName } =
          formState;
          const zipCode = document.getElementById("card-zip-element").value;

        let errorsElement = document.getElementById("errors");

        if (
          CreditCardNumber.errorMessages.length > 0 ||
          Cvv.errorMessages.length > 0 ||
          ExpirationDate.errorMessages.length > 0 ||
          CardHolderName.errorMessages.length > 0 ||
          (enableEnhancedSecurity && !zipCode || zipCode.length > 10)
        ) {
        } else {
          document.getElementById("submitButton").innerHTML = "Tokenizing...";
          document
          .getElementById("submitButton")
          .setAttribute("disabled", true);
        }

        let errorMsgs = [];

        if (CardHolderName.errorMessages.length > 0) {
          let errorMsg = "Name " + CardHolderName.errorMessages[0];
          errorMsgs.push(errorMsg);
        }
        if (CreditCardNumber.errorMessages.length > 0) {
          let errorMsg = "Card number " + CreditCardNumber.errorMessages[0];
          errorMsgs.push(errorMsg);
        }
        if (Cvv.errorMessages.length > 0) {
          let errorMsg = "CVC " + Cvv.errorMessages[0];
          errorMsgs.push(errorMsg);
        }
        if (ExpirationDate.errorMessages.length > 0) {
          let errorMsg = "Expiration date " + ExpirationDate.errorMessages[0];
          errorMsgs.push(errorMsg);
        }
        if (enableEnhancedSecurity && !zipCode) {
          errorMsgs.push("Zip code is required");
        } else if (enableEnhancedSecurity && zipCode.length > 10) {
          errorMsgs.push("Zip code must be shorter than or equal to 10 characters");
        }



        if (errorMsgs.length) {
          const params = {
            errors: errorMsgs,
            hasError: true,
          };
          
          window.ReactNativeWebView.postMessage(JSON.stringify(params));
        } else {
          showPlaceOrderLoader();
          let url =
            "https://" +
            env +
            ".jupiterhq.com/v1/transactions/creditcard/tokenization/" +
            subMerchantId +
            "/session";

          let resp = await fetch(url);
          let sessionData = await resp.json();
          let sessionId;

          if (sessionData.data && sessionData.data.status === "valid") {
            sessionId = sessionData.data.sessionId;
          }

          form.submit(
            "/v1/transactions/creditcard/tokenization/" + subMerchantId,
            { data: { sessionToken: sessionId } },
            function (status, data) {
              
              const saveCard = document.getElementById(
                "saveThisCardForFutureCheckout"
              ).checked;

              window.ReactNativeWebView.postMessage(
                JSON.stringify({ ...data, saveCard }).replace(/,/g, " , ")
              );

              

                removePlaceOrderLoader();
            }
          );
        }

        
      };

      document
        .getElementById("cc-form")
        .addEventListener("submit", submitForm, function (errors) {
          document.getElementById("result").innerHTML = errors;
        });
    </script>
  </body>
</html>
`;
