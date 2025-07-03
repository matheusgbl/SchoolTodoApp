// sentry.config.ts
import * as Sentry from '@sentry/react-native';
import { SENTRY_DSN } from '@env';

Sentry.init({
  dsn: SENTRY_DSN,
  enableInExpoDevelopment: true,
  debug: __DEV__,
});
