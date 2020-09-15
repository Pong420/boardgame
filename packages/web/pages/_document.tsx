import React from 'react';
import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript
} from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return initialProps;
  }

  render() {
    return (
      <Html>
        <Head>
          <title>Boardgame</title>
        </Head>
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (() => {
                function get(key, defaultValue) {
                  try {
                    return localStorage.getItem(key);
                  } catch (error) {
                    console.log(error)
                    return defaultValue;
                  }
                }
              
                var THEME = 'BOARDGAME_THEME';
                window.__initialTheme = get(THEME, 'dark');
                window.__setTheme = function (theme) {
                  document.documentElement.setAttribute('data-theme', theme);
                  document.documentElement.classList[theme === 'dark' ? 'add' : 'remove'](
                    'bp3-dark'
                  );
                  try {
                    localStorage.setItem(THEME, theme);
                  } catch {}
                };
                window.__setTheme(window.__initialTheme)
              
                var SCREEN_WIDTH = 'BOARDGAME_SCREEN_WIDTH';
                window.__initialScreenWidth = get(SCREEN_WIDTH, 'limited');
                window.__setScreenWidth = function (screenWidth) {
                  document.documentElement.setAttribute('data-screen-width', screenWidth);
                  try {
                    localStorage.setItem(SCREEN_WIDTH, screenWidth);
                  } catch {}
                };
                window.__setScreenWidth(window.__initialScreenWidth)
              })();
            `
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
