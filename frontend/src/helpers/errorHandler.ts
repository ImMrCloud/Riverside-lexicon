import { ApolloError } from '@apollo/client';
import { Alert } from 'react-native';

import { ERROR_413, ERROR_HANDLED_BY_LINK } from '../constants';
import { StackNavProp } from '../types';

import {
  ChangeUsernameError,
  EditPostError,
  LoginError,
  UsedTitleError,
} from './errorMessage';
import { stripHTML } from './stripHTML';

/** `isNotFoundError` accepts any object that has a string-based `message`
 * field. This includes `Error`, `ApolloError`, and `GraphQLError`.
 *
 * It then searches for the well-known text, `'could not be found'`, which
 * is what our GraphQL server returns when a particular query was not found.
 */
export function isNotFoundError(error: string) {
  return error.toLowerCase().includes('could not be found');
}

export function errorHandler(
  error: ApolloError,
  shouldMaskError = false,
  singularEntityName = '',
): string {
  let message = error.message;
  if (error.networkError) {
    const networkError = error.networkError;
    if (
      'result' in networkError &&
      'errors' in networkError.result &&
      Array.isArray(networkError.result.errors) &&
      networkError.result.errors.length > 0
    ) {
      message = networkError.result.errors[0];
    } else if (
      'response' in networkError &&
      'status' in networkError.response &&
      networkError.response.status === 413
    ) {
      message = ERROR_413;
    }
  }

  if (isNotFoundError(message)) {
    let message = t(`Sorry, we couldn't find what you were looking for.`);

    if (singularEntityName) {
      message = t(`Sorry, we couldn't find that {entity} for you.`, {
        entity: singularEntityName,
      });
    }

    return message;
  }

  if (shouldMaskError) {
    return t('发生了一些错误，请稍后重试\n这一般是由于服务器响应发生错误，阁下可以试试稍后刷新此页面，当然重新登录应该会解决此问题。');
  }

  return message;
}

export function errorHandlerAlert(
  error: ApolloError | string,
  navigate?: StackNavProp<'PostDetail'>['navigate'],
  isFiltered = false,
) {
  let errorMsg;

  if (typeof error === 'string') {
    errorMsg = error;
  } else {
    // This means the error is handled in error link
    if (error?.message === ERROR_HANDLED_BY_LINK) {
      return;
    }
    errorMsg = errorHandler(error, isFiltered);
  }
  let alertTitle;
  switch (errorMsg) {
    case LoginError:
      Alert.alert(t('请阁下登录'), errorMsg, [
        { text: t('关闭') },
        {
          text: t('登录'),
          onPress: () => (navigate ? navigate('Welcome') : undefined),
        },
      ]);
      return;
    case UsedTitleError:
      Alert.alert(
        t('标题已经存在'),
        t(
          '已存在相同标题的帖子，请尝试使用其他标题。',
        ),
        [{ text: t('明白了！') }],
      );
      return;
    case EditPostError:
      alertTitle = t('无法编辑');
      break;
    case ChangeUsernameError:
      alertTitle = t('用户名不可用');
      break;
    default:
      alertTitle = t('错误');
  }
  Alert.alert(alertTitle, stripHTML(errorMsg), [{ text: t('明白了！') }]);
}
