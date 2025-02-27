import download from 'download';
import { trackEvent } from './analytics';
import platformPath from './platform-path';
import { botpressVersion, nightlyDate } from '../../package.json';
import buildUrl from './binary-url-builder';

const BINARIES_ZIP_URL = buildUrl(botpressVersion, platformPath, nightlyDate);

const downloadBinary = async (
  path: string,
  progressCallback: (data: any) => void
) => {
  trackEvent('downloadBinaryStart');
  await new Promise((resolve, reject) => {
    download(BINARIES_ZIP_URL, path, { extract: true })
      .on('response', (res) => {
        const total = res.headers['content-length'];
        progressCallback({ total, downloading: true });
        let downloadedLength = 0;
        res.on('data', (data) => {
          downloadedLength += data.length;
          progressCallback({ downloadedLength });
        });
      })
      .then(() => {
        resolve(true);
        progressCallback({ downloading: false });
        return { downloading: true };
      })
      .catch((reason: any) => {
        reject(reason);
      });
  });
  trackEvent('downloadBinaryEnd');
};

export default downloadBinary;
