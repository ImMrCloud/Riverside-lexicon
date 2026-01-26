import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, Text as RNText, View } from 'react-native';

import { DarkLogo, LightLogo } from '../../assets/images';
import { Button, Text } from '../core-ui';
import { makeStyles, useColorScheme } from '../theme';
import { StackNavProp } from '../types';

export default function Welcome() {
  const { colorScheme } = useColorScheme();
  const styles = useStyles();

  const { navigate } = useNavigation<StackNavProp<'Welcome'>>();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={colorScheme === 'dark' ? DarkLogo : LightLogo}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.textCenter}>
          {t('通过注册或登录，以便阁下完整访问清水河畔的内容。')}
        </Text>
      </View>
      <Button
        content={t('注册/登录')}
        large
        onPress={() => navigate('AuthenticationWebView')}
      />
      <View style={styles.disclaimerContainer}>
        <RNText style={styles.disclaimerStyle}>
          {t('点击按钮则视为阁下同意 ')}
          <RNText style={styles.inlineColor}>{t('隐私政策')}</RNText>
          {t('以及')}
          <RNText style={styles.inlineColor}>{t('用户服务协议')}</RNText>
        </RNText>
      </View>
    </View>
  );
}

const useStyles = makeStyles(({ colors, spacing, fontSizes }) => ({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  logoContainer: { flexGrow: 1, justifyContent: 'center' },
  logo: {
    height: 120,
    width: '100%',
    marginVertical: spacing.xxxl,
    backgroundColor: colors.background,
  },
  textCenter: { textAlign: 'center' },
  disclaimerContainer: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  disclaimerStyle: {
    color: colors.textLight,
    fontSize: fontSizes.s,
    textAlign: 'center',
  },
  inlineColor: { color: colors.primary },
}));
