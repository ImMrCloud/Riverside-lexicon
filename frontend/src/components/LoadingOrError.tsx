import React from 'react';
import {
  StyleProp,
  ScrollView,
  View,
  ViewStyle,
  RefreshControl,
  RefreshControlProps,
} from 'react-native';

import { ActivityIndicator, Text } from '../core-ui';
import { makeStyles, useTheme } from '../theme';

type Props = Pick<RefreshControlProps, 'progressViewOffset' | 'onRefresh'> & {
  message?: string;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  refreshing?: boolean;
};

export function LoadingOrError(props: Props) {
  return <LoadingOrErrorView {...props} />;
}

export function LoadingOrErrorView(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();
  const {
    loading = false,
    message = loading
      ? t('加载中，请稍后...')
      : t('发生了一些错误，请稍后重试\n这一般是由于服务器响应发生错误，阁下可以试试稍后刷新此页面，当然重新登录应该会解决此问题。'),
    style,
    onRefresh,
    refreshing,
    progressViewOffset,
  } = props;

  return onRefresh ? (
    <ScrollView
      contentContainerStyle={[styles.scrollViewContentStyle, style]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing || false}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          progressViewOffset={progressViewOffset}
        />
      }
    >
      <View style={styles.container}>
        {loading ? <ActivityIndicator size="small" /> : null}
        <Text>{message}</Text>
      </View>
    </ScrollView>
  ) : (
    <View style={[styles.container, style]}>
      {loading ? <ActivityIndicator size="small" /> : null}
      <Text>{message}</Text>
    </View>
  );
}

const useStyles = makeStyles(() => ({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  scrollViewContentStyle: { flex: 1 },
}));
