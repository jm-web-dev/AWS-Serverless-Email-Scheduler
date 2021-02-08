export default {
  name: `newScheduledEmail`,
  handler: `${__dirname.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'new-email',
        cors: true
      }
    }
  ]
}