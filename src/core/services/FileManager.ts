import RNFetchBlob from 'react-native-blob-util';
import * as Keychain from 'react-native-keychain';

import { API_URL } from '#env';

export type InternalFile = {
  name: string | null;
  uri: string | null;
  type?: string;
};

class FileManager {
  static async upload(
    url: string,
    data: Record<string, any | undefined>,
    files: InternalFile[],
    fileField = 'files[]',
  ) {
    const form: {
      name: string;
      data: string;
      filename?: string;
    }[] = Object.entries(data).map(([key, value]) => ({
      name: key,
      data: value,
    }));

    files.forEach(el =>
      form.push({
        name: fileField,
        filename: `${el.name}`,
        data: `${el.uri}`,
      }),
    );

    const credentials = await Keychain.getGenericPassword();

    const result = await RNFetchBlob.fetch(
      'POST',
      `${API_URL}${url}`,
      {
        Authorization: credentials ? `Bearer ${credentials.password}` : '',
        'Content-type': 'multipart/form-data',
      },
      form,
    );

    return result;
  }
}

export default FileManager;
