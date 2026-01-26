import React, { useEffect, useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Modal,
  Platform,
  TouchableOpacity,
  TouchableOpacityProps,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { ActivityIndicator, Divider, Icon, Text } from '../../../core-ui';
import { ProfileDocument } from '../../../generatedAPI/server';
import { errorHandlerAlert, useStorage } from '../../../helpers';
import { useDeleteEmail, useSetPrimaryEmail } from '../../../hooks';
import { makeStyles, useTheme } from '../../../theme';

type Props = TouchableOpacityProps & {
  emailAddress: string;
  type: 'PRIMARY' | 'SECONDARY' | 'UNCONFIRMED';
  onSetLoading: (value: boolean) => void;
};

const SecondaryEmailOptions = ['Set as primary', 'Delete', 'Cancel'];
const UnconfirmedEmailOptions = ['Delete', 'Cancel'];

export default function EmailAddressItem(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  const { emailAddress, type, onSetLoading } = props;

  const [showOptions, setShowOptions] = useState(false);

  const storage = useStorage();
  const username = storage.getItem('user')?.username || '';

  const ios = Platform.OS === 'ios';

  const { setPrimaryEmail, loading: setPrimaryEmailLoading } =
    useSetPrimaryEmail({
      variables: {
        input: {
          email: emailAddress,
        },
        username,
      },
      onError: (error) => {
        errorHandlerAlert(error);
        onSetLoading(false);
      },
      refetchQueries: [
        {
          query: ProfileDocument,
          variables: { username },
        },
      ],
    });

  const { deleteEmail, loading: deleteEmailLoading } = useDeleteEmail({
    onCompleted: () => {
      Alert.alert(
        'Success!',
        t('{emailAddress} 已被成功删除', { emailAddress }),
        [{ text: t('明白') }],
      );
    },
    onError: (error) => {
      errorHandlerAlert(error);
      onSetLoading(false);
    },
    refetchQueries: [
      {
        query: ProfileDocument,
        variables: { username },
      },
    ],
  });

  useEffect(() => {
    if (setPrimaryEmailLoading || deleteEmailLoading) {
      onSetLoading(true);
    }
  }, [setPrimaryEmailLoading, deleteEmailLoading, onSetLoading]);

  const onSetPrimaryEmail = () => {
    if (!ios) {
      setShowOptions(false);
    }
    setPrimaryEmail();
  };

  const onDeleteEmail = () => {
    if (!ios) {
      setShowOptions(false);
    }
    deleteEmail({ variables: { email: emailAddress, username } });
  };

  const showAlert = () =>
    Alert.alert(
      t('删除电邮地址？'),
      t('阁下真的想要删除此电邮地址吗？'),
      [
        {
          text: t('取消'),
          onPress: () => {
            if (!ios) {
              setShowOptions(false);
            }
          },
        },
        {
          text: t('删除'),
          onPress: onDeleteEmail,
        },
      ],
    );

  const onPressMoreVert = () => {
    if (ios) {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options:
            type === 'SECONDARY'
              ? SecondaryEmailOptions
              : UnconfirmedEmailOptions,
          cancelButtonIndex: type === 'SECONDARY' ? 2 : 1,
          destructiveButtonIndex: type === 'SECONDARY' ? 1 : 0,
        },
        (btnIndex) => {
          if (btnIndex === 0 && type === 'SECONDARY') {
            onSetPrimaryEmail();
          } else if (
            (btnIndex === 0 && type === 'UNCONFIRMED') ||
            (btnIndex === 1 && type === 'SECONDARY')
          ) {
            showAlert();
          }
        },
      );
    } else {
      setShowOptions(true);
    }
  };

  return (
    <>
      <>
        <View style={styles.container}>
          <View style={styles.content}>
            <Text>{emailAddress}</Text>
            {type === 'PRIMARY' && (
              <Text size="s" color="textLight" style={styles.primary}>
                {t('私人电邮地址')}
              </Text>
            )}
            {type === 'UNCONFIRMED' && (
              <Text size="s" color="textLight" style={styles.primary}>
                {t('未经验证')}
              </Text>
            )}
          </View>
          {type !== 'PRIMARY' &&
            (deleteEmailLoading ? (
              <ActivityIndicator />
            ) : (
              <TouchableOpacity
                onPress={onPressMoreVert}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              >
                <Icon name="MoreVert" color={colors.textLighter} />
              </TouchableOpacity>
            ))}
        </View>
        <Divider />
      </>
      {!ios && (
        <Modal visible={showOptions} animationType="fade" transparent={true}>
          <TouchableWithoutFeedback onPressOut={() => setShowOptions(false)}>
            <View style={styles.androidModalContainer}>
              {type === 'SECONDARY' && (
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={onSetPrimaryEmail}
                >
                  <Text style={styles.text} color="pureBlack" size="s">
                    {t('设置为主要')}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={showAlert}
              >
                <Text style={styles.text} color="error" size="s">
                  {t('删除')}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    height: 78,
    paddingHorizontal: spacing.xxl,
  },
  content: {
    flexDirection: 'column',
  },
  primary: {
    paddingTop: spacing.m,
  },
  androidModalContainer: {
    flex: 1,
    paddingHorizontal: spacing.xxxl,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  buttonContainer: {
    paddingLeft: spacing.xl,
    justifyContent: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.pureWhite,
  },
  text: {
    paddingVertical: spacing.xl,
  },
}));
