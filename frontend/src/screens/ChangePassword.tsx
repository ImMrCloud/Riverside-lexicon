import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, View } from 'react-native';

import { CustomHeader } from '../components';
import { Button, Text } from '../core-ui';
import { useStorage } from '../helpers';
import { useChangePassword, useProfile } from '../hooks';
import { makeStyles } from '../theme';
import { StackNavProp, UserDetail } from '../types';
import { useDevice } from '../utils';

export default function ChangePassword() {
  const storage = useStorage();
  const styles = useStyles();
  const { isTabletLandscape } = useDevice();

  const { goBack } = useNavigation<StackNavProp<'ChangePassword'>>();

  const { data: userData } = useProfile(
    {
      variables: { username: storage.getItem('user')?.username || '' },
    },
    'HIDE_ALERT',
  );

  const [errorMessage, setError] = useState(false);
  const [user, setUser] = useState<UserDetail>({
    __typename: 'UserDetail',
    avatar: '',
    bioRaw: '',
    dateOfBirth: '',
    location: '',
    name: '',
    username: '',
    websiteName: '',
    email: '',
    secondaryEmails: [],
    unconfirmedEmails: [],
    canEditUsername: true,
    admin: true,
  });

  const ios = Platform.OS === 'ios';

  useEffect(() => {
    if (userData) {
      // eslint-disable-next-line no-underscore-dangle
      userData.profile.user.__typename === 'UserDetail' &&
        setUser(userData.profile.user);
    }
  }, [userData, setUser]);

  const { changeNewPassword, loading, error } = useChangePassword({
    onCompleted: () => {
      Alert.alert(
        t('成功'),
        t('阁下应当很快会收到一封修改密码的电子邮件'),
        [{ text: 'Got it' }],
        { cancelable: false },
      );
      if (!isTabletLandscape) {
        goBack();
      }
    },
    onError: () => {
      setError(true);
    },
  });

  const email = user.email;

  const onPressSend = () => {
    setError(false);
    changeNewPassword({
      variables: {
        changePasswordInput: {
          login: email,
        },
      },
    });
  };

  return (
    <View style={styles.container}>
      {!ios ? (
        <CustomHeader
          title={t('修改密码')}
          hideHeaderLeft={isTabletLandscape}
        />
      ) : (
        <CustomHeader
          title={t('修改密码')}
          rightTitle={t('发送')}
          onPressRight={onPressSend}
          isLoading={loading}
          hideHeaderLeft={isTabletLandscape}
        />
      )}
      <View style={styles.inputContainer}>
        {errorMessage && (
          <Text color="error" style={styles.spacingBottom}>
            {error?.message}
          </Text>
        )}
        <Text style={styles.disclaimerStyle}>{t('电子邮件')}</Text>
        <Text style={styles.spacingBottom}>{user.email}</Text>
        <Text style={styles.disclaimerStyle}>
          {t(
            '系统将会向阁下的电子邮件发送一封重置密码的链接',
          )}
        </Text>
      </View>
      {!ios && (
        <View style={styles.buttonContainer}>
          <Button
            content="Send Email"
            large
            onPress={onPressSend}
            loading={loading}
          />
        </View>
      )}
    </View>
  );
}

const useStyles = makeStyles(({ colors, fontSizes, spacing }) => ({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  disclaimerStyle: {
    color: colors.textLight,
    fontSize: fontSizes.s,
  },
  inputContainer: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxl,
  },
  spacingBottom: {
    paddingBottom: spacing.xl,
  },
  buttonContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    marginVertical: spacing.xl,
    marginHorizontal: spacing.l,
  },
}));
