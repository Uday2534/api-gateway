import pino from 'pino';

/*
 WHY STRUCTURED LOGGING?

 Plain text logs are difficult for machines to
 search and aggregate.

 JSON logs can be indexed by ELK, Datadog,
 Splunk, Loki, and other observability tools.
*/

const isDevelopment =
  process.env.NODE_ENV !== 'production';

export const logger = pino(
  isDevelopment
    ? {
        transport: {
          target: 'pino-pretty',
        },
      }
    : {}
);