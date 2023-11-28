import React, { useEffect, useState } from 'react';
import { PermissionsAndroid } from 'react-native';

import {
  CameraRoll,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';

import ImagePicker, { Image } from 'react-native-image-crop-picker';

import { ModalsRoutes, ModalsScreenProps } from '#navigation/Modals/types';

import { usePostImageMutation } from '#api/controllers/Help';
import { useUpdateUserMutation } from '#api/controllers/User';

import ToastManager from '#services/ToastManager';

import useErrorHandler from '#hooks/utils/useErrorHandler';
import useModal, { ModalController } from '#hooks/utils/useModal';

import { IS_IOS } from '#styles';

import Layout from './layout';

type NavigationProps = ModalsScreenProps<ModalsRoutes.UpdateAvatar>;

type CameraRollImage = PhotoIdentifier['node']['image'];

const Container: React.FC<NavigationProps> = props => {
  const modal = useModal();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingFromGallery, setIsLoadingFromGallery] = useState(false);
  const [isLoadingFromCamera, setIsLoadingFromCamera] = useState(false);

  const [updateUser, updateUserMeta] = useUpdateUserMutation();
  const [postImage, postImageMeta] = usePostImageMutation();

  const [quickAccessPhotos, setQuickAccessPhotos] = useState<CameraRollImage[]>(
    [],
  );

  const onDeleteAvatar = async () => {
    setIsDeleting(true);

    try {
      await updateUser({
        data: {
          image: '',
        },
      }).unwrap();

      ToastManager.success('Аватар был успешно удален');

      modal.close();
    } catch {}

    setIsDeleting(false);
  };

  const onOpenGallery = async () => {
    setIsLoadingFromGallery(true);
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        writeTempFile: true,
        includeBase64: true,
        mediaType: 'photo',
      });

      await updateUserImage(image);
    } catch {}
    setIsLoadingFromGallery(false);
  };

  const onOpenCamera = async () => {
    setIsLoadingFromCamera(true);
    try {
      const image = await ImagePicker.openCamera({
        width: 300,
        height: 300,
        cropping: true,
        writeTempFile: true,
        includeBase64: true,
        mediaType: 'photo',
      });

      await updateUserImage(image);
    } catch {}
    setIsLoadingFromCamera(false);
  };

  const onOpenQuickAccess = async (cameraRollImage: CameraRollImage) => {
    setIsLoadingFromGallery(true);
    try {
      const image = await ImagePicker.openCropper({
        width: 300,
        height: 300,
        cropping: true,
        writeTempFile: true,
        includeBase64: true,
        path: cameraRollImage.uri,
        mediaType: 'photo',
      });

      await updateUserImage(image);
    } catch {}
    setIsLoadingFromGallery(false);
  };

  const updateUserImage = async (image: Image) => {
    try {
      const response = await postImage({
        files: [
          {
            name: image.filename || `${Date.now()}.jpg`,
            uri: image.data as string,
            type: image.mime,
          },
        ],
      }).unwrap();

      await updateUser({
        data: {
          image: response.data,
        },
      }).unwrap();

      ToastManager.success('Аватар был успешно изменен');

      modal.close();
    } catch {}
  };

  const getQuickAccessPhotos = async () => {
    try {
      if (!IS_IOS) {
        await PermissionsAndroid.request(
          'android.permission.READ_EXTERNAL_STORAGE',
        );
      }

      const photoIdentifiers = await CameraRoll.getPhotos({
        first: 20,
      });
      const photosTransformed = photoIdentifiers.edges.map(el => el.node.image);

      setQuickAccessPhotos(photosTransformed);
    } catch {}
  };

  useEffect(() => {
    getQuickAccessPhotos();
  }, []);

  useErrorHandler(() => {}, postImageMeta);
  useErrorHandler(() => {}, updateUserMeta);

  return (
    <Layout
      /**
       *Options
       */
      isDeleting={isDeleting}
      isLoadingFromCamera={isLoadingFromCamera}
      isLoadingFromGallery={isLoadingFromGallery}
      modal={modal}
      quickAccessPhotos={quickAccessPhotos}
      /**
       *Methods
       */
      onDeleteAvatar={onDeleteAvatar}
      onOpenCamera={onOpenCamera}
      onOpenGallery={onOpenGallery}
      onOpenQuickAccess={onOpenQuickAccess}
      {...props}
    />
  );
};

type PassingStates = {};

type PassingProps = {
  isDeleting: boolean;
  quickAccessPhotos: CameraRollImage[];
  isLoadingFromGallery: boolean;
  isLoadingFromCamera: boolean;
  modal: ModalController;

  onDeleteAvatar: () => void;
  onOpenGallery: () => void;
  onOpenCamera: () => void;
  onOpenQuickAccess: (image: CameraRollImage) => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
