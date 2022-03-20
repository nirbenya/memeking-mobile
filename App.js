import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { BackHandler } from 'react-native';
import React from 'react';

export default function App() {
	const [canGoBack, setCanGoBack] = React.useState(false);
	const webView = React.useRef();

	const handleBack = React.useCallback(() => {
		if (canGoBack && webView.current) {
			webView.current.goBack();
			return true;
		}
		return false;
	}, [canGoBack]);

	React.useEffect(() => {
		BackHandler.addEventListener('hardwareBackPress', handleBack);
		return () => {
			BackHandler.removeEventListener('hardwareBackPress', handleBack);
		};
	}, [handleBack]);

	const onSave = async event => {
		const data = event.nativeEvent.data;
		const base64Code = data.split('data:image/png;base64,')[1];

		const filename = FileSystem.documentDirectory + 'memeking.png';

		const permission = await MediaLibrary.requestPermissionsAsync();

		if (permission.status === 'granted') {
			try {
				await FileSystem.writeAsStringAsync(filename, base64Code, {
					encoding: FileSystem.EncodingType.Base64,
				});

				await MediaLibrary.saveToLibraryAsync(filename);

				alert('המם נשמר בהצלחה');
			} catch (e) {
				alert('לא הצלחנו לשמור את המם. נסו ללכת להגדרות ולתת הרשאות לאפליקציה');
			}
		} else {
			alert(JSON.stringify(permission));
		}
	};
	return (
		<View style={styles.container}>
			<WebView
				onLoadProgress={event => setCanGoBack(event.nativeEvent.canGoBack)}
				ref={webView}
				style={{ flex: 1, flexGrow: 1, marginTop: 40 }}
				injectedJavaScriptBeforeContentLoaded={`
                     
                     window.isWebView = true;
                     
                       
                     `}
				onMessage={onSave}
				source={{ uri: 'http://www.memeking.co.il' }}
			/>
			<StatusBar style="auto" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
});
