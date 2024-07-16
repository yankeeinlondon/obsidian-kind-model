import { isString } from 'inferred-types';
import { createDocument, HappyDoc } from '@yankeeinlondon/happy-wrapper';
import KindModelPlugin from '../main';



export const loadRemoteDom = async (targetUrl: string, timeout = 0, plugin: KindModelPlugin): Promise<HappyDoc> => {
	const window: BrowserWindow = new BrowserWindow({
		width: 1000,
		height: 600,
		webPreferences: {
		  webSecurity: false,
		  nodeIntegration: false,
		},
		show: false,
	  });

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  window.loadURL(targetUrl);

  return new Promise<HappyDoc>((resolve) => {

    window.webContents.on('did-finish-load', (_event: unknown, _url: string) => {
      Promise.resolve()
        .then(() => {
          if (timeout > 0) {
            return new Promise((resolve) => {
              setTimeout(resolve, timeout);
            });
          }
        })
        .then(() => {
          return window.webContents.executeJavaScript(
            `document.querySelector('body').innerHTML`
          );
        })
        .then((html) => {
			window.destroy();
			if (isString(html)) {
				plugin.debug(`got HTML response from ${targetUrl}`);
				resolve(createDocument(html));
			} else {
				plugin.error(`Failed to get an HTML response from ${targetUrl}`);
			}
        });
    });
  });
};
