# Forge
Email/Sms/Push Template Manager based off [EmailBuilder.js](https://www.usewaypoint.com/open-source/emailbuilderjs)

## Features
- Largely based off the [EmailBuilder.js example self hostable version](https://github.com/usewaypoint/email-builder-js/tree/main/packages/editor-sample).
- Allow Load and Save of Templates
- Add support for SMS/Push Templates

## Methodology
Goal is to provide a simple way to manage templates for emails, sms and push notifications. This project should be able to be deployed via `docker`.
It should support storing and retrieving templates in any storage medium (local, s3 and azure). We will use the [gocloud.dev/blob](gocloud.dev/blob)` library to abstract the storage medium.

## Usage (Server)

```bash
cd server
```

### Local
```bash
make local
```

### Azure Blob Storage
```bash
make azure
```
