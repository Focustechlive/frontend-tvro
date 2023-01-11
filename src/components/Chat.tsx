import Script from 'next/script'

export function Chat() {
  return (
    <Script id="freshchat" type="text/javascript">
      {`
        function initFreshChat(){
          window.fcWidget.init({
            token: "71760711-ffb7-4517-891b-bc33d9854c0f",
            host: "https://sigaantenado.freshchat.com",
            open: true,
          });
        }
        function initialize(i,t){var e;i.getElementById(t)?
        initFreshChat():((e=i.createElement("script")).id=t,e.async=!0,
        e.src="https://sigaantenado.freshchat.com/js/widget.js",e.onload=initFreshChat,i.head.appendChild(e))}
        function initiateCall(){initialize(document,"Freshchat-js-sdk")}
        window.addEventListener?window.addEventListener("load",initiateCall,!1):
        window.attachEvent("load",initiateCall,!1);
        `}
    </Script>
  )
}
