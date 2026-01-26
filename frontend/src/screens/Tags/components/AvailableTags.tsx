import React from 'react';
import { View, ViewProps } from 'react-native';

import { LoadingOrError } from '../../../components';
import { Text } from '../../../core-ui';
import { makeStyles } from '../../../theme';
import { Tag } from '../../../types';

import { TagItem } from './TagItem';

type Props = ViewProps & {
  loading: boolean;
  searchTag: string;
  tags: Array<Tag>;
  selectedTags: Array<string>;
  canCreateTag?: boolean;
  onCreateTag: (content: string) => void;
  onSelectedTag: (id: string) => void;
};

export function AvailableTags(props: Props) {
  const styles = useStyles();

  const {
    loading,
    searchTag,
    tags,
    selectedTags,
    canCreateTag,
    onCreateTag,
    onSelectedTag,
    ...otherProps
  } = props;

  let searchSpecialCase;
  let isSearchSelected = selectedTags?.includes(searchTag);

  if (searchTag) {
    if (isSearchSelected) {
      //input value in search text field is selected
      searchSpecialCase = (
        <TagItem tagName={searchTag} rightLabel={t('选中')} />
      );
    } else if (!tags.find(({ id }) => id === searchTag) && canCreateTag) {
      //input value in search text field is not found, but user can create that tag
      searchSpecialCase = (
        <TagItem
          tagName={searchTag}
          rightLabel={t('创建标签')}
          onItemPress={onCreateTag}
        />
      );
    }
  }

  let loadingOrNoData =
    tags.length === 0 && !isSearchSelected ? (
      <View style={styles.content}>
        {!loading ? (
          <Text>
            {!canCreateTag
              ? t('没有找到已存在的标签')
              : searchTag === ''
              ? t(
                  '未找到相关标签 在上方搜索并回车即可创建',
                )
              : null}
          </Text>
        ) : (
          <LoadingOrError loading />
        )}
      </View>
    ) : null;

  return (
    <View {...otherProps}>
      <Text variant="bold">{searchTag ? t('结果') : t('热门标签')}</Text>
      {!searchTag && tags.length > 0 && (
        <Text size="s" style={styles.smallText}>
          {canCreateTag
            ? t('U使用搜索栏发现更多标签或者创建一个')
            : t('使用搜索栏发现更多标签')}
        </Text>
      )}

      {searchSpecialCase}

      {tags.map((tag) => (
        <TagItem
          key={tag.id}
          onItemPress={onSelectedTag}
          tagName={tag.id}
          rightIcon="AddCircle"
        />
      ))}

      {loadingOrNoData}
    </View>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xl,
  },
  smallText: {
    paddingTop: spacing.m,
  },
}));
