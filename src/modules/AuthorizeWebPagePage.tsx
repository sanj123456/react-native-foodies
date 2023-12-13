import React, {useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {WebView, WebViewMessageEvent, WebViewProps} from 'react-native-webview';
import {useAppSelector} from '../redux';

const VGSCollectFormHTMl = ``;

const AuthorizeWebPagePage = ({onMessage}: WebViewProps) => {
  const {subMerchantId} = useAppSelector((state) => state.gateway);
  const [webViewHeight, setWebViewHeight] = useState(15);
  const [isLoading, setIsloading] = useState(true);

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
        injectedJavaScript={`subMerchantId=${subMerchantId};`}
        scrollEnabled={true}
        automaticallyAdjustContentInsets={false}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default AuthorizeWebPagePage;
