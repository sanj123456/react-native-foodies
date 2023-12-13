import React, {useState} from 'react';
import {ActivityIndicator, View, Text} from 'react-native';
import {WebView, WebViewMessageEvent, WebViewProps} from 'react-native-webview';
import {API_KEYS, isStag} from '../constants/constants';
import {useAppSelector} from '../redux';
import {prettyPrint} from '../utils/functions';

const TilledWebView = ({onMessage}: WebViewProps) => {
  const {tilledPublishableKey, tilledAccountId} = useAppSelector((state) => state.gateway);
  const [webViewHeight, setWebViewHeight] = useState(0);
  const [isLoading, setIsloading] = useState(true);

  const log_level = 0;

  const injectedJavaScript = `accountId="${tilledAccountId}";publishableKey="${tilledPublishableKey}";sandbox=${isStag};log_level=${log_level};`;
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
          uri: API_KEYS.tilled_uri,
        }}
        onMessage={_onMessage}
        injectedJavaScript={injectedJavaScript}
        scrollEnabled={true}
        automaticallyAdjustContentInsets={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onError={prettyPrint}
        cacheEnabled={false}
      />
    </View>
  );
};
export default TilledWebView;
