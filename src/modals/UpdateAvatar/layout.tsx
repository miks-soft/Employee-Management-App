import React from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

import { Icon, LineButton, Loader } from '#ui-kit';
import { H2 } from '#ui-kit/Text';

import { ModalWrapper } from '#components';

import { colors } from '#styles';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  return (
    <ModalWrapper
      contentContainerStyle={styles.modalContentContainer}
      visible={props.modal.visible}
      setVisible={props.modal.setVisible}
    >
      <View style={styles.paddedContainer}>
        <H2 style={styles.title}>Изменение аватара</H2>
      </View>

      <FlatList
        contentContainerStyle={styles.listContentContainer}
        data={props.quickAccessPhotos}
        horizontal={true}
        ListHeaderComponent={
          <TouchableOpacity
            disabled={props.isLoadingFromCamera}
            onPress={props.onOpenCamera}
          >
            <View style={styles.image}>
              {props.isLoadingFromCamera ? (
                <Loader fullscreen />
              ) : (
                <Icon
                  name="camera"
                  size={36}
                />
              )}
            </View>
          </TouchableOpacity>
        }
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => props.onOpenQuickAccess(item)}>
            <Image
              source={{ uri: item.uri }}
              style={styles.image}
            />
          </TouchableOpacity>
        )}
      />

      <View style={styles.paddedContainer}>
        <LineButton
          isLoading={props.isLoadingFromGallery}
          type="accept"
          onPress={props.onOpenGallery}
        >
          Открыть галерею
        </LineButton>

        <LineButton
          isLoading={props.isDeleting}
          type="reject"
          onPress={props.onDeleteAvatar}
        >
          Удалить фото
        </LineButton>

        <LineButton
          type="accept"
          onPress={props.modal.close}
        >
          Назад
        </LineButton>
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 12,
  },
  modalContentContainer: {
    paddingHorizontal: 0,
  },
  paddedContainer: {
    paddingHorizontal: 16,
  },
  listContentContainer: {
    paddingBottom: 4,
    paddingHorizontal: 16,
    gap: 8,
  },
  image: {
    width: 56,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: colors.grayscale.__60,
  },
});

export default Layout;
