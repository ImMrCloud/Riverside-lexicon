import React, { useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/core';

import { CustomHeader, HeaderItem, ModalHeader } from '../../components';
import { ColorScheme, useStorage } from '../../helpers';
import { makeStyles, useColorScheme } from '../../theme';
import { StackNavProp } from '../../types';

import SettingsItem from './components/SettingsItem';

export default function DarkMode() {
  const { setColorScheme } = useColorScheme();
  const styles = useStyles();

  const { goBack } = useNavigation<StackNavProp<'Preferences'>>();

  const storage = useStorage();
  const [cachedColorScheme, setCachedColorScheme] = useState(
    storage.getItem('colorScheme'),
  );

  const ios = Platform.OS === 'ios';

  const Header = () =>
    ios ? (
      <ModalHeader
        title={t('晚黑模式')}
        left={<HeaderItem label={t('返回')} left onPressItem={goBack} />}
      />
    ) : (
      <CustomHeader title={t('晚黑模式')} />
    );

  const changeColorScheme = (colorScheme: ColorScheme) => {
    setColorScheme(colorScheme);
    setCachedColorScheme(colorScheme);
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView>
        <View style={styles.bodyContainer}>
          <View style={styles.menuContainer}>
            <SettingsItem
              title={t('开启')}
              onPress={() => changeColorScheme('dark')}
              selected={cachedColorScheme === 'dark'}
            />
            <SettingsItem
              title={t('关闭')}
              onPress={() => changeColorScheme('light')}
              selected={cachedColorScheme === 'light'}
            />
            <SettingsItem
              title={t('跟随系统决定')}
              onPress={() => changeColorScheme('no-preference')}
              selected={cachedColorScheme === 'no-preference'}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bodyContainer: {
    backgroundColor: colors.backgroundDarker,
  },
  menuContainer: {
    backgroundColor: colors.background,
    marginTop: spacing.m,
  },
}));
